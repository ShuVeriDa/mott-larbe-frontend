"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TipTapDoc } from "@/shared/ui/notion-editor";
import {
  userTextDetailQueryOptions,
  type UserTextListItem,
} from "@/entities/user-text";
import type {
  CreateTextSubmissionDto,
  SubmissionType,
} from "@/features/text-submission";

interface CopyResult {
  dto: CreateTextSubmissionDto;
  contentRich: TipTapDoc;
}

export interface UseCopyFromUserTextReturn {
  isCopying: boolean;
  copyError: string | null;
  copyFromUserText: (item: UserTextListItem) => Promise<CopyResult | null>;
}

/**
 * Fetches the full UserText (with content) by id, then deep-copies
 * its content BY VALUE into initial TextSubmission draft fields.
 *
 * VALUE-COPY MANDATE (M4): no FK is stored back to the UserText.
 * Deleting or editing the source UserText has NO effect on the submission.
 */
export const useCopyFromUserText = (): UseCopyFromUserTextReturn => {
  const qc = useQueryClient();
  const [isCopying, setIsCopying] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copyFromUserText = async (
    item: UserTextListItem,
  ): Promise<CopyResult | null> => {
    setIsCopying(true);
    setCopyError(null);

    try {
      // Fetch full UserText (with content) — uses cache if warm
      const userText = await qc.fetchQuery(
        userTextDetailQueryOptions(item.id),
      );

      // VALUE-COPY (M4): structuredClone produces a deep copy by value.
      // Never store userText.id or any reference back to the source.
      const contentCopy = structuredClone(userText.content) as TipTapDoc;

      const submissionType: SubmissionType =
        userText.type === "ORIGINAL" ? "ORIGINAL" : "EXTERNAL";

      const dto: CreateTextSubmissionDto = {
        title: userText.title,
        language: userText.language,
        submissionType,
        // ORIGINAL: author will be derived server-side (C3). Send undefined.
        author:
          submissionType === "ORIGINAL" ? undefined : userText.author ?? undefined,
        sourceUrl: userText.sourceUrl ?? undefined,
        contentRich: contentCopy,
        status: "DRAFT",
      };

      return { dto, contentRich: contentCopy };
    } catch {
      setCopyError("copyError");
      return null;
    } finally {
      setIsCopying(false);
    }
  };

  return { isCopying, copyError, copyFromUserText };
};
