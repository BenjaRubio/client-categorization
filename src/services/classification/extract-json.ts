import { LLMResponse } from '@/services/llm/types';
import { assertClassificationEnumMaps } from './enum-maps';

const REQUIRED_FIELDS = [
  'weekly_volume',
  'use_case',
  'industry',
  'awareness_channel',
  'seasonality',
  'integration_level',
  'urgency',
] as const;

/**
 * Strips trailing commas before `}` or `]` — a common LLM JSON mistake.
 */
function sanitizeJson(text: string): string {
  return text.replace(/,\s*([\]}])/g, '$1');
}

function tryParse(text: string): Record<string, string> {
  return JSON.parse(sanitizeJson(text));
}

export function extractJson(text: string): Record<string, string> {
  const trimmed = text.trim();

  try {
    return tryParse(trimmed);
  } catch {
    const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (fenceMatch) return tryParse(fenceMatch[1].trim());

    const braceMatch = trimmed.match(/\{[\s\S]*\}/);
    if (braceMatch) return tryParse(braceMatch[0]);

    throw new Error(
      `Could not extract JSON from response:\n${trimmed}`
    );
  }
}

/**
 * Validates that the LLM response is parseable JSON with the expected
 * flat schema. Throws if not — which makes the fallback chain try
 * the next provider.
 */
export function validateClassification(response: LLMResponse): void {
  const parsed = extractJson(response.text);

  const missing = REQUIRED_FIELDS.filter((f) => !(f in parsed));
  if (missing.length > 0) {
    throw new Error(
      `Response missing fields: ${missing.join(', ')}. Got keys: ${Object.keys(parsed).join(', ')}`
    );
  }

  assertClassificationEnumMaps(parsed);
}
