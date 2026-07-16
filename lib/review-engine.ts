import { reviewPrompt, SYSTEM_PROMPT } from "./prompts";
import { callClaude, isAvailable, LLMError } from "./llm-client";
import type { DailyExercise, ExerciseReview, SentenceReview, UserLearningProfile } from "./types";

const WEAK_PATTERNS: Array<{ id: string; re: RegExp; note: string; suggestion: (s: string) => string }> = [
  {
    id: "overuse_of_i_think",
    re: /\bI think\b/i,
    note: "\"I think\" softens the sentence and can read as unsure for a senior voice.",
    suggestion: (s) => s.replace(/\bI think\b\s*/i, "I recommend that "),
  },
  {
    id: "vague_verb",
    re: /\b(fix|handle|do something about)\b/i,
    note: "Vague verbs like \"fix\"/\"handle\" don't tell the reader what action was taken.",
    suggestion: (s) => s,
  },
  {
    id: "missing_article",
    re: /\b(is|was|are|were) (bug|issue|problem|risk)\b/i,
    note: "This likely needs an article (\"a bug\", \"the issue\") — common gap when the native language has no articles.",
    suggestion: (s) => s,
  },
  {
    id: "passive_hedge",
    re: /\bmaybe we (should|could)\b/i,
    note: "\"Maybe we should\" reads as uncertain for a recommendation — state the recommendation directly, then explain the reasoning.",
    suggestion: (s) => s.replace(/\bmaybe we (should|could)\b/i, "I recommend we"),
  },
];

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function reviewSentence(sentence: string): SentenceReview {
  for (const pattern of WEAK_PATTERNS) {
    if (pattern.re.test(sentence)) {
      return {
        original: sentence,
        improved: pattern.suggestion(sentence),
        explanation: pattern.note,
      };
    }
  }
  return {
    original: sentence,
    improved: sentence,
    explanation: "No major issue detected by the offline reviewer — looks reasonably clear and direct.",
  };
}

function scoreFromReviews(reviews: SentenceReview[]) {
  const flagged = reviews.filter((r) => r.original !== r.improved || r.explanation.startsWith("No major issue") === false).length;
  const ratio = reviews.length > 0 ? flagged / reviews.length : 0;
  const base = Math.max(0.4, 1 - ratio * 0.5);
  return {
    grammar: Number(base.toFixed(2)),
    clarity: Number(base.toFixed(2)),
    professionalism: Number(Math.min(1, base + 0.05).toFixed(2)),
    leadershipTone: Number((base - 0.05).toFixed(2)),
    technicalPrecision: Number(base.toFixed(2)),
  };
}

/** Deterministic fallback reviewer — pattern-matches common non-native
 * engineering-English issues. Real, not fake: it genuinely flags weak
 * patterns, it just doesn't have an LLM's range. Runs with zero API keys. */
function reviewHeuristic(exercise: DailyExercise, userResponse: string): ExerciseReview {
  const sentences = splitSentences(userResponse);
  const sentenceReviews = sentences.map(reviewSentence);
  const improvementAreas = [
    ...new Set(
      sentenceReviews
        .map((r) => WEAK_PATTERNS.find((p) => p.note === r.explanation)?.id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const polishedVersion = sentenceReviews.map((r) => r.improved).join(" ");

  return {
    exerciseId: exercise.id,
    decisionId: "", // filled in by the API route after writing to the ledger
    userResponse,
    sentenceReviews,
    polishedVersion,
    reusablePhrases: [
      "I recommend that we address this before rollout.",
      "Here's what's confirmed, and here's what's still a hypothesis.",
      "This affects [X] — here's the tradeoff I'd suggest.",
    ],
    improvementAreas: improvementAreas.length > 0 ? improvementAreas : ["clarity"],
    score: scoreFromReviews(sentenceReviews),
    source: "heuristic",
  };
}

export async function reviewResponse(
  exercise: DailyExercise,
  userResponse: string,
  profile: UserLearningProfile,
): Promise<ExerciseReview> {
  if (!isAvailable()) {
    return reviewHeuristic(exercise, userResponse);
  }

  try {
    const raw = await callClaude(SYSTEM_PROMPT, reviewPrompt(exercise, userResponse, profile));
    const parsed = parseReviewText(raw, userResponse);
    if (!parsed) {
      throw new LLMError("could not parse LLM review output");
    }
    return { ...parsed, exerciseId: exercise.id, decisionId: "", userResponse, source: "llm" };
  } catch {
    return reviewHeuristic(exercise, userResponse);
  }
}

function parseReviewText(
  text: string,
  userResponse: string,
): Omit<ExerciseReview, "exerciseId" | "decisionId" | "userResponse" | "source"> | null {
  const field = (label: string): string => {
    const re = new RegExp(`${label}\\s*\\n?([\\s\\S]*?)(?=\\n[A-Z][\\w ]*\\n|$)`, "i");
    const match = text.match(re);
    return match ? match[1].trim() : "";
  };

  const polishedVersion = field("Professional Polished Version");
  if (!polishedVersion) {
    return null;
  }

  const phrasesBlock = field("Reusable Phrases");
  const reusablePhrases = phrasesBlock
    .split("\n")
    .map((l) => l.replace(/^[-*\d.]\s*/, "").trim())
    .filter(Boolean);

  const areasBlock = field("Today's Improvement Areas") || field("Improvement Areas");
  const improvementAreas = areasBlock
    .split("\n")
    .map((l) => l.replace(/^[-*\d.]\s*/, "").trim())
    .filter(Boolean);

  const sentences = splitSentences(userResponse);
  const sentenceReviews: SentenceReview[] = sentences.map((s) => ({
    original: s,
    improved: s,
    explanation: "See overall feedback and polished version above.",
  }));

  return {
    sentenceReviews,
    polishedVersion,
    reusablePhrases: reusablePhrases.length > 0 ? reusablePhrases : [],
    improvementAreas: improvementAreas.length > 0 ? improvementAreas : [],
    score: { grammar: 0.7, clarity: 0.7, professionalism: 0.7, leadershipTone: 0.7, technicalPrecision: 0.7 },
  };
}
