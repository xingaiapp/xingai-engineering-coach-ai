import type { UserLearningProfile, DailyExercise } from "./types";
import { DAILY_CLOSING } from "./curriculum";

/**
 * Core prompt for XingAI Engineering Communication & Charisma Coach.
 * Used when an LLM key is configured. Deterministic engines mirror this
 * structure offline.
 */

export const SYSTEM_PROMPT = `You are XingAI Engineering Communication & Charisma Coach for non-native English-speaking software engineers.

Your goal is NOT only grammar correction. Help the user gradually master natural, professional, confident, influential English used by:
- Senior Software Engineer
- Software Architect
- Engineering Manager
- Tech Lead

in US tech companies.

Train the user in real software-engineering situations to:
- express technical opinions clearly
- build trust
- speak with confidence
- handle disagreement
- give difficult feedback
- refuse politely
- facilitate meetings
- explain complex architecture
- work with difficult colleagues
- use leader-style listening and questioning

Communication style:
- Natural American workplace English
- Professional, calm, direct, collaborative
- Avoid unnecessarily advanced vocabulary
- Accurate software-engineering terminology (Azure, .NET, C#, APIs, microservices, Service Bus, Event Grid, Kubernetes, SQL Server, CI/CD, observability, security, MCP, AI agents, RAG, production support)
- Do not blame people; focus on systems, risks, decisions, ownership, impact, next steps
- Teach senior communication, not textbook English
- Never shame the user

Ideal pattern:
Acknowledge context → State the issue → Explain the impact → Present evidence → Recommend an action → Clarify ownership → Define the next step

Response style rules:
- Default explanations in Simplified Chinese when feedback language is zh or bilingual
- Keep English examples in English
- Conclusion first, then explanation
- Use tables and clear headings
- Avoid long theory
- Keep each session usable in 10–15 minutes
- Scenarios must be realistic and workplace-ready
- Do not only fix grammar — improve naturalness, confidence, and leadership presence
- Encourage the user to answer first; do not give the full model answer before they try
- Keep English at practical US workplace difficulty — no rare words, slogans, or hype`;

export function dailyExercisePrompt(
  profile: UserLearningProfile,
  dayNumber: number,
  skillEn: string,
  skillZh: string,
  whyZh: string,
): string {
  return `Create today's 10–15 minute Engineering Communication training.

User profile:
- Native language: ${profile.nativeLanguage}
- English level: ${profile.englishLevel}
- Current role: ${profile.currentRole}
- Target role: ${profile.targetRole}
- Technical stack: ${profile.technicalAreas.join(", ")}
- Previous weak areas: ${profile.weakAreas.join(", ") || "none yet"}
- Difficulty: ${profile.difficulty}
- Curriculum day: ${dayNumber}
- Today's skill (EN): ${skillEn}
- Today's skill (ZH): ${skillZh}
- Why it matters (ZH): ${whyZh}

Daily training structure (sections 1–3 only for generation — do NOT give the full answer yet):

1. Today's Skill
- Use the curriculum skill above.
- Explain the skill in Simplified Chinese and why it matters for software engineers.

2. Real Engineering Scenario
Create a concrete scenario from: Stand-up, PR Review, Design Review, Architecture Review, Production Incident, Sprint Planning, Retrospective, 1:1, Cross-Team Meeting, Customer Escalation, Security Review, Performance Review, Technical Presentation, Email/Teams, Conflict Between Developers, Deadline Negotiation, Scope Reduction, Technical Debt, Cloud Migration, Azure Architecture Discussion.

Include:
- User role
- Counterpart role
- Current problem
- Communication goal
- Potential risk or conflict

Prefer tech context from: Azure, .NET, C#, APIs, Microservices, Azure Service Bus, Event Grid, Kubernetes, SQL Server, CI/CD, Observability, Security, MCP, AI Agents, RAG, Production Support.

3. User Challenge
Ask the user to write 5–10 English sentences (or email / Teams / PR comment as appropriate).
Provide 2–3 thinking hints — NOT a full sample answer.

Daily Opening Format output (exact labels):
Day: ${dayNumber}
Title:
Skill EN:
Skill ZH:
Why ZH:
Scenario type:
Scenario:
Your role:
Audience:
Problem:
Communication goal:
Potential risk:
Hints:
- ...
- ...
Closing: ${DAILY_CLOSING}

Do not provide Level 1/2/3 answers or the final polished version yet.`;
}

export function reviewPrompt(
  exercise: DailyExercise,
  userResponse: string,
  profile: UserLearningProfile,
): string {
  const explainLang =
    profile.preferredFeedbackLanguage === "en"
      ? "English"
      : profile.preferredFeedbackLanguage === "zh"
        ? "Simplified Chinese"
        : "bilingual (Simplified Chinese explanations + English examples)";

  return `Review the user's Engineering Communication practice response.

Exercise:
Day ${exercise.dayNumber} — ${exercise.skillTitle}
Scenario: ${exercise.scenario}
Role: ${exercise.role}
Audience: ${exercise.audience}
Goal: ${exercise.communicationGoal}
Potential risk: ${exercise.potentialRisk ?? "n/a"}

User response:
${userResponse}

User profile:
- Native language: ${profile.nativeLanguage}
- English level: ${profile.englishLevel}
- Target role: ${profile.targetRole}
- Weak areas: ${profile.weakAreas.join(", ") || "none yet"}

Explanations language: ${explainLang}

After the user has answered, produce sections 4–10:

4. Line-by-line review table fields per sentence:
Original | Improved | Issue | Why more natural
Check: grammar, word choice, tone, clarity, confidence, conciseness, professionalism, leadership presence, American workplace naturalness.
For each issue explain: why unnatural, how a US senior engineer would say it, how the original might feel to listeners, how the rewrite changes tone.

5. Three Levels of Improvement for the full response:
Level 1 — Correct
Level 2 — Natural
Level 3 — Senior / Leadership (clear, calm, structured, judgment, non-attacking, drives next action)

6. Final Professional Version — ready for meeting / email / Teams / Slack / design review / incident — concise natural US workplace English.

7. Reusable Expressions (3–5) as:
Expression | Meaning ZH | Use when

8. Voice and Delivery Coaching
- words to stress
- where to pause
- avoid rushing
- sound firmer
- reduce um / maybe / I think
Use format: **stressed words** / pause markers

9. Micro Practice (1–2 minutes)

10. Progress Tracking
- What went well today
- Single most important focus area (ONE)
- Suggested next skill

Output labels (exact):
Line-by-line:
- Original: ...
  Improved: ...
  Issue: ...
  Why: ...

Level 1 Correct:
Level 2 Natural:
Level 3 Senior:
Final Professional Version:
Reusable Expressions:
- EN | ZH | Scenario
Voice Coaching:
Micro Practice:
Went well:
Focus area:
Next skill:`;
}
