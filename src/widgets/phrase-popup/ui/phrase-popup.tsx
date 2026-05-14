"use client";

import { usePhraseLookupStore, type PhrasePopupAnchor } from "@/features/phrase-lookup";
import { useI18n } from "@/shared/lib/i18n";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const POPUP_WIDTH = 280;
const ESTIMATED_HEIGHT = 140;
const SAFE_MARGIN = 10;

const computePosition = (anchor: PhrasePopupAnchor) => {
  if (typeof window === "undefined") return { left: 0, top: 0 };
  let left = anchor.left + anchor.width / 2 - POPUP_WIDTH / 2;
  let top = anchor.top + anchor.height + 8;
  left = Math.max(
    SAFE_MARGIN,
    Math.min(left, window.innerWidth - POPUP_WIDTH - SAFE_MARGIN),
  );
  if (top + ESTIMATED_HEIGHT > window.innerHeight - SAFE_MARGIN) {
    top = anchor.top - ESTIMATED_HEIGHT - 8;
  }
  return { left, top };
};

export const PhrasePopup = () => {
  const { t } = useI18n();
  const activePhrase = usePhraseLookupStore(s => s.activePhrase);
  const anchor = usePhraseLookupStore(s => s.anchor);
  const close = usePhraseLookupStore(s => s.close);

  const isVisible = Boolean(activePhrase) && Boolean(anchor);
  const position = anchor ? computePosition(anchor) : { left: 0, top: 0 };

  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isVisible, close]);

  if (!isVisible || !activePhrase || typeof window === "undefined") return null;

  const { phrase } = activePhrase;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-199"
        onClick={close}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-label={phrase.original}
        className="fixed z-200 w-[280px] overflow-hidden rounded-card border-hairline border-bd-2 bg-surf shadow-lg"
        style={{ left: position.left, top: position.top }}
      >
        {/* Header */}
        <div className="border-b border-hairline border-bd-1 px-3.5 pt-3.5 pb-2.5">
          <div className="mb-0.5 flex items-center gap-2">
            <span className="rounded-[4px] border-hairline border-violet-300/40 bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-violet-500 dark:border-violet-700/40 dark:bg-violet-950 dark:text-violet-400">
              {t("reader.phrase.label")}
            </span>
          </div>
          <div className="text-[16px] font-semibold tracking-[-0.2px] text-t-1">
            {phrase.original}
          </div>
        </div>

        {/* Translation */}
        <div className="px-3.5 py-2.5">
          <div className="text-[14px] font-medium text-t-1">{phrase.translation}</div>
          {phrase.notes && (
            <div className="mt-1 text-[11.5px] text-t-3">{phrase.notes}</div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
};
