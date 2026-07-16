import type { UserLearningProfile, DailyExercise } from "./types";

/**
 * Master prompts — reused verbatim in spirit from the original product
 * design, adapted into template functions. These are only invoked when
 * an LLM is configured (see lib/llm-client.ts). The deterministic
 * fallback engines (exercise-engine.ts, review-engine.ts) do not need
 * these at all — that's the cache/fallback discipline this repo's
 * docs/adr/001 references.
 */

export const SYSTEM_PROMPT = `You are XingAI Engineering English Coach, an expert communication coach for non-native English-speaking software engineers.

Your goal is to help users communicate like experienced American Senior Software Engineers, Software Architects, Tech Leads, and Engineering Managers.

You do not teach generic textbook English. You teach practical workplace communication used in real software engineering organizations.

Communication style requirements:
- Use natural American workplace English.
- Sound professional, calm, direct, and collaborative.
- Avoid unnecessarily advanced vocabulary.
- Use accurate software-engineering terminology.
- Avoid blaming individuals. Focus on systems, risks, decisions, ownership, impact, and next steps.
- Teach the user how senior engineers communicate, not only how to correct grammar.
- Never shame the user for mistakes.

The ideal communication pattern is:
Acknowledge context → State the issue → Explain the impact → Present evidence → Recommend an action → Clarify ownership → Define the next step`;

export function dailyExercisePrompt(profile: UserLearningProfile): string {
  return `Create today's Engineering English Practice exercise for the user.

User profile:
- Native language: ${profile.nativeLanguage}
- English level: ${profile.englishLevel}
- Current role: ${profile.currentRole}
- Target communication style: ${profile.targetRole}
- Technical stack: ${profile.technicalAreas.join(", ")}
- Previous weak areas: ${profile.weakAreas.join(", ") || "none yet"}
- Difficulty level: ${profile.difficulty}

Requirements:
1. Select one realistic engineering workplace scenario that has not been used recently.
2. Ask the user to write 5–10 English sentences.
3. Tell the user exactly what points to cover.
4. Provide one optional opening sentence.
5. Do not provide the sample answer yet.

Return the exercise using this structure:
Title:
Scenario:
Your role:
Audience:
Communication goal:
Include these points:
Optional opening sentence:`;
}

export function reviewPrompt(
  exercise: DailyExercise,
  userResponse: string,
  profile: UserLearningProfile,
): string {
  return `Review the user's Engineering English Practice response.

Exercise scenario:
${exercise.scenario}

User response:
${userResponse}

User profile:
- Native language: ${profile.nativeLanguage}
- English level: ${profile.englishLevel}
- Target role: ${profile.targetRole}
- Previous weak areas: ${profile.weakAreas.join(", ") || "none yet"}

Instructions:
1. Review every user sentence individually.
2. Preserve the user's intended meaning.
3. Correct grammar, word choice, clarity, tone, and technical terminology.
4. Explain why each correction sounds more natural in American engineering communication.
5. Point out direct translations from the user's native language.
6. Produce a polished final version.
7. Provide 3–5 reusable workplace phrases.
8. Identify the user's top two improvement areas.

Use this output structure:
Overall Feedback
Line-by-Line Review (Original / Improved / Why, per sentence)
Professional Polished Version
Reusable Phrases
Today's Improvement Areas
Recommended Next Practice`;
}
