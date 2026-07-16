/**
 * Thin LLM client — cache/fallback discipline.
 *
 * This module is the ONLY place that talks to an external model. Callers
 * (exercise-engine.ts, review-engine.ts) must check `isAvailable()` first
 * and fall back to their deterministic path on any LLMError — the same
 * dual-path discipline claims-workflow-v2-poc uses (`_run_heuristic` /
 * `_run_llm`), not a cache in the strict sense. See
 * docs/adr/001-decision-ledger-adoption.md for the related Decision Ledger
 * rationale.
 *
 * No API key is required to run this app locally — isAvailable() returns
 * false and every feature works via the heuristic engines.
 */

export class LLMError extends Error {}

export function isAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function callClaude(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new LLMError("ANTHROPIC_API_KEY not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new LLMError(`Claude API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const block = data?.content?.[0];
  if (!block || block.type !== "text") {
    throw new LLMError("Unexpected Claude response shape");
  }
  return block.text as string;
}
