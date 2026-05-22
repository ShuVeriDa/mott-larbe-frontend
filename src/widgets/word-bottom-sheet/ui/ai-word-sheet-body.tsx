"use client";

import { useAiWordLookup, useAiSessionStore, useAiWordRefine, WordRefineBlock } from "@/features/ai-word-lookup";
import { useGeminiKeyStatus } from "@/entities/ai-translation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Check, CheckCircle2, Clock, Copy, Settings, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AiWordSheetBodyProps {
  word: string;
  normalized: string;
  contextSentence?: string;
  lang: string;
  onClose: () => void;
}

export const AiWordSheetBody = ({ word, normalized, contextSentence, lang, onClose }: AiWordSheetBodyProps) => {
  const { t } = useI18n();
  const { state, voted, translate, vote } = useAiWordLookup();
  const { refineState, openRefine, refine: refineWord } = useAiWordRefine();
  const { data: keyStatus } = useGeminiKeyStatus();
  const addToSession = useAiSessionStore((s) => s.add);

  const hasKey = keyStatus?.hasKey ?? false;

  useEffect(() => {
    if (hasKey) {
      translate(normalized, contextSentence);
    }
  }, [normalized, contextSentence, hasKey]);

  useEffect(() => {
    if (state.phase === "done") {
      addToSession(word, state.result);
    }
  }, [state.phase]);

  const [copied, setCopied] = useState(false);

  const handleThumbsUp = () => vote("up");
  const handleThumbsDown = () => vote("down");
  const handleRefineSubmit = (hint: string) => {
    if (state.phase !== "done") return;
    refineWord(word, state.result.translation, hint, contextSentence);
  };
  const handleCopy = () => {
    if (state.phase !== "done") return;
    navigator.clipboard.writeText(state.result.translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!hasKey) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-5">
          <Typography tag="p" className="text-[14px] text-t-2">
            {t("aiTranslation.popup.notFound")}
          </Typography>
          <Typography tag="p" className="text-[13px] text-t-3">
            {t("aiTranslation.popup.recorded")}
          </Typography>
          <Link
            href={`/${lang}/settings?tab=ai`}
            className="inline-flex items-center gap-1.5 text-[13px] text-acc hover:underline"
          >
            <Settings className="size-3.5" strokeWidth={1.5} />
            {t("aiTranslation.popup.goToSettings")}
          </Link>
        </div>
        <div className="flex shrink-0 gap-2 border-t border-bd-1 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
          <Button
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-bd-2 bg-surf-2 text-[14px] font-semibold text-t-2"
          >
            <X className="size-4" strokeWidth={1.6} />
            {t("reader.sheet.close")}
          </Button>
        </div>
      </div>
    );
  }

  if (state.phase === "loading" || state.phase === "idle") {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-4 py-12">
        <div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
        <div className="text-[12px] text-t-3">{t("aiTranslation.popup.translating")}</div>
      </div>
    );
  }

  if (state.phase === "not_chechen") {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5">
        <Typography tag="p" className="text-[14px] text-t-3">
          {t("aiTranslation.popup.notChechen")}
        </Typography>
      </div>
    );
  }

  if (state.phase === "error" || state.phase === "no_key") {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5">
        <Typography tag="p" className="text-[14px] text-red-t">
          {t("reader.toasts.dictFailed")}
        </Typography>
      </div>
    );
  }

  const result = state.result;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-bd-1 px-4 pb-3.5 pt-4">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="font-display text-[22px] font-semibold tracking-[-0.3px] text-t-1">
              {word}
            </span>
            <span className="flex items-center gap-1 rounded-[4px] border border-pur/30 bg-pur-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-pur-t">
              <Sparkles className="size-2.5" strokeWidth={1.8} />
              {t("aiTranslation.popup.badge")}
            </span>
          </div>
          <Typography tag="p" className="text-[11px] text-pur-t">
            {t("aiTranslation.popup.badgeHint")}
          </Typography>
        </div>

        <div className="border-b border-bd-1 px-4 py-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[16px] font-medium text-t-1">{result.translation}</div>
            <Button
              size="bare"
              onClick={handleCopy}
              aria-label={t("aiTranslation.popup.copy")}
              title={t("aiTranslation.popup.copy")}
              className="mt-0.5 shrink-0 rounded p-0.5 text-t-4 transition-colors hover:text-t-2"
            >
              {copied
                ? <Check className="size-3.5" strokeWidth={1.8} />
                : <Copy className="size-3.5" strokeWidth={1.5} />}
            </Button>
          </div>
          <div className={cn(
            "mt-1 flex items-center gap-1 text-[11px]",
            result.fromCache && result.status === "APPROVED" ? "text-grn" : result.fromCache ? "text-t-4" : "text-pur-t",
          )}>
            {result.fromCache && result.status === "APPROVED"
              ? <><CheckCircle2 className="size-3" strokeWidth={1.8} />{t("aiTranslation.popup.sourceApproved")}</>
              : result.fromCache
                ? <><Clock className="size-3" strokeWidth={1.8} />{t("aiTranslation.popup.sourcePending")}</>
                : <><Sparkles className="size-3" strokeWidth={1.8} />{t("aiTranslation.popup.sourceFresh")}</>}
          </div>
          {result.partOfSpeech && (
            <div className="mt-1.5 text-[12px] text-t-3">
              {t("aiTranslation.popup.partOfSpeech")}: <span className="text-t-2">{result.partOfSpeech}</span>
            </div>
          )}
          {result.transliteration && (
            <div className="mt-0.5 text-[12px] text-t-3">
              {t("aiTranslation.popup.transliteration")}: <span className="font-medium text-t-2">{result.transliteration}</span>
            </div>
          )}
          {result.example && (
            <div className="mt-2 text-[12px] text-t-3 italic">{result.example}</div>
          )}
        </div>

        <div className="flex items-center gap-2 px-4 py-3">
          <Button
            size="bare"
            onClick={handleThumbsUp}
            disabled={Boolean(voted)}
            aria-label={t("aiTranslation.admin.thumbsUp")}
            className={`flex h-9 items-center gap-1.5 rounded-base border px-3 text-[13px] transition-colors ${
              voted === "up"
                ? "border-grn/40 bg-grn/10 text-grn"
                : "border-bd-2 bg-surf-2 text-t-3 hover:text-t-1"
            }`}
          >
            <ThumbsUp className="size-3.5" strokeWidth={1.5} />
            {result.thumbsUp + (voted === "up" ? 1 : 0)}
          </Button>
          <Button
            size="bare"
            onClick={handleThumbsDown}
            disabled={Boolean(voted)}
            aria-label={t("aiTranslation.admin.thumbsDown")}
            className={`flex h-9 items-center gap-1.5 rounded-base border px-3 text-[13px] transition-colors ${
              voted === "down"
                ? "border-red/40 bg-red/10 text-red"
                : "border-bd-2 bg-surf-2 text-t-3 hover:text-t-1"
            }`}
          >
            <ThumbsDown className="size-3.5" strokeWidth={1.5} />
            {result.thumbsDown + (voted === "down" ? 1 : 0)}
          </Button>
        </div>
        <WordRefineBlock
          refineState={refineState}
          size="md"
          onOpen={openRefine}
          onSubmit={handleRefineSubmit}
        />
      </div>

      <div className="flex shrink-0 gap-2 border-t border-bd-1 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button
          onClick={onClose}
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-bd-2 bg-surf-2 text-[14px] font-semibold text-t-2"
        >
          <X className="size-4" strokeWidth={1.6} />
          {t("reader.sheet.close")}
        </Button>
      </div>
    </div>
  );
};
