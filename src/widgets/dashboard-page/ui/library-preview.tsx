"use client";

import { useLibraryPreview } from "../model";
import { HorizontalScrollRow } from "./horizontal-scroll-row";
import { LibraryPreviewCard, LibraryPreviewCardSkeleton } from "./library-preview-card";
import { LibraryPreviewEmpty } from "./library-preview-empty";
import { LibraryPreviewFilters } from "./library-preview-filters";
import { LibraryPreviewHeader } from "./library-preview-header";

export interface LibraryPreviewProps {
	lang: string;
}

const SKELETON_COUNT = 6;

const itemClass = "w-[120px] shrink-0 md:w-[148px] lg:w-[168px] xl:w-[196px]";

export const LibraryPreview = ({ lang }: LibraryPreviewProps) => {
	const {
		filterLang,
		filterLevel,
		isPending,
		items,
		viewAllHref,
		langFilters,
		levelFilters,
		handleResetLanguageFilter,
		handleResetLevelFilter,
		handleLanguageFilterToggle,
		handleLevelFilterToggle,
	} = useLibraryPreview(lang);

	return (
		<section>
			<LibraryPreviewHeader viewAllHref={viewAllHref} />
			<LibraryPreviewFilters
				filterLang={filterLang}
				filterLevel={filterLevel}
				langFilters={langFilters}
				levelFilters={levelFilters}
				onResetLanguageFilter={handleResetLanguageFilter}
				onResetLevelFilter={handleResetLevelFilter}
				onLanguageFilterToggle={handleLanguageFilterToggle}
				onLevelFilterToggle={handleLevelFilterToggle}
			/>

			{isPending ? (
				<div className="flex gap-2 overflow-hidden">
					{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
						<div key={i} className={itemClass}>
							<LibraryPreviewCardSkeleton />
						</div>
					))}
				</div>
			) : items.length > 0 ? (
				<HorizontalScrollRow>
					{items.map(item => (
						<div key={item.id} className={itemClass}>
							<LibraryPreviewCard item={item} lang={lang} />
						</div>
					))}
				</HorizontalScrollRow>
			) : (
				<LibraryPreviewEmpty />
			)}
		</section>
	);
};
