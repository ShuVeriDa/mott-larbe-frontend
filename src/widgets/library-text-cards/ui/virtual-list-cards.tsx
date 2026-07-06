"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { LibraryTextCard } from "./library-text-card";

interface VirtualListCardsProps {
	items: LibraryTextListItem[];
	scrollRef: RefObject<HTMLElement | null>;
}

const ESTIMATED_ITEM_HEIGHT = 58;
const OVERSCAN = 5;
const GAP = 6;

const VirtualListCardsDesktop = ({ items, scrollRef }: VirtualListCardsProps) => {
	const virtualizer = useVirtualizer({
		count: items.length,
		getScrollElement: () => scrollRef.current,
		estimateSize: () => ESTIMATED_ITEM_HEIGHT,
		overscan: OVERSCAN,
		gap: GAP,
	});

	const virtualRows = virtualizer.getVirtualItems();

	// Before hydration the virtualizer has no scroll container to measure,
	// so it reports zero virtual rows — that would leave crawlers and
	// no-JS visitors with an empty list. Render a plain (non-virtualized)
	// fallback until real measurements land.
	if (virtualRows.length === 0) {
		return <FlatListCards items={items} />;
	}

	return (
		<div
			className="relative w-full"
			style={{ height: `${virtualizer.getTotalSize()}px` }}
		>
			{virtualRows.map((virtualRow) => {
				const item = items[virtualRow.index];
				return (
					<div
						key={item.id}
						data-index={virtualRow.index}
						ref={virtualizer.measureElement}
						className="absolute left-0 top-0 w-full"
						style={{ transform: `translateY(${virtualRow.start}px)` }}
					>
						<LibraryTextCard item={item} view="list" index={virtualRow.index} />
					</div>
				);
			})}
		</div>
	);
};

const FlatListCards = ({ items }: Pick<VirtualListCardsProps, "items">) => (
	<div className="flex flex-col gap-1.5">
		{items.map((item, i) => (
			<LibraryTextCard key={item.id} item={item} view="list" index={i} />
		))}
	</div>
);

export const VirtualListCards = ({ items, scrollRef }: VirtualListCardsProps) => {
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false,
	);

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 767px)");
		setIsMobile(mql.matches);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener("change", handler);
		return () => mql.removeEventListener("change", handler);
	}, []);

	if (isMobile) {
		return <FlatListCards items={items} />;
	}

	return <VirtualListCardsDesktop items={items} scrollRef={scrollRef} />;
};
