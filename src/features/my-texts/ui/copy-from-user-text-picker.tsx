"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import {
  userTextListQueryOptions,
  type UserTextListItem,
} from "@/entities/user-text";
import { useCopyFromUserText } from "../model/use-copy-from-user-text";
import type { CreateTextSubmissionDto } from "@/features/text-submission";
import type { TipTapDoc } from "@/shared/ui/notion-editor";

interface CopyFromUserTextPickerProps {
  onCopied: (dto: CreateTextSubmissionDto, contentRich: TipTapDoc) => void;
  t: (key: string) => string;
}

export const CopyFromUserTextPicker = ({
  onCopied,
  t,
}: CopyFromUserTextPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isCopying, copyFromUserText } = useCopyFromUserText();

  // Lazy load: only fetch when dialog opens (performance note from plan)
  const listQuery = useQuery({
    ...userTextListQueryOptions({ limit: 50 }),
    enabled: isOpen,
  });

  const handleOpenChange = (open: boolean) => setIsOpen(open);

  const handleOpen = () => setIsOpen(true);

  const handleSelectItem = async (item: UserTextListItem) => {
    const result = await copyFromUserText(item);
    if (!result) return;
    // VALUE-COPY (M4): result.contentRich is a structuredClone — no reference to source
    onCopied(result.dto, result.contentRich);
    setIsOpen(false);
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={handleOpen}>
        {t("myTexts.submit.copyFromMyTexts")}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[13.5px] font-semibold text-t-1">
              {t("myTexts.submit.copyPickerTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-72 overflow-y-auto">
            {listQuery.isPending && (
              <div className="space-y-2 p-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[52px] animate-pulse rounded-xl border border-bd-1 bg-surf-2"
                  />
                ))}
              </div>
            )}

            {!listQuery.isPending &&
              listQuery.data?.data.length === 0 && (
                <div className="flex flex-col items-center px-4 py-12 text-center">
                  <Inbox className="mb-3 size-8 text-t-4" />
                  <Typography tag="p" className="text-[12.5px] text-t-3">
                    {t("myTexts.empty")}
                  </Typography>
                </div>
              )}

            {listQuery.data?.data.map((item) => {
              const handleItemClick = () => handleSelectItem(item);
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isCopying}
                  onClick={handleItemClick}
                  className="flex w-full flex-col gap-0.5 border-b border-bd-1 px-4 py-3 text-left last:border-b-0 hover:bg-surf-2 disabled:opacity-50"
                >
                  <Typography
                    tag="span"
                    className="truncate text-[13px] font-medium text-t-1"
                  >
                    {item.title}
                  </Typography>
                  <Typography tag="span" className="text-[11.5px] text-t-3">
                    {item.language}
                    {item.author && ` · ${item.author}`}
                  </Typography>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
