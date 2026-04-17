import { meetingCategoryRepository } from '@/db/repositories';
import { PromptTemplate, callLLM } from '@/services/llm';
import { extractJson, validateClassification } from './extract-json';
import {
  mapEnum,
  WEEKLY_VOLUME,
  USE_CASE,
  INDUSTRY,
  AWARENESS_CHANNEL,
  SEASONALITY,
  INTEGRATION_LEVEL,
  URGENCY,
} from './enum-maps';

export interface ClassificationInput {
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
  console.log("response", response.text);
  const parsed = extractJson(response.text);

  console.log("meetings parsed", parsed);

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
