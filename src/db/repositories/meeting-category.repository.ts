import prisma from '@/db/prisma';
import {
  MeetingCategory,
  WeeklyVolume,
  UseCase,
  Industry,
  AwarenessChannel,
  Seasonality,
  IntegrationLevel,
  Urgency,
} from '@prisma/client';

export async function create(data: {
  salesMeetingId: string;
  weeklyVolume: WeeklyVolume;
  useCase: UseCase;
  industry: Industry;
  awarenessChannel: AwarenessChannel;
  seasonality: Seasonality;
  integrationLevel: IntegrationLevel;
  urgency: Urgency;
}): Promise<MeetingCategory> {
  return prisma.meetingCategory.create({ data });
}

export async function findBySalesMeetingId(
  salesMeetingId: string
): Promise<MeetingCategory | null> {
  return prisma.meetingCategory.findUnique({ where: { salesMeetingId } });
}

export async function findAll(): Promise<MeetingCategory[]> {
  return prisma.meetingCategory.findMany();
}
