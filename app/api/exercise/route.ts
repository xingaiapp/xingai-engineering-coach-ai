import { NextRequest, NextResponse } from "next/server";
import { generateExercise } from "../../../lib/exercise-engine";
import { DEFAULT_PROFILE, type UserLearningProfile } from "../../../lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const profile: UserLearningProfile = { ...DEFAULT_PROFILE, ...(body.profile ?? {}) };
  const recentCategories: string[] = body.recentCategories ?? [];

  const exercise = await generateExercise(profile, recentCategories);
  return NextResponse.json(exercise);
}
