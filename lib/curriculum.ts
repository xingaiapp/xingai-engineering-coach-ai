/**
 * 14-day Engineering Communication & Charisma curriculum.
 * After day 14, cycle into advanced topics.
 */

export interface CurriculumDay {
  day: number;
  skillEn: string;
  skillZh: string;
  whyItMattersZh: string;
  scenarioType: string;
  category:
    | "first_impression"
    | "trust"
    | "confidence"
    | "design_review"
    | "technical_story"
    | "voice_body"
    | "read_room"
    | "difficult_feedback"
    | "defensive_people"
    | "say_no"
    | "interrupt_redirect"
    | "defuse_conflict"
    | "leader_listen"
    | "small_talk"
    | "executive"
    | "architecture_influence"
    | "incident_leadership"
    | "stakeholder"
    | "negotiation";
}

export const CURRICULUM_14: CurriculumDay[] = [
  {
    day: 1,
    skillEn: "Make a Strong First Impression",
    skillZh: "在新团队留下专业第一印象",
    whyItMattersZh:
      "第一印象决定同事是否把你当成可靠的技术伙伴。资深工程师会用清晰、简洁、有结构的自我介绍建立可信度。",
    scenarioType: "Cross-Team Meeting",
    category: "first_impression",
  },
  {
    day: 2,
    skillEn: "Build Trust Through Clear Communication",
    skillZh: "用清晰沟通建立信任",
    whyItMattersZh:
      "信任来自可预测的表达：区分事实与假设、承认不确定性、给出下一步。这比“听起来流利”更重要。",
    scenarioType: "Stand-up Meeting",
    category: "trust",
  },
  {
    day: 3,
    skillEn: "Speak with Confidence",
    skillZh: "用自信语气发言",
    whyItMattersZh:
      "过度使用 I think / maybe 会削弱技术判断力。美国职场更期待直接、冷静、可执行的建议。",
    scenarioType: "Sprint Planning",
    category: "confidence",
  },
  {
    day: 4,
    skillEn: "Speak Up in a Design Review",
    skillZh: "在设计评审中主动发言",
    whyItMattersZh:
      "Design Review 是展示判断力的场合。能提出假设、风险和下一步的人，更容易被看作 Tech Lead 候选人。",
    scenarioType: "Design Review",
    category: "design_review",
  },
  {
    day: 5,
    skillEn: "Tell a Clear Technical Story",
    skillZh: "讲清楚一个技术故事",
    whyItMattersZh:
      "复杂系统需要叙事结构：背景 → 问题 → 影响 → 选项 → 建议。否则听众会迷失在细节里。",
    scenarioType: "Technical Presentation",
    category: "technical_story",
  },
  {
    day: 6,
    skillEn: "Use Professional Body Language and Voice",
    skillZh: "用声音与表达节奏增强专业感",
    whyItMattersZh:
      "同样内容，停顿、重读和语速会改变可信度。远程会议里，声音几乎就是你的“肢体语言”。",
    scenarioType: "One-on-One Meeting",
    category: "voice_body",
  },
  {
    day: 7,
    skillEn: "Read the Room",
    skillZh: "读懂会议气氛并调整表达",
    whyItMattersZh:
      "同样的技术观点，在执行层和架构评审里说法不同。读懂房间能避免讲错粒度或讲错时机。",
    scenarioType: "Architecture Review",
    category: "read_room",
  },
  {
    day: 8,
    skillEn: "Give Difficult Technical Feedback",
    skillZh: "给出困难但专业的技术反馈",
    whyItMattersZh:
      "Code review 与 1:1 反馈考验领导力：对事不对人，指出影响，给出可执行下一步。",
    scenarioType: "Pull Request Review",
    category: "difficult_feedback",
  },
  {
    day: 9,
    skillEn: "Handle Difficult or Defensive People",
    skillZh: "应对防御性强的同事",
    whyItMattersZh:
      "技术争论常变成情绪防御。领导者式回应会先确认对方关切，再把讨论拉回风险与证据。",
    scenarioType: "Conflict Between Developers",
    category: "defensive_people",
  },
  {
    day: 10,
    skillEn: 'Say "No" Without Damaging the Relationship',
    skillZh: "礼貌拒绝而不伤关系",
    whyItMattersZh:
      "不会说 No 的工程师会过度承诺。资深表达会拒绝范围/时间，同时提供替代方案。",
    scenarioType: "Deadline Negotiation",
    category: "say_no",
  },
  {
    day: 11,
    skillEn: "Interrupt Politely and Redirect the Discussion",
    skillZh: "礼貌打断并拉回主题",
    whyItMattersZh:
      "会议跑偏时，Tech Lead 需要打断。关键是礼貌、简短、立刻给出新方向。",
    scenarioType: "Cross-Team Meeting",
    category: "interrupt_redirect",
  },
  {
    day: 12,
    skillEn: "Defuse Technical Conflict",
    skillZh: "化解技术冲突",
    whyItMattersZh:
      "冲突不是失败；失控的冲突才是。资深做法是对齐目标、拆假设、约定实验或决策规则。",
    scenarioType: "Architecture Review",
    category: "defuse_conflict",
  },
  {
    day: 13,
    skillEn: "Listen and Respond Like a Leader",
    skillZh: "像领导者一样倾听与回应",
    whyItMattersZh:
      "领导力沟通先复述对方意思，再补充判断与下一步。这能建立安全感并推动决策。",
    scenarioType: "Retrospective",
    category: "leader_listen",
  },
  {
    day: 14,
    skillEn: "Use Small Talk to Build Professional Relationships",
    skillZh: "用得体闲聊建立职场关系",
    whyItMattersZh:
      "美国科技公司里，轻量社交是信任的一部分。自然、简短、不侵入的闲聊能降低协作成本。",
    scenarioType: "Stand-up Meeting",
    category: "small_talk",
  },
];

export const ADVANCED_TOPICS: CurriculumDay[] = [
  {
    day: 15,
    skillEn: "Executive Communication",
    skillZh: "向高管做简洁汇报",
    whyItMattersZh: "高管要结论、影响、选项与决策请求——不是实现细节。",
    scenarioType: "Customer Escalation",
    category: "executive",
  },
  {
    day: 16,
    skillEn: "Architecture Influence",
    skillZh: "在无正式权力时影响架构决策",
    whyItMattersZh: "Influence without authority 靠证据、风险框架和可验证的下一步。",
    scenarioType: "Azure Architecture Discussion",
    category: "architecture_influence",
  },
  {
    day: 17,
    skillEn: "Incident Leadership",
    skillZh: "事故沟通中的领导力",
    whyItMattersZh: "事故频道需要冷静、事实、缓解动作与下次更新时间。",
    scenarioType: "Production Incident",
    category: "incident_leadership",
  },
  {
    day: 18,
    skillEn: "Cross-Team Negotiation",
    skillZh: "跨团队协商依赖与边界",
    whyItMattersZh: "跨团队冲突要用共同目标、明确阻塞和对齐会议来解决，而不是指责。",
    scenarioType: "Scope Reduction",
    category: "negotiation",
  },
];

export function resolveCurriculumDay(dayNumber: number): CurriculumDay {
  if (dayNumber >= 1 && dayNumber <= 14) {
    return CURRICULUM_14[dayNumber - 1];
  }
  const advancedIndex = (dayNumber - 15) % ADVANCED_TOPICS.length;
  const topic = ADVANCED_TOPICS[advancedIndex];
  return { ...topic, day: dayNumber };
}

export const DAILY_CLOSING =
  "Please write your response in English. Don’t worry about mistakes—I’ll help you rewrite it like a senior software engineer or architect.";
