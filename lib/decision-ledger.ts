/**
 * Decision Ledger — shared XingAI shape.
 *
 * Same field shape as xingai-invest-decision-engine/decisions/ledger.py
 * (ADR-015) and xingai-meal-coach-ai's app/api/decisions/route.ts (ADR-003),
 * per the cross-product contract in xingai-invest-decision-engine's
 * ADR-016 (Cross-Product Decision Ledger). See docs/adr/001 in this repo
 * for why this product adopts the same shape instead of a bespoke schema.
 *
 * Storage here is in-memory (per Next.js process), matching Meal AI's v1
 * approach — acceptable for local/demo use. Swap `_store` for a real
 * database-backed worker when this product needs durable history.
 */

export type ActionTaken = "followed" | "ignored" | "modified" | null;

export interface Decision {
  id: string;
  product: "engineering-english-coach";
  domain: string; // e.g. "engineering-english-exercise/pr_description"
  question: string;
  recommendation: string;
  reasoning: string[];
  confidence: number;
  alternatives: string[];
  risks: string[];
  action_taken: ActionTaken;
  outcome: string | null;
  outcome_recorded_at: string | null;
  created_at: string;
  source_ref: string | null;
}

const _store = new Map<string, Decision[]>();

function generateId(): string {
  return `eec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function listDecisions(
  sessionId: string,
  opts: { domain?: string; limit?: number } = {},
): { decisions: Decision[]; total: number } {
  let rows = _store.get(sessionId) ?? [];
  if (opts.domain) {
    rows = rows.filter((d) => d.domain === opts.domain);
  }
  const limit = Math.min(opts.limit ?? 20, 100);
  return { decisions: rows.slice(-limit).reverse(), total: rows.length };
}

export function recordDecision(
  sessionId: string,
  input: {
    domain: string;
    question: string;
    recommendation: string;
    reasoning?: string[];
    confidence?: number;
    alternatives?: string[];
    risks?: string[];
    source_ref?: string | null;
  },
): Decision {
  const decision: Decision = {
    id: generateId(),
    product: "engineering-english-coach",
    domain: input.domain,
    question: input.question,
    recommendation: input.recommendation,
    reasoning: input.reasoning ?? [],
    confidence: input.confidence ?? 0.5,
    alternatives: input.alternatives ?? [],
    risks: input.risks ?? [],
    action_taken: null,
    outcome: null,
    outcome_recorded_at: null,
    created_at: new Date().toISOString(),
    source_ref: input.source_ref ?? null,
  };

  const existing = _store.get(sessionId) ?? [];
  existing.push(decision);
  _store.set(sessionId, existing);
  return decision;
}

export function recordOutcome(
  sessionId: string,
  id: string,
  input: { action_taken: ActionTaken; outcome?: string | null },
): Decision | null {
  const rows = _store.get(sessionId) ?? [];
  const target = rows.find((d) => d.id === id);
  if (!target) {
    return null;
  }
  target.action_taken = input.action_taken;
  if (input.outcome !== undefined) {
    target.outcome = input.outcome;
    target.outcome_recorded_at = new Date().toISOString();
  }
  return target;
}

/** Derived view: aggregate `risks` across recent decisions into weak areas.
 * This is the read-time aggregation ADR-016 calls for — not a separately
 * hand-maintained "truth source" table. */
export function deriveWeakAreas(sessionId: string, domain?: string, limit = 30): string[] {
  const { decisions } = listDecisions(sessionId, { domain, limit });
  const counts = new Map<string, number>();
  for (const d of decisions) {
    for (const risk of d.risks) {
      counts.set(risk, (counts.get(risk) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([risk]) => risk);
}
