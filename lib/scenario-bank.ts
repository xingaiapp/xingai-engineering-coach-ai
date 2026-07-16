import type { ExerciseCategory } from "./types";
import { DAILY_CLOSING } from "./curriculum";

export interface ScenarioTemplate {
  day: number;
  category: ExerciseCategory;
  title: string;
  skillTitle: string;
  skillTitleZh: string;
  skillWhyZh: string;
  scenarioType: string;
  scenario: string;
  role: string;
  audience: string;
  problem: string;
  communicationGoal: string;
  potentialRisk: string;
  requiredPoints: string[];
  hints: string[];
  optionalOpeningSentence: string;
  difficulty: number;
}

/**
 * Deterministic 14-day + advanced scenario bank (Azure / .NET / cloud-first).
 * Offline fallback when no LLM key is set.
 */
export const SCENARIO_BANK: ScenarioTemplate[] = [
  {
    day: 1,
    category: "first_impression",
    title: "Day 1 — Introduce Yourself on a Cross-Team Azure Kickoff",
    skillTitle: "Make a Strong First Impression",
    skillTitleZh: "在新团队留下专业第一印象",
    skillWhyZh:
      "第一印象决定同事是否把你当成可靠的技术伙伴。资深工程师会用清晰、简洁、有结构的自我介绍建立可信度。",
    scenarioType: "Cross-Team Meeting",
    scenario:
      "You joined a new Azure microservices team. In today's kickoff with Platform and Claims teams, each engineer has 60 seconds to introduce role, strengths, and how they can help.",
    role: "Software Engineer (new joiner)",
    audience: "Platform lead + Claims engineers",
    problem: "You need a crisp intro without sounding junior or overselling.",
    communicationGoal: "Make a confident, useful first impression in under a minute.",
    potentialRisk: "Sounding vague (“I do backend”) or apologetic (“I’m still learning”).",
    requiredPoints: [
      "State your role and current focus area",
      "Name one concrete strength (.NET / Azure / APIs)",
      "Offer how you can help this project",
    ],
    hints: [
      "Lead with role + domain, not your life story",
      "Name one technical strength tied to this project",
      "End with how you can help in the next two weeks",
    ],
    optionalOpeningSentence:
      "I’m [Name], a software engineer on the Claims API team — happy to briefly share how I can help on this Azure migration.",
    difficulty: 2,
  },
  {
    day: 2,
    category: "trust",
    title: "Day 2 — Stand-up Update With Incomplete Investigation",
    skillTitle: "Build Trust Through Clear Communication",
    skillTitleZh: "用清晰沟通建立信任",
    skillWhyZh:
      "信任来自可预测的表达：区分事实与假设、承认不确定性、给出下一步。",
    scenarioType: "Stand-up Meeting",
    scenario:
      "An intermittent 500 on a .NET payment API has lasted two days. You have a concurrency hypothesis on Azure Service Bus consumers but no full repro. Tech lead asks for a stand-up update.",
    role: "Backend Engineer",
    audience: "Tech Lead and squad",
    problem: "You must update without overclaiming or hiding uncertainty.",
    communicationGoal: "Separate facts from hypotheses and ask for what you need.",
    potentialRisk: "Blending guesses into “facts,” which erodes trust later.",
    requiredPoints: [
      "State confirmed facts",
      "Label the hypothesis clearly",
      "Ask for time, access, or a second pair of eyes",
    ],
    hints: [
      "Use “confirmed” vs “hypothesis” language",
      "Name one next diagnostic step",
      "Ask for a specific help request",
    ],
    optionalOpeningSentence:
      "I’ve narrowed the payment API 500s, and I want to separate what’s confirmed from what’s still a hypothesis.",
    difficulty: 2,
  },
  {
    day: 3,
    category: "confidence",
    title: "Day 3 — Push Back on a Two-Day Estimate",
    skillTitle: "Speak with Confidence",
    skillTitleZh: "用自信语气发言",
    skillWhyZh: "过度使用 I think / maybe 会削弱技术判断力。",
    scenarioType: "Sprint Planning",
    scenario:
      "In sprint planning, your manager suggests two days for wiring a new Event Grid topic into the claims pipeline. You know schema validation, DLQ handling, and integration tests will take at least five.",
    role: "Software Engineer",
    audience: "Manager and team (live)",
    problem: "Live pushback on an unrealistic estimate.",
    communicationGoal: "State a firmer estimate with reasoning and a risk-reducing option.",
    potentialRisk: "Hedging so much that the estimate is ignored.",
    requiredPoints: [
      "State your estimate directly",
      "Name the hidden complexity",
      "Propose a spike or split if useful",
    ],
    hints: [
      "Replace “I think maybe” with a clear recommendation",
      "Name Event Grid / DLQ / tests explicitly",
      "Offer a decision: full scope vs spike first",
    ],
    optionalOpeningSentence:
      "I want to flag that this is closer to five days than two — here’s the complexity I’m seeing.",
    difficulty: 3,
  },
  {
    day: 4,
    category: "design_review",
    title: "Day 4 — Challenge a Sync Call in Design Review",
    skillTitle: "Speak Up in a Design Review",
    skillTitleZh: "在设计评审中主动发言",
    skillWhyZh: "Design Review 是展示判断力的场合。",
    scenarioType: "Design Review",
    scenario:
      "A teammate proposes synchronous HTTP calls from the Claims API to three downstream services. You’re concerned about cascading latency and partial failures under load on AKS.",
    role: "Senior Engineer (candidate)",
    audience: "Design review attendees",
    problem: "You need to challenge an assumption without attacking the author.",
    communicationGoal: "Raise operational risk and propose an alternative path.",
    potentialRisk: "Sounding aggressive or only negative without a next step.",
    requiredPoints: [
      "Challenge one assumption politely",
      "Name the operational risk",
      "Suggest async (Service Bus / Event Grid) or a fallback path",
    ],
    hints: [
      "Start with support for the goal, then the concern",
      "Ask a clarifying question before debating",
      "End with a concrete alternative to evaluate",
    ],
    optionalOpeningSentence:
      "I’m supportive of the direction, but I’d like to challenge one assumption about the synchronous fan-out.",
    difficulty: 3,
  },
  {
    day: 5,
    category: "technical_story",
    title: "Day 5 — Explain Why You’re Recommending Service Bus",
    skillTitle: "Tell a Clear Technical Story",
    skillTitleZh: "讲清楚一个技术故事",
    skillWhyZh: "复杂系统需要叙事结构：背景 → 问题 → 影响 → 选项 → 建议。",
    scenarioType: "Technical Presentation",
    scenario:
      "You have 5 minutes to explain to architects why Azure Service Bus (not direct REST) should power claim-status notifications, including tradeoffs.",
    role: "Software Architect (candidate)",
    audience: "Architecture review board",
    problem: "Tell a clear story with tradeoffs, not a diagram dump.",
    communicationGoal: "Present recommendation + honest downside + why it’s acceptable.",
    potentialRisk: "Hiding the downside of your own recommendation.",
    requiredPoints: [
      "State the recommendation up front",
      "Name one real tradeoff",
      "Explain why the tradeoff is acceptable here",
    ],
    hints: [
      "Open with the conclusion",
      "Compare sync vs async in one sentence each",
      "Close with the decision you want",
    ],
    optionalOpeningSentence:
      "I’m recommending Azure Service Bus for claim-status notifications — here’s the tradeoff before the diagram.",
    difficulty: 4,
  },
  {
    day: 6,
    category: "voice_body",
    title: "Day 6 — Deliver a Calm Risk Update in a 1:1",
    skillTitle: "Use Professional Body Language and Voice",
    skillTitleZh: "用声音与表达节奏增强专业感",
    skillWhyZh: "停顿、重读和语速会改变可信度。",
    scenarioType: "One-on-One Meeting",
    scenario:
      "In your 1:1, you must tell your manager that the SQL Server migration for claims reporting slipped because index rebuilds blocked overnight jobs. Keep voice calm and structured.",
    role: "Engineer",
    audience: "Engineering Manager",
    problem: "Bad news delivery with confident pacing.",
    communicationGoal: "Deliver risk clearly with pauses and firm recommendations.",
    potentialRisk: "Rushing, filler words, or sounding panicked.",
    requiredPoints: [
      "State the slip and cause calmly",
      "Impact in business terms",
      "Ask for a decision on the revised plan",
    ],
    hints: [
      "Write shorter sentences you can speak slowly",
      "Mark where you would pause",
      "End with one clear ask",
    ],
    optionalOpeningSentence:
      "I have an update on the SQL migration timeline — here’s what changed and what I recommend.",
    difficulty: 3,
  },
  {
    day: 7,
    category: "read_room",
    title: "Day 7 — Adjust Depth for Exec vs Architect Audience",
    skillTitle: "Read the Room",
    skillTitleZh: "读懂会议气氛并调整表达",
    skillWhyZh: "同样的技术观点，在执行层和架构评审里说法不同。",
    scenarioType: "Architecture Review",
    scenario:
      "A VP unexpectedly joins an architecture review about moving claim ingestion to AKS. Engineers start debating pod probes; the VP looks lost. You need to reframe at the right altitude.",
    role: "Tech Lead",
    audience: "Mixed: architects + VP",
    problem: "Discussion is at the wrong altitude for part of the room.",
    communicationGoal: "Redirect to impact, options, and decision — then park deep details.",
    potentialRisk: "Either dumbing down for engineers or drowning the VP in kube jargon.",
    requiredPoints: [
      "Acknowledge both audiences",
      "Summarize business impact in one sentence",
      "Propose parking deep details for a follow-up",
    ],
    hints: [
      "Use “for leadership / for the eng deep-dive” framing",
      "Offer a 60-second summary first",
      "Suggest a parking lot for probe settings",
    ],
    optionalOpeningSentence:
      "Before we go deeper on probes, let me summarize the decision we need at a higher level.",
    difficulty: 4,
  },
  {
    day: 8,
    category: "difficult_feedback",
    title: "Day 8 — Flag an N+1 Query in a PR",
    skillTitle: "Give Difficult Technical Feedback",
    skillTitleZh: "给出困难但专业的技术反馈",
    skillWhyZh: "对事不对人，指出影响，给出可执行下一步。",
    scenarioType: "Pull Request Review",
    scenario:
      "A teammate’s PR queries SQL Server inside a loop when hydrating claim documents. At scale this will spike DTU. You must leave PR comments that are direct and respectful.",
    role: "Senior Engineer",
    audience: "PR author",
    problem: "Hard feedback on performance without attacking competence.",
    communicationGoal: "Name the issue, impact, and a concrete fix path.",
    potentialRisk: "Tone that feels personal or vague (“this is bad”).",
    requiredPoints: [
      "Name the N+1 pattern",
      "Explain scale impact",
      "Suggest batching / Include / projection",
    ],
    hints: [
      "Start with what’s working",
      "Point to the specific loop",
      "Offer to pair if useful",
    ],
    optionalOpeningSentence:
      "Nice work overall — one thing I want to flag before merge is the query pattern in this loop.",
    difficulty: 3,
  },
  {
    day: 9,
    category: "defensive_people",
    title: "Day 9 — Respond to a Defensive Design Author",
    skillTitle: "Handle Difficult or Defensive People",
    skillTitleZh: "应对防御性强的同事",
    skillWhyZh: "先确认对方关切，再把讨论拉回风险与证据。",
    scenarioType: "Conflict Between Developers",
    scenario:
      "You questioned a caching approach. The author replies: “You just don’t understand the latency requirements.” You need to de-escalate and keep the discussion technical.",
    role: "Engineer",
    audience: "Defensive teammate + watching tech lead",
    problem: "Personal defensiveness mid-design debate.",
    communicationGoal: "Acknowledge, restate their goal, and return to evidence.",
    potentialRisk: "Matching their heat or withdrawing completely.",
    requiredPoints: [
      "Acknowledge their latency goal",
      "Restate your concern as risk, not attack",
      "Propose a measurable comparison",
    ],
    hints: [
      "Don’t defend your ego — defend the decision quality",
      "Use “help me understand”",
      "Suggest a short spike with numbers",
    ],
    optionalOpeningSentence:
      "I hear that latency is the top priority — I want to make sure we’re aligned on that before we dig into the tradeoff.",
    difficulty: 4,
  },
  {
    day: 10,
    category: "say_no",
    title: "Day 10 — Decline an Unrealistic Release Date",
    skillTitle: 'Say "No" Without Damaging the Relationship',
    skillTitleZh: "礼貌拒绝而不伤关系",
    skillWhyZh: "资深表达会拒绝范围/时间，同时提供替代方案。",
    scenarioType: "Deadline Negotiation",
    scenario:
      "Product asks to ship the MCP-based agent tool for claim triage by Friday. Security review and eval harness are not done. You cannot honestly commit.",
    role: "Senior Engineer",
    audience: "Product Manager",
    problem: "Say no to the date without burning the relationship.",
    communicationGoal: "Refuse the date, protect trust, offer alternatives.",
    potentialRisk: "Soft yes that becomes a broken promise.",
    requiredPoints: [
      "State you can’t commit to that date yet",
      "Explain the blocking risks (security / eval)",
      "Offer a reduced scope or new date",
    ],
    hints: [
      "Separate “no to the date” from “no to the goal”",
      "Offer Option A / Option B",
      "Invite a decision, don’t just dump problems",
    ],
    optionalOpeningSentence:
      "I’m not comfortable committing to Friday yet — here’s what’s still open and two options we can choose.",
    difficulty: 3,
  },
  {
    day: 11,
    category: "interrupt_redirect",
    title: "Day 11 — Politely Interrupt a Tangential Debate",
    skillTitle: "Interrupt Politely and Redirect the Discussion",
    skillTitleZh: "礼貌打断并拉回主题",
    skillWhyZh: "关键是礼貌、简短、立刻给出新方向。",
    scenarioType: "Cross-Team Meeting",
    scenario:
      "A cross-team meeting about API contract versioning drifts into a 15-minute debate on naming styles. You are facilitating and need to interrupt.",
    role: "Tech Lead (facilitator)",
    audience: "Two teams in a sync",
    problem: "Meeting is off-track and time-boxed.",
    communicationGoal: "Interrupt politely and redirect to the decision needed.",
    potentialRisk: "Sounding rude or failing to redirect.",
    requiredPoints: [
      "Interrupt politely",
      "Name the decision still needed",
      "Park the tangent",
    ],
    hints: [
      "Use “quick pause” / “to use the remaining time”",
      "Restate the agenda item",
      "Assign a parking-lot owner",
    ],
    optionalOpeningSentence:
      "Quick pause — I want to make sure we still land the versioning decision in the time we have.",
    difficulty: 3,
  },
  {
    day: 12,
    category: "defuse_conflict",
    title: "Day 12 — Defuse Sync vs Async Architecture Conflict",
    skillTitle: "Defuse Technical Conflict",
    skillTitleZh: "化解技术冲突",
    skillWhyZh: "对齐目标、拆假设、约定实验或决策规则。",
    scenarioType: "Architecture Review",
    scenario:
      "Two senior engineers clash: one insists on sync orchestration for claim workflows; the other insists on event-driven with Service Bus. Voices are rising.",
    role: "Tech Lead",
    audience: "Two seniors + architects",
    problem: "Conflict is becoming personal.",
    communicationGoal: "Defuse, align on goals, and set a decision rule.",
    potentialRisk: "Picking a side too early or letting the fight continue.",
    requiredPoints: [
      "Acknowledge both intents",
      "Reframe to shared goals (latency, reliability, ownership)",
      "Propose a decision criterion or spike",
    ],
    hints: [
      "Summarize both positions fairly",
      "Ask what would change someone’s mind",
      "Time-box a proof",
    ],
    optionalOpeningSentence:
      "Let me summarize what I’m hearing from both sides, then we can agree how we’ll decide.",
    difficulty: 4,
  },
  {
    day: 13,
    category: "leader_listen",
    title: "Day 13 — Lead a Retro With Listening Language",
    skillTitle: "Listen and Respond Like a Leader",
    skillTitleZh: "像领导者一样倾听与回应",
    skillWhyZh: "先复述对方意思，再补充判断与下一步。",
    scenarioType: "Retrospective",
    scenario:
      "In retro, a developer says CI/CD flakiness wasted two days and they feel ignored. As EM/Tech Lead, respond with leader-style listening.",
    role: "Engineering Manager",
    audience: "Team in retrospective",
    problem: "Frustration about pipeline reliability.",
    communicationGoal: "Reflect, validate impact, and commit to a next step.",
    potentialRisk: "Jumping to solutions before the person feels heard.",
    requiredPoints: [
      "Reflect what you heard",
      "Validate the impact",
      "Propose one owned next step",
    ],
    hints: [
      "Start with “What I’m hearing is…”",
      "Avoid “but” too early",
      "Assign an owner and date",
    ],
    optionalOpeningSentence:
      "What I’m hearing is that flaky pipelines cost real delivery time and it hasn’t felt prioritized — is that fair?",
    difficulty: 3,
  },
  {
    day: 14,
    category: "small_talk",
    title: "Day 14 — Light Professional Small Talk Before Stand-up",
    skillTitle: "Use Small Talk to Build Professional Relationships",
    skillTitleZh: "用得体闲聊建立职场关系",
    skillWhyZh: "自然、简短、不侵入的闲聊能降低协作成本。",
    scenarioType: "Stand-up Meeting",
    scenario:
      "Two minutes before stand-up, a US teammate joins early on Teams. You want brief, natural small talk, then a smooth transition into work.",
    role: "Engineer",
    audience: "US teammate",
    problem: "Build rapport without awkward oversharing.",
    communicationGoal: "2–4 friendly lines + light bridge into the meeting.",
    potentialRisk: "Too formal, too personal, or silence.",
    requiredPoints: [
      "One light opener",
      "One follow-up question",
      "Bridge into stand-up",
    ],
    hints: [
      "Weather, weekend, or coffee are safe",
      "Keep it short",
      "Don’t force jokes",
    ],
    optionalOpeningSentence: "Hey — how’s your morning going so far?",
    difficulty: 1,
  },
  {
    day: 15,
    category: "executive",
    title: "Day 15+ — Executive Update on RAG Pilot Risk",
    skillTitle: "Executive Communication",
    skillTitleZh: "向高管做简洁汇报",
    skillWhyZh: "高管要结论、影响、选项与决策请求。",
    scenarioType: "Customer Escalation",
    scenario:
      "A customer escalation mentions incorrect answers from your RAG pilot on Azure AI. An exec asks for a 2-minute update: status, risk, ask.",
    role: "Tech Lead",
    audience: "VP Engineering",
    problem: "Compress a complex RAG issue into executive language.",
    communicationGoal: "Conclusion-first update with a clear decision ask.",
    potentialRisk: "Too much retrieval/chunking detail.",
    requiredPoints: [
      "One-sentence status",
      "Business risk",
      "Decision you need",
    ],
    hints: [
      "No embedding jargon unless asked",
      "Offer two options",
      "End with the ask",
    ],
    optionalOpeningSentence:
      "Quick update: the RAG pilot has a quality risk that could affect the customer demo — here’s status and what I need from you.",
    difficulty: 4,
  },
  {
    day: 16,
    category: "architecture_influence",
    title: "Day 15+ — Influence an Azure Architecture Choice",
    skillTitle: "Architecture Influence",
    skillTitleZh: "在无正式权力时影响架构决策",
    skillWhyZh: "Influence without authority 靠证据、风险框架和可验证的下一步。",
    scenarioType: "Azure Architecture Discussion",
    scenario:
      "You’re not the architect of record, but you believe Event Grid + Functions is safer than a long-running .NET worker for bursty claim events. You need to influence the room.",
    role: "Senior Engineer",
    audience: "Staff architect + peers",
    problem: "Influence without formal authority.",
    communicationGoal: "Frame risk, evidence, and a low-cost experiment.",
    potentialRisk: "Sounding political or dismissive of the current design.",
    requiredPoints: [
      "Respect the current proposal",
      "Frame operational risk",
      "Propose a measurable spike",
    ],
    hints: [
      "Ask permission to offer an alternative",
      "Compare failure modes, not preferences",
      "Suggest decision criteria",
    ],
    optionalOpeningSentence:
      "I like the direction — could I offer one alternative failure-mode view before we lock it?",
    difficulty: 4,
  },
  {
    day: 17,
    category: "incident_leadership",
    title: "Day 15+ — Mid-Incident Status in Teams",
    skillTitle: "Incident Leadership",
    skillTitleZh: "事故沟通中的领导力",
    skillWhyZh: "事故频道需要冷静、事实、缓解动作与下次更新时间。",
    scenarioType: "Production Incident",
    scenario:
      "Claims API on AKS has elevated 5xx for 40 minutes. You’re incident commander. Root cause unknown; mitigation (scale-out + disable noncritical job) is in progress.",
    role: "Incident Commander",
    audience: "Leadership + on-call channel",
    problem: "Status without over-promising.",
    communicationGoal: "Calm update: impact, actions, next update time.",
    potentialRisk: "Speculating on root cause as fact.",
    requiredPoints: [
      "Impact and severity",
      "Current mitigation",
      "Next update time",
    ],
    hints: [
      "Use “known / unknown / doing now”",
      "No blame",
      "Give a clock time for next update",
    ],
    optionalOpeningSentence:
      "Status update: here’s impact, what we’re doing now, and when we’ll update again.",
    difficulty: 3,
  },
  {
    day: 18,
    category: "negotiation",
    title: "Day 15+ — Negotiate a Blocking API Dependency",
    skillTitle: "Cross-Team Negotiation",
    skillTitleZh: "跨团队协商依赖与边界",
    skillWhyZh: "用共同目标、明确阻塞和对齐会议解决，而不是指责。",
    scenarioType: "Scope Reduction",
    scenario:
      "Your sprint is blocked on another team’s API contract change for a week. You need to escalate jointly and negotiate a temporary scope cut.",
    role: "Engineer",
    audience: "Both team leads",
    problem: "Cross-team blocker with timeline risk.",
    communicationGoal: "Escalate collaboratively and propose a temporary path.",
    potentialRisk: "Blame language that damages the relationship.",
    requiredPoints: [
      "State the blocker factually",
      "Impact on shared outcome",
      "Propose sync + interim scope cut",
    ],
    hints: [
      "Use “we” for shared delivery",
      "Bring a proposed meeting slot",
      "Offer a workaround if possible",
    ],
    optionalOpeningSentence:
      "I want to flag a dependency that’s now blocking our shared milestone, and propose a short sync to unblock it.",
    difficulty: 3,
  },
];

export function scenarioForDay(dayNumber: number): ScenarioTemplate {
  const exact = SCENARIO_BANK.find((s) => s.day === dayNumber);
  if (exact) return exact;
  // Cycle advanced templates (days 15–18) for day 15+
  const advanced = SCENARIO_BANK.filter((s) => s.day >= 15);
  const idx = (Math.max(dayNumber, 15) - 15) % advanced.length;
  const base = advanced[idx];
  return { ...base, day: dayNumber };
}

export { DAILY_CLOSING };
