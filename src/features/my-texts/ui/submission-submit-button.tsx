"use client";

import { Button } from "@/shared/ui/button";

// Two distinct actions — Save draft and Request submit.
// useFormStatus is NOT used here because both actions call mutations directly
// (not a native <form action={serverAction}>). isPending comes from useMutation.

interface SubmissionSubmitButtonProps {
  isPending: boolean;
  onSaveDraft: () => void;
  onRequestSubmit: () => void;
  t: (key: string) => string;
}

export const SubmissionSubmitButton = ({
  isPending,
  onSaveDraft,
  onRequestSubmit,
  t,
}: SubmissionSubmitButtonProps) => (
  <div className="flex items-center gap-2">
    <Button
      type="button"
      variant="outline"
      disabled={isPending}
      onClick={onSaveDraft}
    >
      {t("myTexts.submit.saveDraft")}
    </Button>
    <Button
      type="button"
      disabled={isPending}
      onClick={onRequestSubmit}
    >
      {t("myTexts.submit.sendToModeration")}
    </Button>
  </div>
);
