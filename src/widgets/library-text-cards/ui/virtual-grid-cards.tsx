"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { LibraryPreviewCard } from "@/widgets/dashboard-page/ui/library-preview-card";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

interface VirtualGridCardsProps {
	items: LibraryTextListItem[];
	scrollRef: RefObject<HTMLElement | null>;
}

const ESTIMATED_CARD_HEIGHT = 300;
const OVERSCAN = 2;
const GAP = 12;

const MIN_CARD_WIDTH_SM = 130;
const MIN_CARD_WIDTH_MD = 148;
const MIN_CARD_WIDTH_LG = 168;

const getColumnsCount = (width: number): number => {
	if (width === 0) return 2;
	const minWidth =
		width >= 1024
			? MIN_CARD_WIDTH_LG
			: width >= 768
				? MIN_CARD_WIDTH_MD
				: MIN_CARD_WIDTH_SM;
	return Math.max(1, Math.floor((width + GAP) / (minWidth + GAP)));
};

const useContainerColumns = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [columns, setColumns] = useState(2);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new ResizeObserver(([entry]) => {
			setColumns(getColumnsCount(entry.contentRect.width));
		});
		observer.observe(container);
		setColumns(getColumnsCount(container.getBoundingClientRect().width));
		return () => observer.disconnect();
	}, []);

	return { containerRef, columns };
};

const VirtualGridCardsDesktop = ({
	items,
	scrollRef,
}: VirtualGridCardsProps) => {
	"use no memo";
	const { lang } = useI18n();
	const { containerRef, columns } = useContainerColumns();
	const rowCount = Math.ceil(items.length / columns);

	const virtualizer = useVirtualizer({
		count: rowCount,
		getScrollElement: () => scrollRef.current,
		estimateSize: () => ESTIMATED_CARD_HEIGHT + GAP,
		overscan: OVERSCAN,
	});

	const virtualRows = virtualizer.getVirtualItems();

	// Before hydration the virtualizer has no scroll container to measure,
	// so it reports zero virtual rows — that would leave crawlers and
	// no-JS visitors with an empty grid. Render the first screenful as a
	// plain (non-virtualized) fallback until real measurements land.
	if (virtualRows.length === 0) {
		return (
			<div ref={containerRef} className="w-full">
				<FlatGridCards items={items} />
			</div>
		);
	}

	return (
		<div ref={containerRef} className="w-full">
			<div
				className="relative w-full"
				style={{ height: `${virtualizer.getTotalSize()}px` }}
			>
				{virtualRows.map(virtualRow => {
					const startIndex = virtualRow.index * columns;
					const rowItems = items.slice(startIndex, startIndex + columns);
					return (
						<div
							key={virtualRow.index}
							data-index={virtualRow.index}
							ref={virtualizer.measureElement}
							className="absolute left-0 top-0 w-full"
							style={{
								transform: `translateY(${virtualRow.start}px)`,
								display: "grid",
								gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
								columnGap: `${GAP}px`,
								paddingBottom: `${GAP}px`,
							}}
						>
							{rowItems.map(item => (
								<div key={item.id} className="min-w-0">
									<LibraryPreviewCard item={item} lang={lang} />
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const FlatGridCards = ({
	items,
}: Pick<VirtualGridCardsProps, "items">) => {
	const { lang } = useI18n();
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
			{items.map(item => (
				<div key={item.id} className="min-w-0">
					<LibraryPreviewCard item={item} lang={lang} />
				</div>
			))}
		</div>
	);
};

export const VirtualGridCards = ({
	items,
	scrollRef,
}: VirtualGridCardsProps) => {
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(max-width: 767px)").matches;
	});

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 767px)");
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	if (isMobile) {
		return <FlatGridCards items={items} />;
	}

	return <VirtualGridCardsDesktop items={items} scrollRef={scrollRef} />;
};
