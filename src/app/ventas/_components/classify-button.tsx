'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui';
import { classifyMeetingAction } from '../_actions/classify-meeting.action';

interface ClassifyButtonProps {
  salesMeetingId: string;
}

export function ClassifyButton({ salesMeetingId }: ClassifyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      size="sm"
      onClick={() =>
        startTransition(async () => {
          await classifyMeetingAction(salesMeetingId);
          router.refresh();
        })
      }
      disabled={isPending}
    >
      {isPending ? 'Clasificando...' : 'Clasificar'}
    </Button>
  );
}
