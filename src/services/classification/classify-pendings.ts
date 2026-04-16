import prisma from '@/db/prisma-client';
import { salesMeetingRepository } from '@/db/repositories';
import { classifyMeeting } from './classify-meeting';

async function main() {
  const pending = await salesMeetingRepository.findUnclassified();

  if (pending.length === 0) {
    console.log('No unclassified meetings found.');
    return;
  }

  console.log(`Found ${pending.length} unclassified meeting(s).\n`);

  let success = 0;
  let failed = 0;

  for (const meeting of pending) {
    const label = `[${success + failed + 1}/${pending.length}] ${meeting.client.name}`;
    console.log(label);

    try {
      await classifyMeeting({
        salesMeetingId: meeting.id,
        clientName: meeting.client.name,
        meetingDate: meeting.date.toISOString().split('T')[0],
        transcription: meeting.transcription,
      });
      success++;
    } catch (error) {
      failed++;
      console.error(
        `  ✗ Failed: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  console.log(`\nDone. ${success} classified, ${failed} failed.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
