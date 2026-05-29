"use client";

import { motion } from "framer-motion";
import { variants } from "@/shared/lib/animation";
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
				<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-[178px] animate-pulse rounded-card bg-surf-2" />
					))}
				</div>
			) : items.length > 0 ? (
				<motion.div
					className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1"
					variants={variants.staggerContainer}
					initial="hidden"
					animate="visible"
				>
					{items.map(item => (
						<motion.div key={item.id} variants={variants.staggerItem}>
							<LibraryPreviewCard item={item} lang={lang} />
						</motion.div>
					))}
				</motion.div>
			) : (
				<LibraryPreviewEmpty />
			)}
		</section>
	);
};
