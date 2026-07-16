# XingAI 工程英语教练

**版本:** 0.1.1  
English: [README.md](README.md)  
**计划域名:** https://engineering-coach.xingai.app

> 像资深工程师一样沟通，而不只是把英语说流利。

每天一个真实的工程职场场景（排查 bug、写 PR 描述、code review、架构评审、
生产事故、交付风险沟通、干系人汇报等），逐句英文评审、专业润色版本、以及
可复用表达——专为非英语母语的软件工程师打造。

## 状态（0.1.1）— project-init 基线

- 移动优先 chrome：顶栏、抽屉、底栏；桌面侧栏可展开/收起
- 语言：**en / zh / ko**（持久化）；浅色 / 深色主题（无闪烁启动）
- Hero 浅/深色成对：`public/brand/hero-bg-light-visual.png` + `hero-bg-visual.png`
- 法律页（每页含 EN+中文+한국어）：`/legal/privacy`、`/legal/terms`、`/legal/disclaimer`
- SEO/AEO：metadata + OG、`robots.txt`、`sitemap.xml`、`llms.txt`、FAQ + SoftwareApplication JSON-LD
- 已在 [xingai.app](https://xingai.app) 目录登记为 **coming soon**（`engineering-coach`）
- 确定性场景 + 评审引擎；可选 `ANTHROPIC_API_KEY` 升级
- Decision 台账：`docs/adr/001-decision-ledger-adoption.md`

**尚未生产就绪：** 仅内存会话存储；无 Email/Push；无周报 worker。

## 差异化

```text
Grammarly            → 让句子语法正确
普通英语 App          → 教单词和日常对话
XingAI 工程英语教练    → 教你如何表达风险、决策、影响、责任和下一步
```

## 快速开始

```bash
cp .env.example .env.local   # 可选 ANTHROPIC_API_KEY
npm install
npm run dev
# http://localhost:3006
```

## 架构

- **Worker 式拆分:** `lib/exercise-engine.ts` / `lib/review-engine.ts` 负责生成与打分；API 路由只做编排。
- **Decision 台账:** 见 `docs/adr/001-decision-ledger-adoption.md`。
- **i18n:** `tr(lang, en, zh, ko)`（`lib/i18n.ts`），locale 码为 `en` | `zh` | `ko`。
- **主题:** `app/globals.css` 的 `data-theme` token。

## 免责声明

仅供教育 / 信息参考。见 [DISCLAIMER.md](DISCLAIMER.md)。
XingAI 不作任何保证。发送前请自行核实建议措辞。
