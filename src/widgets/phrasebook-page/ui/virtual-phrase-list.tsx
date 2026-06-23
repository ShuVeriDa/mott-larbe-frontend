"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import type { RefObject } from "react";
import type { Phrase } from "@/entities/phrasebook";
import { PhraseCard } from "./phrase-card";

interface VirtualPhraseListProps {
	phrases: Phrase[];
	scrollRef: RefObject<HTMLElement | null>;
	selectionMode: boolean;
	selectedPhraseIds: Set<string>;
}

const ESTIMATED_ITEM_HEIGHT = 62;
const OVERSCAN = 5;
const GAP = 6;

export const VirtualPhraseList = ({
	phrases,
	scrollRef,
	selectionMode,
	selectedPhraseIds,
}: VirtualPhraseListProps) => {
	const virtualizer = useVirtualizer({
		count: phrases.length,
		getScrollElement: () => scrollRef.current,
		estimateSize: () => ESTIMATED_ITEM_HEIGHT,
		overscan: OVERSCAN,
		gap: GAP,
	});

	return (
		<div
			className="relative w-full"
			style={{ height: `${virtualizer.getTotalSize()}px` }}
		>
			{virtualizer.getVirtualItems().map(virtualRow => {
				const phrase = phrases[virtualRow.index];
				return (
					<div
						key={phrase.id}
						data-index={virtualRow.index}
						ref={virtualizer.measureElement}
						className="absolute left-0 top-0 w-full"
						style={{ transform: `translateY(${virtualRow.start}px)` }}
					>
						<PhraseCard
							phrase={phrase}
							selectionMode={selectionMode}
							selected={selectedPhraseIds.has(phrase.id)}
						/>
					</div>
				);
			})}
		</div>
	);
};
