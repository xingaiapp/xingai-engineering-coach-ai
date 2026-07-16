import { NextRequest, NextResponse } from "next/server";
import { reviewResponse } from "../../../lib/review-engine";
import { recordDecision } from "../../../lib/decision-ledger";
import { DEFAULT_PROFILE, type DailyExercise, type UserLearningProfile } from "../../../lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  if (!body?.exercise || !body?.userResponse) {
    return NextResponse.json({ error: "exercise and userResponse required" }, { status: 400 });
  }

  const exercise: DailyExercise = body.exercise;
  const userResponse: string = body.userResponse;
  const profile: UserLearningProfile = { ...DEFAULT_PROFILE, ...(body.profile ?? {}) };
  const sessionId: string = body.session_id ?? "anonymous";

  const review = await reviewResponse(exercise, userResponse, profile);

  // This review IS a Decision row — see docs/adr/001-decision-ledger-adoption.md.
  const decision = recordDecision(sessionId, {
    domain: `engineering-english-exercise/${exercise.category}`,
    question: exercise.title,
    recommendation: review.polishedVersion,
    reasoning: review.sentenceReviews.map((r) => r.explanation),
    confidence: review.score.clarity,
    alternatives: review.reusablePhrases,
    risks: review.improvementAreas,
    source_ref: exercise.id,
  });

  return NextResponse.json({ ...review, decisionId: decision.id });
}
