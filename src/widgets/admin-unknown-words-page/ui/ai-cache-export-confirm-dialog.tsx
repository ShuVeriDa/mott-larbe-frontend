"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Upload } from "lucide-react";

interface AiCacheExportConfirmDialogProps {
  open: boolean;
  approvedNotExported: number;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const AiCacheExportConfirmDialog = ({
  open,
  approvedNotExported,
  isPending,
  onConfirm,
  onClose,
}: AiCacheExportConfirmDialogProps) => {
  const { t } = useI18n();

  const hasItems = approvedNotExported > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{t("aiTranslation.admin.exportConfirmTitle")}</DialogTitle>
          <DialogDescription>
            {hasItems
              ? t("aiTranslation.admin.exportConfirmDesc", { count: approvedNotExported })
              : t("aiTranslation.admin.exportConfirmNoItems")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            {t("aiTranslation.admin.exportConfirmCancel")}
          </Button>
          {hasItems && (
            <Button
              onClick={onConfirm}
              disabled={isPending}
              className="flex items-center gap-1.5"
            >
              {isPending ? (
                <div className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Upload className="size-3.5" strokeWidth={1.6} />
              )}
              {t("aiTranslation.admin.exportConfirmCta")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
