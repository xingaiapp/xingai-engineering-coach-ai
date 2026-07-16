import { reviewPrompt, SYSTEM_PROMPT } from "./prompts";
import { resolveCurriculumDay } from "./curriculum";
import { callClaude, isAvailable, LLMError } from "./llm-client";
import type {
  DailyExercise,
  ExerciseReview,
  ReusableExpression,
  SentenceReview,
  UserLearningProfile,
} from "./types";

const WEAK_PATTERNS: Array<{
  id: string;
  re: RegExp;
  issue: string;
  note: string;
  suggestion: (s: string) => string;
}> = [
  {
    id: "overuse_of_i_think",
    re: /\bI think\b/i,
    issue: "Confidence / hedging",
    note: "“I think” softens judgment. US senior engineers often state the recommendation, then the reasoning.",
    suggestion: (s) => s.replace(/\bI think\b\s*/i, "I recommend that "),
  },
  {
    id: "maybe_hedge",
    re: /\bmaybe we (should|could)\b/i,
    issue: "Confidence / hedging",
    note: "“Maybe we should” sounds uncertain for a recommendation. State the action, then invite discussion.",
    suggestion: (s) => s.replace(/\bmaybe we (should|could)\b/i, "I recommend we"),
  },
  {
    id: "vague_verb",
    re: /\b(fix|handle|do something about)\b/i,
    issue: "Clarity",
    note: "Vague verbs don’t tell listeners what action you will take. Prefer a concrete verb.",
    suggestion: (s) => s,
  },
  {
    id: "missing_article",
    re: /\b(is|was|are|were) (bug|issue|problem|risk)\b/i,
    issue: "Grammar (articles)",
    note: "Likely missing an article (“a bug”, “the issue”) — common when the native language has no articles.",
    suggestion: (s) => s,
  },
  {
    id: "sorry_overuse",
    re: /\b(sorry|I am sorry|I'm sorry)\b/i,
    issue: "Leadership presence",
    note: "Unnecessary apologies can weaken presence. Prefer ownership language: “Here’s the update / here’s the gap.”",
    suggestion: (s) => s.replace(/\b(sorry[, ]*|I am sorry[, ]*|I'm sorry[, ]*)/i, ""),
  },
];

const DEFAULT_EXPRESSIONS: ReusableExpression[] = [
  {
    english: "I’d like to challenge one assumption here.",
    meaningZh: "我想讨论一下这里的一个假设。",
    useWhen: "礼貌提出不同意见",
  },
  {
    english: "My main concern is the operational risk.",
    meaningZh: "我主要担心的是运维风险。",
    useWhen: "Design Review",
  },
  {
    english: "Could we take a step back and clarify the goal?",
    meaningZh: "我们能否先退一步明确目标？",
    useWhen: "讨论偏离主题时",
  },
  {
    english: "I’m not comfortable committing to that timeline yet.",
    meaningZh: "我暂时无法承诺这个时间表。",
    useWhen: "拒绝不合理期限",
  },
  {
    english: "Let me summarize what I’m hearing.",
    meaningZh: "我总结一下我听到的内容。",
    useWhen: "领导者式倾听",
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
        improved: pattern.suggestion(sentence).trim(),
        issue: pattern.issue,
        explanation: pattern.note,
      };
    }
  }
  return {
    original: sentence,
    improved: sentence,
    issue: "—",
    explanation: "No major offline flag — reasonably clear. An LLM review can refine tone further.",
  };
}

function scoreFromReviews(reviews: SentenceReview[]) {
  const flagged = reviews.filter((r) => r.issue !== "—").length;
  const ratio = reviews.length > 0 ? flagged / reviews.length : 0;
  const base = Math.max(0.4, 1 - ratio * 0.5);
  return {
    grammar: Number(base.toFixed(2)),
    clarity: Number(base.toFixed(2)),
    professionalism: Number(Math.min(1, base + 0.05).toFixed(2)),
    leadershipTone: Number(Math.max(0.35, base - 0.05).toFixed(2)),
    confidence: Number(Math.max(0.35, base - (flagged > 0 ? 0.08 : 0)).toFixed(2)),
    technicalPrecision: Number(base.toFixed(2)),
  };
}

function reviewHeuristic(exercise: DailyExercise, userResponse: string): ExerciseReview {
  const sentences = splitSentences(userResponse);
  const sentenceReviews = (sentences.length > 0 ? sentences : [userResponse.trim() || "(empty)"]).map(
    reviewSentence,
  );
  const improvementAreas = [
    ...new Set(
      sentenceReviews
        .map((r) => WEAK_PATTERNS.find((p) => p.issue === r.issue)?.id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const polishedVersion = sentenceReviews.map((r) => r.improved).join(" ");
  const next = resolveCurriculumDay(exercise.dayNumber + 1);

  return {
    exerciseId: exercise.id,
    decisionId: "",
    userResponse,
    sentenceReviews,
    levels: {
      correct: polishedVersion,
      natural: polishedVersion,
      senior: `${polishedVersion} Next step: I’ll follow up with a concrete owner and timeline.`,
    },
    polishedVersion,
    reusablePhrases: DEFAULT_EXPRESSIONS.map((e) => e.english),
    reusableExpressions: DEFAULT_EXPRESSIONS,
    voiceCoaching:
      "> **I’m supportive of the direction** / but I’m concerned about **the operational risk**.\n\n斜线表示停顿；加粗表示重读。放慢语速，减少 “um / maybe / I think”。",
    microPractice:
      "用 60 秒把你的回答改成 Level 3：先结论，再风险，再下一步。录音听一遍，删掉所有 “I think”。",
    progress: {
      wentWell:
        improvementAreas.length === 0
          ? "You covered the scenario with usable workplace English."
          : "You attempted a real workplace response — that’s the right practice loop.",
      focusArea: improvementAreas[0] ?? "Add a clear next step / ask at the end.",
      nextSkill: `Day ${next.day}: ${next.skillEn}`,
    },
    improvementAreas: improvementAreas.length > 0 ? improvementAreas : ["missing_next_step"],
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
    const parsed = parseReviewText(raw, userResponse, exercise);
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
  exercise: DailyExercise,
): Omit<ExerciseReview, "exerciseId" | "decisionId" | "userResponse" | "source"> | null {
  const field = (label: string): string => {
    const re = new RegExp(
      `${label}\\s*:?\\s*\\n?([\\s\\S]*?)(?=\\n(?:Level \\d|Final Professional|Reusable|Voice|Micro|Went well|Focus area|Next skill|Line-by-line)\\b|$)`,
      "i",
    );
    const match = text.match(re);
    return match ? match[1].trim() : "";
  };

  const polishedVersion =
    field("Final Professional Version") || field("Professional Polished Version");
  if (!polishedVersion) {
    return null;
  }

  const expressionsBlock = field("Reusable Expressions") || field("Reusable Phrases");
  const reusableExpressions: ReusableExpression[] = expressionsBlock
    .split("\n")
    .map((l) => l.replace(/^[-*\d.]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 3) {
        return { english: parts[0], meaningZh: parts[1], useWhen: parts[2] };
      }
      return { english: line, meaningZh: "", useWhen: "" };
    });

  const sentences = splitSentences(userResponse);
  const sentenceReviews: SentenceReview[] = sentences.map((s) => ({
    original: s,
    improved: s,
    issue: "See detailed review",
    explanation: "See Level 1–3 and final version for full coaching.",
  }));

  const focus = field("Focus area") || "confidence";
  const next = resolveCurriculumDay(exercise.dayNumber + 1);

  return {
    sentenceReviews,
    levels: {
      correct: field("Level 1 Correct") || polishedVersion,
      natural: field("Level 2 Natural") || polishedVersion,
      senior: field("Level 3 Senior") || polishedVersion,
    },
    polishedVersion,
    reusablePhrases: reusableExpressions.map((e) => e.english),
    reusableExpressions:
      reusableExpressions.length > 0 ? reusableExpressions : DEFAULT_EXPRESSIONS,
    voiceCoaching: field("Voice Coaching") || DEFAULT_EXPRESSIONS[0].english,
    microPractice: field("Micro Practice") || "Rewrite your last sentence as Level 3 senior voice.",
    progress: {
      wentWell: field("Went well") || "Solid attempt at a real workplace scenario.",
      focusArea: focus,
      nextSkill: field("Next skill") || `Day ${next.day}: ${next.skillEn}`,
    },
    improvementAreas: [focus],
    score: {
      grammar: 0.72,
      clarity: 0.72,
      professionalism: 0.75,
      leadershipTone: 0.7,
      confidence: 0.68,
      technicalPrecision: 0.72,
    },
  };
}
