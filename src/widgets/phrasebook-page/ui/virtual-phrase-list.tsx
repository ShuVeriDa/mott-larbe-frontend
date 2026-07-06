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

const FlatPhraseList = ({
	phrases,
	selectionMode,
	selectedPhraseIds,
}: Omit<VirtualPhraseListProps, "scrollRef">) => (
	<div className="flex flex-col gap-1.5">
		{phrases.map(phrase => (
			<PhraseCard
				key={phrase.id}
				phrase={phrase}
				selectionMode={selectionMode}
				selected={selectedPhraseIds.has(phrase.id)}
			/>
		))}
	</div>
);

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

	const virtualRows = virtualizer.getVirtualItems();

	// Before hydration the virtualizer has no scroll container to measure,
	// so it reports zero virtual rows — that would leave crawlers and
	// no-JS visitors with an empty phrase list. Render a plain
	// (non-virtualized) fallback until real measurements land.
	if (virtualRows.length === 0) {
		return (
			<FlatPhraseList
				phrases={phrases}
				selectionMode={selectionMode}
				selectedPhraseIds={selectedPhraseIds}
			/>
		);
	}

	return (
		<div
			className="relative w-full"
			style={{ height: `${virtualizer.getTotalSize()}px` }}
		>
			{virtualRows.map(virtualRow => {
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
