import { scenarioForDay, DAILY_CLOSING } from "./scenario-bank";
import { resolveCurriculumDay } from "./curriculum";
import { dailyExercisePrompt, SYSTEM_PROMPT } from "./prompts";
import { callClaude, isAvailable, LLMError } from "./llm-client";
import type { DailyExercise, ExerciseCategory, UserLearningProfile } from "./types";

function generateId(): string {
  return `ex_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateHeuristicExercise(profile: UserLearningProfile): DailyExercise {
  const dayNumber = Math.max(1, profile.curriculumDay || 1);
  const template = scenarioForDay(dayNumber);
  const curriculum = resolveCurriculumDay(dayNumber);

  return {
    id: generateId(),
    userId: profile.userId,
    dayNumber,
    skillTitle: template.skillTitle || curriculum.skillEn,
    skillTitleZh: template.skillTitleZh || curriculum.skillZh,
    skillWhyZh: template.skillWhyZh || curriculum.whyItMattersZh,
    title: template.title.replace(/^Day \d+/, `Day ${dayNumber}`),
    category: template.category,
    scenarioType: template.scenarioType,
    scenario: template.scenario,
    role: template.role,
    audience: template.audience,
    problem: template.problem,
    communicationGoal: template.communicationGoal,
    potentialRisk: template.potentialRisk,
    requiredPoints: template.requiredPoints,
    hints: template.hints,
    optionalOpeningSentence: template.optionalOpeningSentence,
    closingPrompt: DAILY_CLOSING,
    difficulty: template.difficulty,
    scheduledAt: new Date().toISOString(),
    status: "delivered",
    source: "heuristic",
  };
}

export async function generateExercise(
  profile: UserLearningProfile,
  _recentCategories: string[] = [],
): Promise<DailyExercise> {
  const dayNumber = Math.max(1, profile.curriculumDay || 1);
  const curriculum = resolveCurriculumDay(dayNumber);

  if (!isAvailable()) {
    return generateHeuristicExercise(profile);
  }

  try {
    const raw = await callClaude(
      SYSTEM_PROMPT,
      dailyExercisePrompt(
        profile,
        dayNumber,
        curriculum.skillEn,
        curriculum.skillZh,
        curriculum.whyItMattersZh,
      ),
    );
    const parsed = parseExerciseText(raw, dayNumber, curriculum.category);
    if (!parsed) {
      throw new LLMError("could not parse LLM exercise output");
    }
    return parsed;
  } catch {
    return generateHeuristicExercise(profile);
  }
}

function parseExerciseText(
  text: string,
  dayNumber: number,
  fallbackCategory: ExerciseCategory,
): DailyExercise | null {
  const field = (label: string): string => {
    const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z][\\w /+]+:|$)`, "i");
    const match = text.match(re);
    return match ? match[1].trim() : "";
  };

  const title = field("Title");
  const scenario = field("Scenario");
  if (!title || !scenario) {
    return null;
  }

  const hints = (field("Hints") || "")
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  const curriculum = resolveCurriculumDay(dayNumber);

  return {
    id: generateId(),
    userId: "local-demo-user",
    dayNumber,
    skillTitle: field("Skill EN") || curriculum.skillEn,
    skillTitleZh: field("Skill ZH") || curriculum.skillZh,
    skillWhyZh: field("Why ZH") || curriculum.whyItMattersZh,
    title,
    category: fallbackCategory,
    scenarioType: field("Scenario type") || curriculum.scenarioType,
    scenario,
    role: field("Your role") || "Engineer",
    audience: field("Audience") || "Team",
    problem: field("Problem") || "Communicate clearly in a real engineering situation.",
    communicationGoal:
      field("Communication goal") || "Communicate clearly and professionally.",
    potentialRisk: field("Potential risk") || "Unclear or unconfident delivery.",
    requiredPoints: hints.length > 0 ? hints.slice(0, 3) : ["Cover the situation clearly."],
    hints: hints.length > 0 ? hints : ["Be specific", "State the risk", "Propose a next step"],
    optionalOpeningSentence: "",
    closingPrompt: field("Closing") || DAILY_CLOSING,
    difficulty: 3,
    scheduledAt: new Date().toISOString(),
    status: "delivered",
    source: "llm",
  };
}
