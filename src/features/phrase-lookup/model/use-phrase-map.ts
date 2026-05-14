"use client";

import { useMemo } from "react";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";

/**
 * Builds a map: tokenPosition → phrase occurrence that contains it.
 * When hovering between token[i] and token[i+1], we check if any phrase
 * spans across that gap (startTokenPosition <= i && endTokenPosition >= i+1).
 */
export type PhraseMap = Map<number, PagePhraseOccurrence>;

export const usePhraseMap = (
  phrases: PagePhraseOccurrence[] | undefined,
): PhraseMap => {
  return useMemo(() => {
    const map = new Map<number, PagePhraseOccurrence>();
    if (!phrases) return map;
    for (const occ of phrases) {
      for (
        let pos = occ.startTokenPosition;
        pos <= occ.endTokenPosition;
        pos++
      ) {
        map.set(pos, occ);
      }
    }
    return map;
  }, [phrases]);
};

/**
 * Given a position between two tokens (gap after token at `position`),
 * find the phrase occurrence that spans this gap.
 * Returns the phrase if token[position] and token[position+1] are both covered.
 */
export const findPhraseAtGap = (
  phraseMap: PhraseMap,
  position: number,
): PagePhraseOccurrence | null => {
  const occ = phraseMap.get(position);
  if (!occ) return null;
  // The gap is "inside" a phrase if both sides are covered
  if (occ.endTokenPosition > position) return occ;
  return null;
};
