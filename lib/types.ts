// Core data model for XingAI Engineering Communication & Charisma Coach.
// ExerciseReview mirrors the shared XingAI Decision shape — see ADR-001.

export type EnglishLevel = "beginner" | "intermediate" | "advanced";

export type FeedbackLanguage = "en" | "zh" | "bilingual";

export type DeliveryChannel = "app" | "email" | "push";

export type Frequency = "daily" | "weekdays" | "three_times_weekly" | "weekly";

export type Difficulty = "auto" | "basic" | "intermediate" | "advanced";

export type ActionTaken = "followed" | "ignored" | "modified" | null;

export const EXERCISE_CATEGORIES = [
  "first_impression",
  "trust",
  "confidence",
  "design_review",
  "technical_story",
  "voice_body",
  "read_room",
  "difficult_feedback",
  "defensive_people",
  "say_no",
  "interrupt_redirect",
  "defuse_conflict",
  "leader_listen",
  "small_talk",
  "executive",
  "architecture_influence",
  "incident_leadership",
  "stakeholder",
  "negotiation",
  // legacy aliases kept for older sessions
  "bug_investigation",
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
  "work_item_comment",
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
  weakAreas: string[];
  preferredChannels: DeliveryChannel[];
  schedule: {
    frequency: Frequency;
    time: string;
    timezone: string;
  };
  difficulty: Difficulty;
  /** 1-based curriculum day; advances after completed reviews when tracked by client */
  curriculumDay: number;
}

export const DEFAULT_PROFILE: UserLearningProfile = {
  userId: "local-demo-user",
  nativeLanguage: "Chinese",
  preferredFeedbackLanguage: "bilingual",
  englishLevel: "intermediate",
  currentRole: "Software Engineer",
  targetRole: "Senior Engineer / Architect",
  technicalAreas: ["Azure", ".NET", "C#", "Microservices", "APIs"],
  weakAreas: [],
  preferredChannels: ["app"],
  schedule: {
    frequency: "daily",
    time: "09:00",
    timezone: "auto",
  },
  difficulty: "auto",
  curriculumDay: 1,
};

export interface DailyExercise {
  id: string;
  userId: string;
  dayNumber: number;
  skillTitle: string;
  skillTitleZh: string;
  skillWhyZh: string;
  title: string;
  category: ExerciseCategory;
  scenarioType: string;
  scenario: string;
  role: string;
  audience: string;
  problem: string;
  communicationGoal: string;
  potentialRisk: string;
  requiredPoints: string[];
  hints: string[];
  optionalOpeningSentence?: string;
  closingPrompt: string;
  difficulty: number;
  scheduledAt: string;
  status: "scheduled" | "delivered" | "started" | "completed";
  source: "heuristic" | "llm";
}

export interface SentenceReview {
  original: string;
  improved: string;
  issue: string;
  explanation: string; // why more natural / listener impact
}

export interface ReusableExpression {
  english: string;
  meaningZh: string;
  useWhen: string;
}

export interface ImprovementLevels {
  correct: string;
  natural: string;
  senior: string;
}

export interface ProgressNotes {
  wentWell: string;
  focusArea: string;
  nextSkill: string;
}

export interface ExerciseReview {
  exerciseId: string;
  decisionId: string;
  userResponse: string;
  sentenceReviews: SentenceReview[];
  levels: ImprovementLevels;
  polishedVersion: string;
  reusablePhrases: string[];
  reusableExpressions: ReusableExpression[];
  voiceCoaching: string;
  microPractice: string;
  progress: ProgressNotes;
  improvementAreas: string[];
  score: {
    grammar: number;
    clarity: number;
    professionalism: number;
    leadershipTone: number;
    confidence: number;
    technicalPrecision: number;
  };
  source: "heuristic" | "llm";
}
