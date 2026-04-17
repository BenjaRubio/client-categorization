'use server';

import { revalidatePath } from 'next/cache';
import { meetingCategoryRepository, salesMeetingRepository } from '@/db/repositories';
import { classifyMeeting } from '@/services/classification';

export async function classifyMeetingAction(salesMeetingId: string) {
  const existing = await meetingCategoryRepository.findBySalesMeetingId(salesMeetingId);

  if (existing) {
    return { ok: true as const, reason: 'already-classified' as const };
  }

  const meeting = await salesMeetingRepository.findWithCategory(salesMeetingId);
  if (!meeting) {
    throw new Error('No se encontró la reunión solicitada.');
  }

  try {
    await classifyMeeting({
      salesMeetingId: meeting.id,
      clientName: meeting.client.name,
      meetingDate: meeting.date.toISOString().split('T')[0],
      transcription: meeting.transcription,
    });

    revalidatePath('/ventas');
    return { ok: true as const, reason: 'classified' as const };
  } catch (error) {
    return { ok: false as const, reason: 'error' as const, error: error instanceof Error ? error.message : String(error) };
  }
}
