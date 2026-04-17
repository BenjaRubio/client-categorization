import {
  clientRepository,
  meetingCategoryRepository,
  salesMeetingRepository,
} from '@/db/repositories';

export async function getMainMetrics() {
  const [totalClients, totalMeetings, categorizedMeetings, closedMeetings] =
    await Promise.all([
      clientRepository.countAll(),
      salesMeetingRepository.countAll(),
      meetingCategoryRepository.countAll(),
      salesMeetingRepository.countClosed(),
    ]);

  const closedPercent =
    totalMeetings > 0 ? Math.round((closedMeetings / totalMeetings) * 1000) / 10 : 0;

  return {
    totalClients,
    totalMeetings,
    categorizedMeetings,
    closedMeetings,
    closedPercent,
  };
}
