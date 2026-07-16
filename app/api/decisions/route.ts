/**
 * Decision Ledger API — see lib/decision-ledger.ts and
 * docs/adr/001-decision-ledger-adoption.md.
 *
 * GET   /api/decisions?session_id=<id>&domain=<domain>&limit=20
 * PATCH /api/decisions   { session_id, id, action_taken, outcome }
 *
 * POST is intentionally not exposed here — decisions are only created as a
 * side effect of /api/review, never written directly by the client.
 */

import { NextRequest, NextResponse } from "next/server";
import { listDecisions, recordOutcome, deriveWeakAreas } from "../../../lib/decision-ledger";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id") ?? "anonymous";
  const domain = searchParams.get("domain") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "20");
  const includeWeakAreas = searchParams.get("weak_areas") === "1";

  const result = listDecisions(sessionId, { domain, limit });
  const weakAreas = includeWeakAreas ? deriveWeakAreas(sessionId, domain) : undefined;

  return NextResponse.json({ ...result, weakAreas });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { session_id = "anonymous", id, action_taken, outcome } = body;
  if (!id || !action_taken) {
    return NextResponse.json({ error: "id and action_taken required" }, { status: 400 });
  }

  const updated = recordOutcome(session_id, id, { action_taken, outcome });
  if (!updated) {
    return NextResponse.json({ error: "decision not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
