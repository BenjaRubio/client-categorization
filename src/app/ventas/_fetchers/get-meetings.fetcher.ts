import { salesMeetingRepository } from '@/db/repositories';

export async function getMeetings() {
  return salesMeetingRepository.findAllWithDetails();
}
