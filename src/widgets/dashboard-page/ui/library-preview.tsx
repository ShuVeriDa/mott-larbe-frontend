"use client";

import { variants } from "@/shared/lib/animation";
import { motion } from "framer-motion";
import { useLibraryPreview } from "../model";
import { LibraryPreviewCard } from "./library-preview-card";
import { LibraryPreviewEmpty } from "./library-preview-empty";
import { LibraryPreviewFilters } from "./library-preview-filters";
import { LibraryPreviewHeader } from "./library-preview-header";

export interface LibraryPreviewProps {
	lang: string;
}

const SKELETON_COUNT = 6;

const listClass =
	"flex gap-2 max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-1 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden md:flex-wrap";

const itemClass =
	"w-[140px] shrink-0 max-md:snap-start md:w-[168px] lg:w-[224px]";

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
				<div className={listClass}>
					{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
						<div
							key={i}
							className={`${itemClass} animate-pulse rounded-card bg-surf-2 h-[260px] md:h-[300px] lg:h-[380px]`}
						/>
					))}
				</div>
			) : items.length > 0 ? (
				<motion.div
					className={listClass}
					variants={variants.staggerContainer}
					initial="hidden"
					animate="visible"
				>
					{items.map(item => (
						<motion.div key={item.id} className={itemClass} variants={variants.staggerItem}>
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
