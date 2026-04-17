import { salesMeetingRepository } from '@/db/repositories';

export async function getMetricsData() {
  return salesMeetingRepository.findAllWithDetails();
}
