"use client";

// useFormStatus must be inside a child of <form> — never on the same level.
import { useFormStatus } from "react-dom";
import { Button } from "@/shared/ui/button";

interface UserTextEditorSubmitButtonProps {
  label: string;
  pendingLabel: string;
}

export const UserTextEditorSubmitButton = ({
  label,
  pendingLabel,
}: UserTextEditorSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
};
