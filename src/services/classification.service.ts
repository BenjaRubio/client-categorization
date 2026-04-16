import {
  WeeklyVolume,
  UseCase,
  Industry,
  AwarenessChannel,
  Seasonality,
  IntegrationLevel,
  Urgency,
} from '@prisma/client';
import { meetingCategoryRepository } from '@/db/repositories';
import { PromptTemplate, callLLM, LLMResponse } from '@/services/llm';

const WEEKLY_VOLUME: Record<string, WeeklyVolume> = {
  '0-100': 'RANGE_0_100',
  '101-500': 'RANGE_101_500',
  '501-2000': 'RANGE_501_2000',
  '2000+': 'RANGE_2000_PLUS',
  undefined: 'UNDEFINED',
};

const USE_CASE: Record<string, UseCase> = {
  customer_service: 'CUSTOMER_SERVICE',
  scheduling: 'SCHEDULING',
  technical_support: 'TECHNICAL_SUPPORT',
  ads: 'ADS',
  other: 'OTHER',
};

const INDUSTRY: Record<string, Industry> = {
  finance: 'FINANCE',
  healthcare: 'HEALTHCARE',
  ecommerce_and_retail: 'ECOMMERCE_AND_RETAIL',
  education: 'EDUCATION',
  logistics: 'LOGISTICS',
  real_estate: 'REAL_ESTATE',
  legal: 'LEGAL',
  hospitality_and_tourism: 'HOSPITALITY_AND_TOURISM',
  telecommunications: 'TELECOMMUNICATIONS',
  gastronomy: 'GASTRONOMY',
  automotive: 'AUTOMOTIVE',
  agriculture: 'AGRICULTURE',
  professional_services: 'PROFESSIONAL_SERVICES',
  media_and_entertainment: 'MEDIA_AND_ENTERTAINMENT',
  non_profit: 'NON_PROFIT',
  technology: 'TECHNOLOGY',
  energy: 'ENERGY',
  construction: 'CONSTRUCTION',
  art_and_design: 'ART_AND_DESIGN',
};

const AWARENESS_CHANNEL: Record<string, AwarenessChannel> = {
  internet_search: 'INTERNET_SEARCH',
  networking: 'NETWORKING',
  family_friend: 'FAMILY_FRIEND',
  social_networks_ads: 'SOCIAL_NETWORK_ADS',
  webinars_talks: 'WEBINARS_TALKS',
  fair: 'FAIR',
  linkedin: 'LINKEDIN',
  podcasts: 'PODCASTS',
  other: 'OTHER',
};

const SEASONALITY: Record<string, Seasonality> = {
  constant: 'CONSTANT',
  seasonal: 'SEASONAL',
  undefined: 'UNDEFINED',
};

const INTEGRATION_LEVEL: Record<string, IntegrationLevel> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

const URGENCY: Record<string, Urgency> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
};

const REQUIRED_FIELDS = [
  'weekly_volume',
  'use_case',
  'industry',
  'awareness_channel',
  'seasonality',
  'integration_level',
  'urgency',
] as const;

function mapEnum<T>(map: Record<string, T>, value: string, field: string): T {
  const mapped = map[value];
  if (!mapped) {
    throw new Error(
      `Invalid "${value}" for "${field}". Valid: ${Object.keys(map).join(', ')}`
    );
  }
  return mapped;
}

function extractJson(text: string): Record<string, string> {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (fenceMatch) return JSON.parse(fenceMatch[1].trim());

    const braceMatch = trimmed.match(/\{[\s\S]*\}/);
    if (braceMatch) return JSON.parse(braceMatch[0]);

    throw new Error(
      `Could not extract JSON from response: ${trimmed.slice(0, 120)}...`
    );
  }
}

/**
 * Validates that the LLM response is parseable JSON with the expected
 * flat schema. Throws if not — which makes the fallback chain try
 * the next provider.
 */
function validateClassification(response: LLMResponse): void {
  const parsed = extractJson(response.text);

  const missing = REQUIRED_FIELDS.filter((f) => !(f in parsed));
  if (missing.length > 0) {
    throw new Error(
      `Response missing fields: ${missing.join(', ')}. Got keys: ${Object.keys(parsed).join(', ')}`
    );
  }
}

interface ClassificationInput {
  salesMeetingId: string;
  clientName: string;
  meetingDate: string;
  transcription: string;
}

const template = PromptTemplate.load('classify-meeting');

export async function classifyMeeting(input: ClassificationInput) {
  const request = template.render({
    clientName: input.clientName,
    meetingDate: input.meetingDate,
    transcription: input.transcription,
  });

  const response = await callLLM(request, validateClassification);
  const parsed = extractJson(response.text);

  const category = await meetingCategoryRepository.create({
    salesMeetingId: input.salesMeetingId,
    weeklyVolume: mapEnum(WEEKLY_VOLUME, parsed.weekly_volume, 'weekly_volume'),
    useCase: mapEnum(USE_CASE, parsed.use_case, 'use_case'),
    industry: mapEnum(INDUSTRY, parsed.industry, 'industry'),
    awarenessChannel: mapEnum(AWARENESS_CHANNEL, parsed.awareness_channel, 'awareness_channel'),
    seasonality: mapEnum(SEASONALITY, parsed.seasonality, 'seasonality'),
    integrationLevel: mapEnum(INTEGRATION_LEVEL, parsed.integration_level, 'integration_level'),
    urgency: mapEnum(URGENCY, parsed.urgency, 'urgency'),
  });

  console.log(
    `  ✓ Classified by ${response.provider} (${response.model})` +
      (response.usage ? ` — ${response.usage.totalTokens} tokens` : '')
  );

  return category;
}
