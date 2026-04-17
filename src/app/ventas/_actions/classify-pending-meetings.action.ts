'use server';

import { revalidatePath } from 'next/cache';
import { meetingCategoryRepository, salesMeetingRepository } from '@/db/repositories';
import { classifyMeeting } from '@/services/classification';

export type ClassifyBatchResult = {
  ok: true;
  success: number;
  skipped: number;
  failed: number;
};

/**
 * Classifies multiple meetings (e.g. all pending in the current table view).
 * Skips rows that already have a category.
 */
export async function classifyPendingMeetingsAction(
  salesMeetingIds: string[]
): Promise<ClassifyBatchResult> {
  const uniqueIds = [...new Set(salesMeetingIds)];
  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const salesMeetingId of uniqueIds) {
    const existing = await meetingCategoryRepository.findBySalesMeetingId(salesMeetingId);
    if (existing) {
      skipped++;
      continue;
    }

    const meeting = await salesMeetingRepository.findWithCategory(salesMeetingId);
    if (!meeting) {
      failed++;
      continue;
    }

    try {
      await classifyMeeting({
        salesMeetingId: meeting.id,
        clientName: meeting.client.name,
        meetingDate: meeting.date.toISOString().split('T')[0],
        transcription: meeting.transcription,
      });
      success++;
    } catch {
      failed++;
    }
  }

  revalidatePath('/ventas');
  revalidatePath('/metricas');
  return { ok: true, success, skipped, failed };
}
