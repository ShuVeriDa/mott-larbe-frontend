"use client";

import { useLibraryPreview } from "../model";
import { LibraryPreviewCard } from "./library-preview-card";
import { LibraryPreviewEmpty } from "./library-preview-empty";
import { LibraryPreviewFilters } from "./library-preview-filters";
import { LibraryPreviewHeader } from "./library-preview-header";

export interface LibraryPreviewProps {
	lang: string;
}

export const LibraryPreview = ({ lang }: LibraryPreviewProps) => {
	const {
		filterLang,
		filterLevel,
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

			{items.length > 0 ? (
				<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
					{items.map(item => (
						<LibraryPreviewCard key={item.id} item={item} lang={lang} />
					))}
				</div>
			) : (
				<LibraryPreviewEmpty />
			)}
		</section>
	);
};
