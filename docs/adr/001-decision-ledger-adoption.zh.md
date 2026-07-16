# ADR-001:采纳 Decision 台账

**日期:** 2026-07-16
**状态:** 已采纳
**作者:** Xing @ XingAI
**English:** [001-decision-ledger-adoption.md](001-decision-ledger-adoption.md)

## 背景

`xingai-invest-decision-engine` 的
[ADR-016(跨产品 Decision 台账)](https://github.com/xingaiapp/xingai-invest-decision-engine/blob/main/docs/adr/016-cross-product-decision-ledger.md)
定义了一个共享的、精简的 `Decision` 形态(`id, product, domain, question,
recommendation, reasoning, confidence, alternatives, risks, action_taken,
outcome, outcome_recorded_at, created_at, source_ref`),并规定了 XingAI
各产品的接入顺序:Meal AI → Invest AI → Opportunity Radar → Polymarket AI。

本产品(`xingai-engineering-coach-ai`)不在这份原始名单里——它是在 ADR-016
被采纳之后才新建的产品。它自己最初的 PRD 提议了一套独立的 memory schema
(`weak_areas`、`saved_phrases`、`improvementScore` 作为独立维护的表)。
如果照做,就会是同一天里第二次有新产品发明自己的 memory 形态,而不是复用
`xingai-invest-decision-engine` 和 `xingai-meal-coach-ai` 已经验证过的那一套。

## 决定

本产品把共享的 Decision 台账形态当作练习评审结果的**唯一**写入路径。不存在
独立的 `ExerciseReview` 表作为真相来源。

字段映射:

| 产品概念 | Decision 字段 |
|---|---|
| 每日练习场景 + 目标 | `question` |
| Professional Polished Version | `recommendation` |
| 逐句"Why"解释 | `reasoning[]` |
| 可复用表达 | `alternatives[]` |
| 被标记的改进点 | `risks[]` |
| Accept / Edit / Reject | 通过等价于 `record_outcome` 的调用写入 `action_taken`(`followed` / `modified` / `ignored`) |
| "用在真实邮件里" | `outcome`(自由文本) |
| `domain` | `"engineering-english-exercise/<category>"` |
| `source_ref` | 练习 id,避免重复计数 |

`UserLearningProfile` 里的 `weak_areas` 是一个**派生的、读时视图**(从最近的
`decisions.risks` 聚合而来——见 `lib/decision-ledger.ts` 里的
`deriveWeakAreas()`),而不是一张独立手工维护的表。这与 ADR-016"归一化/聚合
是读时关注点,不是写时 schema 新增"的规则一致。

存储目前是每个 Next.js 进程的内存态(与 Meal AI v1 一致)——适合本地/演示
使用;在需要跨会话持久历史时,换成真实的数据库后端 worker。

## 后果

正面:
- 没有发明新的 memory schema;本产品证明了这套共享形态可以泛化到第四类推荐
  (语言辅导,而不是投资/饮食/机会)。
- 未来一旦有统一的跨产品"Decision History"页面,可以像读 Meal AI 或
  Invest AI 一样,读取本产品的 `GET /api/decisions` 端点。

权衡:
- `Decision` 形态是通用的;部分工程英语特有的细节(完整的逐句 diff)存在
  API 响应负载里,而不在台账行本身。这是刻意的——台账行是*精简*的跨产品记录,
  不是完整的产品专属细节。

## 相关

- [xingai-invest-decision-engine: ADR-015(Decision 台账——本地采纳)](https://github.com/xingaiapp/xingai-invest-decision-engine/blob/main/docs/adr/015-decision-ledger.md)
- [xingai-invest-decision-engine: ADR-016(跨产品 Decision 台账)](https://github.com/xingaiapp/xingai-invest-decision-engine/blob/main/docs/adr/016-cross-product-decision-ledger.md)
- [xingai-engineering-system: patterns/decision-ledger-schema.md](https://github.com/xingaiapp/xingai-engineering-system/blob/main/patterns/decision-ledger-schema.md)
- `xingai-meal-coach-ai/meal_v4/app/api/decisions/route.ts` —— 另一个采纳该形态的 TypeScript/Next.js 产品。
