"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import { HorizontalScrollRow } from "./horizontal-scroll-row";
import {
	LibraryPreviewCard,
	LibraryPreviewCardSkeleton,
} from "./library-preview-card";
import { SectionHeader } from "./section-header";

const SKELETON_COUNT = 5;

interface TextsRowSectionProps {
	title: string;
	viewAllHref: string;
	viewAllLabel: string;
	items: LibraryTextListItem[];
	isPending: boolean;
	lang: string;
}

export const TextsRowSection = ({
	title,
	viewAllHref,
	viewAllLabel,
	items,
	isPending,
	lang,
}: TextsRowSectionProps) => {
	if (!isPending && items.length === 0) return null;

	return (
		<section className="flex flex-col gap-3">
			<SectionHeader
				title={title}
				href={viewAllHref}
				linkLabel={viewAllLabel}
			/>

			{isPending ? (
				<div className="flex gap-3 overflow-hidden">
					{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
						<div
							key={i}
							className="w-[120px] shrink-0 md:w-[148px] lg:w-[168px] xl:w-[196px]"
						>
							<LibraryPreviewCardSkeleton />
						</div>
					))}
				</div>
			) : (
				<HorizontalScrollRow>
					{items.map(item => (
						<div
							key={item.id}
							className="w-[120px] shrink-0 md:w-[148px] lg:w-[168px] xl:w-[196px]"
						>
							<LibraryPreviewCard item={item} lang={lang} />
						</div>
					))}
				</HorizontalScrollRow>
			)}
		</section>
	);
};
