"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { HorizontalScrollRow } from "./horizontal-scroll-row";
import {
	LibraryPreviewCard,
	LibraryPreviewCardSkeleton,
} from "./library-preview-card";
import { SectionHeader } from "./section-header";

interface ByLevelSectionProps {
	level: CefrLevel;
	items: LibraryTextListItem[];
	isPending: boolean;
	lang: string;
}

const SKELETON_COUNT = 5;

export const ByLevelSection = ({
	level,
	items,
	isPending,
	lang,
}: ByLevelSectionProps) => {
	const { t } = useI18n();

	if (!isPending && items.length === 0) return null;

	const levelLabel = t(`shared.cefrLevel.${level}`);
	const title = t("dashboard.byLevel.title", { level: levelLabel });
	const viewAllLabel = t("dashboard.viewAll");
	const viewAllHref = `/${lang}/texts?level=${level}`;

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
							className="w-[136px] shrink-0 md:w-[148px] lg:w-[168px] xl:w-[196px]"
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
							className="w-[136px] shrink-0 md:w-[148px] lg:w-[168px] xl:w-[196px]"
						>
							<LibraryPreviewCard item={item} lang={lang} />
						</div>
					))}
				</HorizontalScrollRow>
			)}
		</section>
	);
};
