"use client";

import type { DashboardContinueItem } from "@/entities/dashboard";
import type { LibraryTextListItem } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { HorizontalScrollRow } from "./horizontal-scroll-row";
import { LibraryPreviewCard } from "./library-preview-card";

interface ContinueReadingProps {
	items: DashboardContinueItem[];
	lang: string;
}

const toListItem = (item: DashboardContinueItem): LibraryTextListItem => ({
	id: item.id,
	title: item.title,
	description: null,
	language: item.language as LibraryTextListItem["language"],
	level: item.level as LibraryTextListItem["level"],
	author: item.author,
	imageUrl: item.imageUrl,
	tags: item.tags,
	wordCount: item.totalPages,
	readingTime: 0,
	progressPercent: item.progressPercent,
	progressStatus: "IN_PROGRESS",
	lastOpened: item.lastOpened,
	isNew: false,
	isFavorite: false,
});

export const ContinueReading = ({ items, lang }: ContinueReadingProps) => {
	const { t } = useI18n();

	if (items.length === 0) return null;

	return (
		<section>
			<div className="mb-2.5 flex items-center justify-between">
				<Typography tag="h2" className="text-[13px] font-semibold text-t-1">
					{t("dashboard.continueReading.title")}
				</Typography>
				<Link
					href={`/${lang}/texts?status=IN_PROGRESS`}
					className="rounded-sm text-[11.5px] text-acc outline-none transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
				>
					{t("dashboard.continueReading.viewAll")}
				</Link>
			</div>

			<HorizontalScrollRow>
				{items.slice(0, 6).map(item => (
					<div
						key={item.id}
						className="w-[136px] shrink-0 md:w-[148px] lg:w-[168px] xl:w-[196px]"
					>
						<LibraryPreviewCard
							item={toListItem(item)}
							lang={lang}
							href={`/${lang}/reader/${item.id}/p/${item.lastPageNumber}`}
						/>
					</div>
				))}
			</HorizontalScrollRow>
		</section>
	);
};
