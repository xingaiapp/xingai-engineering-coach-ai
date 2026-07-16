// Core data model for XingAI Engineering English Coach.
//
// ExerciseReview intentionally mirrors the shared XingAI Decision shape
// (see lib/decision-ledger.ts) rather than inventing an independent memory
// schema — see docs/adr/001-decision-ledger-adoption.md.

export type EnglishLevel = "beginner" | "intermediate" | "advanced";

export type FeedbackLanguage = "en" | "zh" | "bilingual";

export type DeliveryChannel = "app" | "email" | "push";

export type Frequency = "daily" | "weekdays" | "three_times_weekly" | "weekly";

export type Difficulty = "auto" | "basic" | "intermediate" | "advanced";

export type ActionTaken = "followed" | "ignored" | "modified" | null;

export const EXERCISE_CATEGORIES = [
  "bug_investigation",
  "work_item_comment",
  "pr_description",
  "code_review",
  "architecture_review",
  "production_incident",
  "delivery_risk",
  "cross_team_dependency",
  "technical_disagreement",
  "stakeholder_update",
  "teams_message",
  "professional_email",
  "meeting_discussion",
  "project_planning",
  "engineering_management",
] as const;

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export interface UserLearningProfile {
  userId: string;
  nativeLanguage: string;
  preferredFeedbackLanguage: FeedbackLanguage;
  englishLevel: EnglishLevel;
  currentRole: string;
  targetRole: string;
  technicalAreas: string[];
  weakAreas: string[]; // derived view — refreshed from decisions.risks, not hand-written
  preferredChannels: DeliveryChannel[];
  schedule: {
    frequency: Frequency;
    time: string;
    timezone: string;
  };
  difficulty: Difficulty;
}

export const DEFAULT_PROFILE: UserLearningProfile = {
  userId: "local-demo-user",
  nativeLanguage: "Chinese",
  preferredFeedbackLanguage: "bilingual",
  englishLevel: "intermediate",
  currentRole: "Software Engineer",
  targetRole: "Senior Engineer",
  technicalAreas: ["Backend", "Cloud"],
  weakAreas: [],
  preferredChannels: ["app"],
  schedule: {
    frequency: "daily",
    time: "09:00",
    timezone: "auto",
  },
  difficulty: "auto",
};

export interface DailyExercise {
  id: string;
  userId: string;
  title: string;
  category: ExerciseCategory;
  scenario: string;
  role: string;
  audience: string;
  communicationGoal: string;
  requiredPoints: string[];
  optionalOpeningSentence?: string;
  difficulty: number; // 1-5
  scheduledAt: string;
  status: "scheduled" | "delivered" | "started" | "completed";
  source: "heuristic" | "llm";
}

export interface SentenceReview {
  original: string;
  improved: string;
  explanation: string;
}

export interface ExerciseReview {
  exerciseId: string;
  decisionId: string; // this review IS a Decision row — see decision-ledger.ts
  userResponse: string;
  sentenceReviews: SentenceReview[];
  polishedVersion: string; // == Decision.recommendation
  reusablePhrases: string[]; // == Decision.alternatives
  improvementAreas: string[]; // == Decision.risks
  score: {
    grammar: number;
    clarity: number;
    professionalism: number;
    leadershipTone: number;
    technicalPrecision: number;
  };
  source: "heuristic" | "llm";
}
