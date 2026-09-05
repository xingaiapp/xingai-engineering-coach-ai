# XingAI Engineering English Coach — PRD (draft v0.1)

**日期:** 2026-07-16
**状态:** Draft — 待建仓库
**来源:** 用户产品设计(prompts/数据结构/MVP 已完成)+ 本文档补上的 XingAI 架构约定对齐

---

## 0. 这份 PRD 在补什么

你已经把产品设计写得很完整:定位、Master Prompt、每日练习/Review/Email/Notification
四条 Prompt、设置页、MVP 1.0/1.5/2.0、TypeScript 数据结构、首页文案。这些不需要重写。

这份 PRD 只做一件事:把它对齐到 XingAI 现有的、已经在多个产品里跑起来的架构约定,
避免重复发明两个仓库都已经踩过的坑。具体是三处:

1. **反馈闭环不要自建 schema** —— 你的 `ExerciseReview` 已经等价于 XingAI 的共享
   Decision 台账形态,应该直接复用,而不是单独维护一套 `weakness_patterns`/
   `saved_phrases` 表作为"真相来源"。
2. **架构边界** —— 按 `xingai-global-standard` 的 worker/cache 约定来分层,不要让
   FastAPI/Next.js API 路由现算 review。
3. **仓库命名与 i18n/主题/SEO/AEO** —— 沿用 XingAI 现有产品的落地页标准,不要单独
   设计一套。

---

## 1. 定位(沿用你的原文,未改动)

**产品名:** XingAI Engineering English Coach

**Tagline:** Communicate like a senior engineer—not just a fluent English speaker.
(中文:不只是把英语说对,而是像美国资深工程师一样沟通。)

**一句话定位:** Help non-native English-speaking engineers communicate like senior
engineers and engineering managers.

**差异化(沿用你的对比):**

```text
Grammarly            → 让句子语法正确
普通 English App      → 教单词和日常对话
XingAI Engineering English → 教工程师如何表达风险、决策、影响、责任和下一步
```

---

## 2. 反馈闭环 = XingAI 共享 Decision 台账,不是新 schema

### 2.1 已经存在的真实先例

`xingai-invest-decision-engine/decisions/ledger.py` 是 XingAI 第一个落地的 Decision
台账实现(ADR-015),字段是:

```python
@dataclass(frozen=True)
class Decision:
    id: str
    product: str
    domain: str
    question: str
    recommendation: str
    reasoning: list[str]
    confidence: float
    alternatives: list[str]
    risks: list[str]
    action_taken: str | None      # "followed" | "ignored" | "modified"
    outcome: str | None
    outcome_recorded_at: datetime | None
    created_at: datetime
    source_ref: str | None
```

`ADR-016(Cross-Product Decision Ledger)`已经把这个 schema 定成跨产品契约,规定了
接入顺序(Meal AI → Invest AI → Opportunity Radar → Polymarket AI),并且明确写了
读取契约(`GET /api/decisions?domain=...`,worker 写、FastAPI/Next.js 只读缓存)
和反馈写入路径(`record_outcome()`,由发起推荐的产品自己调用,不进中心数据库)。

**这意味着:** 你原来设计里 `ExerciseReview` 打算记录的东西——用户对每句修改的
Accept/Edit/Reject、进步趋势——本质上就是"一次推荐 + 一次结果反馈",和 Invest AI
的"一次调仓建议 + 用户是否照做"是同一个形状。不需要另起一套 memory schema。

### 2.2 字段映射

| 你的原设计 | 映射到 Decision 台账字段 |
|---|---|
| `DailyExercise` | 生成一条 `question`(场景 + 沟通目标) |
| AI 逐句修改 + Professional Polished Version | `recommendation` = polished version;`reasoning` = 每句的 Why 解释列表 |
| Reusable Phrases | `alternatives` |
| Progress Coaching 提到的弱点 | `risks`(比如 `["overuse_of_i_think", "vague_verbs"]`) |
| 用户点 Accept / Edit / Reject / Save phrase | `action_taken`:Accept→`followed`,Edit→`modified`,Reject→`ignored`(通过 `record_outcome()` 写入) |
| 是否"用在真实邮件里" | `outcome`(自由文本,例如 `"used_in_real_email"`) |
| `domain` | 固定为 `"engineering-english-exercise"` |
| `source_ref` | 指回本产品自己的 `exercise_id`,避免和台账行重复 |

`weak_areas`/`saved_phrases`/`improvementScore` 这类"衍生统计"不消失——它们变成
**从 `decisions` 表按 `domain + risks` 聚合出来的读时视图**,而不是独立的写入真相源。
这正是 ADR-016 里"不做 normalized_confidence 字段,聚合是读时关注点"的同一条原则。

### 2.3 需要新增的 ADR

在本产品自己的仓库里写一份 `docs/adr/001-decision-ledger-adoption.md`,内容对齐
`xingai-engineering-system/patterns/decision-ledger-schema.md` 和 ADR-016,并把
本产品加进 ADR-016 的 "adoption order"(它目前只列了原始 5 个产品,不含这个新品,
需要在这份新 ADR 里显式声明"第 6 个采纳者")。

---

## 3. 架构边界(按 `xingai-global-standard` 五条原则对齐)

| 原则 | 在本产品里的落地 |
|---|---|
| **Worker 架构** | 每日练习生成、逐句 Review、Weekly Report 全部在 worker 里跑(调用你写的四条 Prompt),写入 `decisions` 表 + 本产品自己的 `daily_exercises`/`sentence_corrections` 表。FastAPI/Next.js API 只读缓存,不在请求路径里现算 LLM review。 |
| **i18n** | 所有 UI 字符串(设置页、Email、Notification 文案、Weekly Report 标题)通过 `tr(lang, en, zh?)` 走,不要把中文只放在"解释"里、UI 本身是英文硬编码。Feedback language 设置(中文/英文/双语)对应 `tr()` 的语言参数,而不是另建一套翻译逻辑。 |
| **主题** | 落地页 / App 内练习页用 CSS 变量类(`bg-background`、`text-foreground`、`border-border`、`bg-card`),不要为这个产品单独定义调色板。 |
| **SEO** | 落地页导出 `metadata: Metadata`,带 OG tags + `canonical`(来自 `SITE_URL` 环境变量)。 |
| **AEO** | 落地页服务端渲染一段 JSON-LD `FAQPage`(4–6 个问答,例如"这和 Grammarly 有什么区别""需要多久见效""支持哪些母语"),对齐你已经写好的差异化文案。 |
| **移动端** | 练习提交框、Accept/Edit/Reject 按钮保证 44px 触控目标;Weekly Report 表格 `overflow-x-auto`。 |

---

## 4. 数据结构(在你原设计基础上,加入台账字段)

```typescript
// 保留你的原设计,新增 decisionId 关联到共享台账
interface UserLearningProfile {
  userId: string;
  nativeLanguage: string;
  preferredFeedbackLanguage: string;
  englishLevel: "beginner" | "intermediate" | "advanced";
  currentRole: string;
  targetRole: string;
  technicalAreas: string[];
  weakAreas: string[]; // 派生视图,定期从 decisions.risks 聚合刷新,不单独手写
  preferredChannels: Array<"app" | "email" | "push">;
  schedule: {
    frequency: "daily" | "weekdays" | "three_times_weekly" | "weekly";
    time: string;
    timezone: string;
  };
}

interface DailyExercise {
  id: string;
  userId: string;
  title: string;
  category: string;
  scenario: string;
  audience: string;
  communicationGoal: string;
  requiredPoints: string[];
  optionalOpeningSentence?: string;
  difficulty: number;
  scheduledAt: string;
  status: "scheduled" | "delivered" | "started" | "completed";
  decisionId?: string; // 关联到 decisions 表里对应的台账行
}

interface ExerciseReview {
  exerciseId: string;
  decisionId: string;       // 必填 —— 这次 review 本身就是一条 Decision
  userResponse: string;
  sentenceReviews: SentenceReview[];
  polishedVersion: string;  // == Decision.recommendation
  reusablePhrases: string[]; // == Decision.alternatives
  improvementAreas: string[]; // == Decision.risks
  score: {
    grammar: number;
    clarity: number;
    professionalism: number;
    leadershipTone: number;
    technicalPrecision: number;
  };
}

interface SentenceReview {
  original: string;
  improved: string;
  explanation: string;
}
```

---

## 5. 四条 Master Prompt / Email / Notification Prompt

沿用你已经写好的版本,一字不改地作为 v1 实现:System Prompt、每日练习生成 Prompt、
Review Prompt、Email Prompt、Notification Prompt。这部分设计质量已经很高,唯一的
接线变化是:Review Prompt 输出的"Today's Improvement Areas"和"Professional
Polished Version"在保存时分别写入 `Decision.risks` 和 `Decision.recommendation`,
而不是只存在聊天记录里。

---

## 6. MVP 计划(沿用你的三阶段,补一条台账任务)

**MVP 1.0** 在你原有的 8 项基础上,增加:

- [ ] 建 `decisions` 表(按 ADR-015 的 schema),`domain="engineering-english-exercise"`
- [ ] 每次 Review 完成后调用等价于 `DecisionLedger.record()` 的写入
- [ ] 用户点 Accept/Edit/Reject 时调用等价于 `record_outcome()` 的写入
- [ ] 暴露 `GET /api/decisions?domain=engineering-english-exercise` 只读端点(对齐
      ADR-016 的跨产品读取契约,即便暂时没有其他产品来读)

其余 MVP 1.0 / 1.5 / 2.0 内容保持你原设计不变。

---

## 7. 仓库与命名建议

- 建议仓库名:`xingai-engineering-coach-ai`(对齐 `xingai-meal-coach-ai` 的
  "xingai-<领域>-coach-ai" 命名先例),而不是更泛的 "english-coach"——名字里带
  "engineering" 直接呼应差异化定位("不是通用英语 App")。
- 首个 ADR:`001-decision-ledger-adoption.md`(见第 2.3 节)。
- README 里应明确写清楚:本产品的"记忆"不是独立发明,而是 XingAI 共享 Decision
  台账在 `domain=engineering-english-exercise` 下的一个实例——方便未来 xingai.app
  的统一 Decision History 页面直接把它接进去。

---

## 8. 未改动、按你原文保留的部分

首页文案、Tagline、四条 Prompt 全文、设置页选项表、通知/Email 示例——均按你提供的
原文作为最终版本,本 PRD 不重复贴出全文,仅在上面标注了它们和台账字段的映射关系。
