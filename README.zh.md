# XingAI 工程英语教练

English: [README.md](README.md)

> 像资深工程师一样沟通,而不只是把英语说流利。

每天一个真实的工程职场场景(排查 bug、写 PR 描述、code review、架构评审、
生产事故、交付风险沟通、干系人汇报等),逐句英文评审、专业润色版本、以及
可复用表达——专为非英语母语的软件工程师打造。

## 差异化

```text
Grammarly            → 让句子语法正确
普通英语 App          → 教单词和日常对话
XingAI 工程英语教练    → 教你如何表达风险、决策、影响、责任和下一步
```

## 本地零 API key 即可运行

项目自带一个确定性场景库(`lib/scenario-bank.ts`)和一个基于规则的评审引擎
(`lib/review-engine.ts`),所有功能开箱即用。如果设置了
`ANTHROPIC_API_KEY`,练习生成和评审会自动升级为真实的 Claude 调用,出错时
回退到确定性路径——见 `lib/llm-client.ts`,以及
[xingai-ai-learning-wiki:概念——缓存 / 兜底 LLM 纪律](https://github.com/xingaiapp/xingai-ai-learning-wiki/blob/main/wiki/concepts/cache-first-llm-architecture.zh.md)
里描述的同一套纪律。

## 快速开始

```bash
npm install
npm run dev
# 打开 http://localhost:3006

# 可选——升级评审质量为真实 LLM 调用
export ANTHROPIC_API_KEY=sk-ant-...
```

## 架构

- **Worker 式拆分:** `lib/exercise-engine.ts` 和 `lib/review-engine.ts`
  负责全部生成/打分逻辑;`app/api/*/route.ts` 路由很薄,只做编排——业务
  逻辑不写在路由处理函数里。
- **Decision 台账:** 每次完成的评审都作为一行 `Decision` 写入 XingAI 共享
  的跨产品形态,而不是一张独立发明的 memory 表——见
  `docs/adr/001-decision-ledger-adoption.md`。
- **i18n:** 所有 UI 字符串都走 `tr(lang, en, zh)`(`lib/i18n.ts`),而不是
  硬编码英文再另外拼一套"解释用"的翻译。
- **主题:** `app/globals.css` 里的 CSS 变量 token,深浅色成对,结构与
  `xingai-meal-coach-ai` 一致。
- **SEO/AEO:** `app/layout.tsx` 导出带 OG tags + canonical 的 `Metadata`,
  并服务端渲染一段 JSON-LD `FAQPage`。

## 数据结构

见 `lib/types.ts` 的 `UserLearningProfile`、`DailyExercise`、
`ExerciseReview`、`SentenceReview`;共享的 `Decision` 形态见
`lib/decision-ledger.ts`。

## 仓库结构

```text
app/
  layout.tsx          SEO metadata + AEO FAQPage JSON-LD
  page.tsx            设置 / 练习 / 评审 UI(客户端组件)
  globals.css         主题 token
  api/
    exercise/route.ts  生成今日练习
    review/route.ts    评审提交内容,写入台账
    decisions/route.ts 读取台账行 / 记录 accept-edit-reject 结果
lib/
  types.ts             数据模型
  i18n.ts              tr(lang, en, zh) 辅助函数
  scenario-bank.ts      确定性场景库(离线兜底)
  prompts.ts             Master Prompt,仅在配置了 LLM 时使用
  llm-client.ts           轻量 Claude API 客户端 + 可用性检查
  exercise-engine.ts       练习生成(LLM,带启发式兜底)
  review-engine.ts         评审生成(LLM,带启发式兜底)
  decision-ledger.ts        共享 Decision 台账读写函数
docs/adr/001-decision-ledger-adoption.md  为什么复用共享 schema
DISCLAIMER.md
```

## 状态

v0.1——本地脚手架,内存态台账,默认走确定性引擎。尚未部署。下一步:持久化
存储、Email/Push 投递渠道、Weekly Progress Report 生成。
