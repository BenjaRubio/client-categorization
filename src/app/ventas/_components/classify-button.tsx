'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui';
import { classifyMeetingAction } from '../_actions/classify-meeting.action';

interface ClassifyButtonProps {
  salesMeetingId: string;
  batchActiveMeetingId?: string | null;
  isBatchRunning?: boolean;
}

export function ClassifyButton({
  salesMeetingId,
  batchActiveMeetingId = null,
  isBatchRunning = false,
}: ClassifyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isThisRowBatchLoading =
    isBatchRunning && batchActiveMeetingId === salesMeetingId;
  const showLoading = isPending || isThisRowBatchLoading;
  const disabled = isPending || isBatchRunning;

  return (
    <Button
      size="sm"
      onClick={() =>
        startTransition(async () => {
          const result = await classifyMeetingAction(salesMeetingId);
          if (!result.ok) {
            console.error(result.error);
          }
          router.refresh();
        })
      }
      disabled={disabled}
    >
      {showLoading ? 'Clasificando...' : 'Clasificar'}
    </Button>
  );
}
