"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { NotionEditor } from "@/shared/ui/notion-editor";
import { useMyTextReader } from "../model/use-my-text-reader";

// Fallback when TipTap content is malformed — C2 fallback rule + m4 ErrorBoundary
const RichContentFallback = () => (
  <div className="mx-auto max-w-2xl px-6 py-8">
    <Typography tag="p" className="text-[13px] text-t-3">
      —
    </Typography>
  </div>
);

interface MyTextReaderInnerProps {
  id: string;
  lang: string;
}

// Inner component — useSuspenseQuery triggers Suspense; parent wraps in <Suspense>
export const MyTextReaderInner = ({ id, lang }: MyTextReaderInnerProps) => {
  const { t, userText } = useMyTextReader(id);

  const isValidContent =
    userText.content !== null &&
    typeof userText.content === "object" &&
    "type" in userText.content;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-bd-1 bg-surf px-[22px] py-3 max-sm:px-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="h-8 px-2">
            <Link href={`/${lang}/my-texts`}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="sr-only">{t("common.back")}</span>
            </Link>
          </Button>
          <h1 className="line-clamp-1 text-[13.5px] font-semibold text-t-1">
            {userText.title}
          </h1>
        </div>

        <Button asChild variant="outline" className="h-8">
          <Link href={`/${lang}/my-texts/${id}/edit`}>
            <Pencil className="mr-1.5 size-3.5" aria-hidden="true" />
            {t("myTexts.edit")}
          </Link>
        </Button>
      </header>

      {/* Meta */}
      <div className="shrink-0 border-b border-bd-1 bg-surf px-[22px] py-2 max-sm:px-4">
        <Typography tag="p" className="text-[11.5px] text-t-3">
          {userText.language}
          {userText.author && ` · ${userText.author}`}
          {" · "}
          {new Date(userText.updatedAt).toLocaleDateString()}
        </Typography>
      </div>

      {/* Content — C2 fallback rule + m4 ErrorBoundary around renderer */}
      <div className="flex-1 overflow-y-auto">
        <ErrorBoundary fallback={<RichContentFallback />}>
          {isValidContent ? (
            <div
              className="pointer-events-none select-text"
              aria-label={t("myTexts.reader.ariaLabel")}
            >
              <NotionEditor
                content={userText.content}
                onUpdate={() => undefined}
                slashMenuItems={[]}
                minHeight="100%"
              />
            </div>
          ) : (
            <RichContentFallback />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};
