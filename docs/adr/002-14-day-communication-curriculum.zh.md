# ADR-002：14 天沟通与魅力课程合约

**日期:** 2026-07-16  
**状态:** Accepted  
**作者:** Xing @ XingAI  
**Also available:** [English](002-14-day-communication-curriculum.md)

## 背景

ADR-001 固定了练习评审的**记忆**形态（Decision Ledger），但没有定义每天**练什么**。

若缺少课程合约，产品会滑向：

- 无技能进阶的随机场景轮换，
- 只改语法（Grammarly 克隆），
- 或 LLM 自由发挥、结构不可复用。

Engineering Communication & Charisma Coach 要求固定的 10–15 分钟日环：技能 → 真实工程场景 → 用户先作答 → 结构化评审（层级、表达、声音、单点焦点）。

## 决策

1. **课程负责技能排序。** `lib/curriculum.ts` 定义第 1–14 天（核心）与第 14 天后循环的进阶主题。`UserLearningProfile.curriculumDay` 选日；采纳（Accept）推进天数。

2. **场景库与课程日一一对应**（`lib/scenario-bank.ts`，偏 Azure/.NET/微服务）。无 API key 可确定性生成；LLM 路径仍须输出同一开场结构（技能中文解释、场景、提示、结束语）——见 `lib/prompts.ts`。

3. **评审合约为第 4–10 节**，非仅语法：
   - 逐句表，
   - Level 1 Correct / Level 2 Natural / Level 3 Senior，
   - 最终专业版，
   - 可复用表达，
   - 声音建议，
   - 微练习，
   - 进度且**只强调一个**焦点。

4. **评审仍只经 Decision Ledger 写入**（ADR-001）。课程日是档案/会话状态，不是第二套记忆 schema。

## 后果

正向：

- 练习按日复利，而不是永远重抽同一条 PR 评论。
- 离线与 LLM 共用同一形状——更易测试与本地化（en/zh/ko UI；技能说明偏中文）。

代价：

- 固定日模板在进阶循环 / LLM 新鲜度跟上之前可能显得重复。
- 课程文案是产品内容——改日含义应视为 ADR 级变更，而非静默改文案。

## 后续

- Tech blog：沟通教练上的课程 + 台账
- Enterprise design：职场 AI 的技能课程模式
- 存储从内存/localStorage 升级后，服务端持久化 curriculum day

## 链接

- ADR-001：[Decision Ledger Adoption](001-decision-ledger-adoption.md)
- 代码：`lib/curriculum.ts`、`lib/scenario-bank.ts`、`lib/prompts.ts`、`lib/review-engine.ts`
