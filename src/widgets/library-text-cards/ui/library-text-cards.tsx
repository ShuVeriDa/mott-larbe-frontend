"use client";

import { Typography } from "@/shared/ui/typography";

import type { LibraryTextListItem } from "@/entities/library-text";
import type { LibraryView } from "@/features/library-filters";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { CEFR_LEVELS } from "@/shared/types";
import { CefrBadge } from "@/shared/ui/cefr-badge";
import { LibraryTextCard } from "./library-text-card";

interface LibraryTextCardsProps {
	items: LibraryTextListItem[];
	view: LibraryView;
	sort: string;
}

export const LibraryTextCards = ({
	items,
	view,
	sort,
}: LibraryTextCardsProps) => {
	const { t } = useI18n();

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2.5 py-20 text-t-3">
				<svg
					width="36"
					height="36"
					viewBox="0 0 36 36"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="opacity-25"
				>
					<path d="M4 8h28M4 16h20M4 24h14M4 32h8" />
				</svg>
				<Typography tag="p" className="text-sm font-medium text-t-2">
					{t("library.empty.title")}
				</Typography>
				<Typography tag="p" className="text-xs">
					{t("library.empty.sub")}
				</Typography>
			</div>
		);
	}

	const gridClass = cn(
		view === "grid"
			? "grid grid-cols-[repeat(auto-fill,minmax(272px,1fr))] gap-3 max-sm:grid-cols-2 max-[380px]:grid-cols-1"
			: "flex flex-col gap-1.5",
	);

	if (sort === "level") {
		const groups = new Map<CefrLevel, LibraryTextListItem[]>();
		for (const item of items) {
			const lvl = (item.level ?? "") as CefrLevel;
			if (!groups.has(lvl)) groups.set(lvl, []);
			groups.get(lvl)!.push(item);
		}
		const orderedLevels = CEFR_LEVELS.filter(l => groups.has(l));

		let globalIndex = 0;
		return (
			<div className="flex flex-col gap-0">
				{orderedLevels.map(lvl => {
					const group = groups.get(lvl)!;
					return (
						<div key={lvl} className="mb-5">
							<div className="mb-2.5 flex items-center gap-2.5">
								<CefrBadge level={lvl} />
								<div className="h-px flex-1 bg-bd-1" />
								<Typography
									tag="span"
									className="shrink-0 text-[11px] text-t-3"
								>
									{group.length}
								</Typography>
							</div>
							<div className={gridClass}>
								{group.map(item => {
									const idx = globalIndex++;
									return (
										<LibraryTextCard
											key={item.id}
											item={item}
											view={view}
											index={idx}
										/>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div className={gridClass}>
			{items.map((item, i) => (
				<LibraryTextCard key={item.id} item={item} view={view} index={i} />
			))}
		</div>
	);
};
