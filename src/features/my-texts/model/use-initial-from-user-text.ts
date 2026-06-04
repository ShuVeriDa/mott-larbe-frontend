"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TipTapDoc } from "@/shared/ui/notion-editor";
import { userTextDetailQueryOptions } from "@/entities/user-text";
import type { SubmissionType } from "@/features/text-submission";
import type { UseSubmissionEditorProps, SubmissionPageContent } from "./use-submission-editor";

type InitialValues = NonNullable<UseSubmissionEditorProps["initial"]>;

// UserText stores multi-page content as:
// { type: "doc", content: [{ type: "multi_page_wrapper", attrs: { type: "multi-page", pages: TipTapDoc[] } }] }
// Extract each page as a separate SubmissionPageContent.
const extractPages = (content: unknown): SubmissionPageContent[] => {
  const EMPTY: SubmissionPageContent[] = [{ doc: { type: "doc", content: [] }, title: "" }];
  if (!content || typeof content !== "object") return EMPTY;
  const c = content as Record<string, unknown>;
  if (Array.isArray(c.content) && c.content.length === 1) {
    const first = c.content[0] as Record<string, unknown>;
    if (first?.type === "multi_page_wrapper" && first?.attrs) {
      const attrs = first.attrs as { type?: string; pages?: unknown[] };
      if (attrs.type === "multi-page" && Array.isArray(attrs.pages) && attrs.pages.length > 0) {
        return attrs.pages.map((page) => ({
          doc: page as TipTapDoc,
          title: "",
        }));
      }
    }
  }
  // Single-page content — wrap as one page
  return [{ doc: content as TipTapDoc, title: "" }];
};

interface UseInitialFromUserTextResult {
  initial: InitialValues | undefined;
  isLoading: boolean;
}

export const useInitialFromUserText = (
  fromUserTextId: string | undefined,
): UseInitialFromUserTextResult => {
  const qc = useQueryClient();
  const [initial, setInitial] = useState<InitialValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!!fromUserTextId);

  useEffect(() => {
    if (!fromUserTextId) return;

    let cancelled = false;
    setIsLoading(true);

    qc.fetchQuery(userTextDetailQueryOptions(fromUserTextId))
      .then((userText) => {
        if (cancelled) return;

        const submissionType: SubmissionType =
          userText.type === "ORIGINAL" ? "ORIGINAL" : "EXTERNAL";

        // VALUE-COPY (M4): structuredClone ensures complete independence from the source UserText
        const pages = structuredClone(extractPages(userText.content));

        setInitial({
          title: userText.title,
          language: userText.language,
          submissionType,
          author:
            submissionType === "ORIGINAL"
              ? undefined
              : userText.author ?? undefined,
          sourceUrl: userText.sourceUrl ?? undefined,
          pages,
        });
      })
      .catch(() => {
        // silently ignore — form stays empty
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fromUserTextId, qc]);

  return { initial, isLoading };
};
