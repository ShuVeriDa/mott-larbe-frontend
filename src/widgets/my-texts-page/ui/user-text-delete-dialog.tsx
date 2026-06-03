"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface UserTextDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export const UserTextDeleteDialog = ({
  open,
  onConfirm,
  onCancel,
  t,
}: UserTextDeleteDialogProps) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-[13.5px] font-semibold text-t-1">
          {t("myTexts.deleteConfirmTitle")}
        </DialogTitle>
        <DialogDescription className="text-[12.5px] text-t-3">
          {t("myTexts.deleteConfirmBody")}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("myTexts.cancel")}
        </Button>
        <Button type="button" onClick={onConfirm}>
          {t("myTexts.deleteConfirm")}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
