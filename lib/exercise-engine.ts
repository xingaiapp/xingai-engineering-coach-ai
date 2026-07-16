import { SCENARIO_BANK } from "./scenario-bank";
import { dailyExercisePrompt, SYSTEM_PROMPT } from "./prompts";
import { callClaude, isAvailable, LLMError } from "./llm-client";
import type { DailyExercise, UserLearningProfile } from "./types";

function generateId(): string {
  return `ex_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function pickScenario(recentCategories: string[]) {
  const unused = SCENARIO_BANK.filter((s) => !recentCategories.includes(s.category));
  const pool = unused.length > 0 ? unused : SCENARIO_BANK;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Deterministic fallback — always available, no API key required. */
function generateHeuristicExercise(
  profile: UserLearningProfile,
  recentCategories: string[],
): DailyExercise {
  const template = pickScenario(recentCategories);
  return {
    id: generateId(),
    userId: profile.userId,
    title: template.title,
    category: template.category,
    scenario: template.scenario,
    role: template.role,
    audience: template.audience,
    communicationGoal: template.communicationGoal,
    requiredPoints: template.requiredPoints,
    optionalOpeningSentence: template.optionalOpeningSentence,
    difficulty: template.difficulty,
    scheduledAt: new Date().toISOString(),
    status: "delivered",
    source: "heuristic",
  };
}

/** Best-effort LLM path — falls back to the heuristic bank on any error. */
export async function generateExercise(
  profile: UserLearningProfile,
  recentCategories: string[] = [],
): Promise<DailyExercise> {
  if (!isAvailable()) {
    return generateHeuristicExercise(profile, recentCategories);
  }

  try {
    const raw = await callClaude(SYSTEM_PROMPT, dailyExercisePrompt(profile));
    const parsed = parseExerciseText(raw);
    if (!parsed) {
      throw new LLMError("could not parse LLM exercise output");
    }
    return {
      id: generateId(),
      userId: profile.userId,
      title: parsed.title,
      category: pickScenario(recentCategories).category, // best-effort category tag
      scenario: parsed.scenario,
      role: parsed.role,
      audience: parsed.audience,
      communicationGoal: parsed.communicationGoal,
      requiredPoints: parsed.requiredPoints,
      optionalOpeningSentence: parsed.optionalOpeningSentence,
      difficulty: 3,
      scheduledAt: new Date().toISOString(),
      status: "delivered",
      source: "llm",
    };
  } catch {
    return generateHeuristicExercise(profile, recentCategories);
  }
}

function parseExerciseText(text: string): {
  title: string;
  scenario: string;
  role: string;
  audience: string;
  communicationGoal: string;
  requiredPoints: string[];
  optionalOpeningSentence: string;
} | null {
  const field = (label: string): string => {
    const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z][\\w ]*:|$)`, "i");
    const match = text.match(re);
    return match ? match[1].trim() : "";
  };

  const title = field("Title");
  const scenario = field("Scenario");
  if (!title || !scenario) {
    return null;
  }

  const points = field("Include these points")
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return {
    title,
    scenario,
    role: field("Your role") || "Engineer",
    audience: field("Audience") || "Team",
    communicationGoal: field("Communication goal") || "Communicate clearly and professionally.",
    requiredPoints: points.length > 0 ? points : ["Cover the situation clearly."],
    optionalOpeningSentence: field("Optional opening sentence"),
  };
}
