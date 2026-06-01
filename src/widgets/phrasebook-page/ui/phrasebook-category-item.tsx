"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MouseEvent } from "react";
import type {
	PhrasebookCategory,
	PhraseCategoryProgress,
} from "@/entities/phrasebook";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

export interface PhrasebookCategoryItemProps {
	category: PhrasebookCategory;
	progress: PhraseCategoryProgress | undefined;
	active: boolean;
	onSelect: (id: string | null) => void;
}

export const PhrasebookCategoryItem = ({
	category,
	progress,
	active,
	onSelect,
}: PhrasebookCategoryItemProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();
	const lang = params.lang ?? "ru";

	const handleClick = () => onSelect(active ? null : category.id);

	const handleReviewClick = (e: MouseEvent) => e.stopPropagation();

	const pct = progress?.progressPercent ?? 0;
	const hasProgress = pct > 0;

	return (
		<div className="relative">
			<button
				type="button"
				onClick={handleClick}
				className={cn(
					"flex items-center gap-2 px-3 py-[11px] w-full text-left",
					"text-[12.5px] font-[inherit] cursor-pointer border-none",
					"transition-colors duration-100 motion-reduce:transition-none relative",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-acc",
					active
						? "bg-acc-bg text-acc-t"
						: "bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1",
				)}
			>
				{active && (
					<span className="absolute left-0 top-1 bottom-1 w-0.5 bg-acc rounded-r-sm" />
				)}
				<span className="text-[14px] shrink-0 leading-none">
					{category.emoji}
				</span>
				<span className="flex-1 min-w-0 truncate">{category.name}</span>
				<span
					className={cn(
						"text-[11px] font-medium",
						active ? "text-acc-t/70" : "text-t-3",
					)}
				>
					{category.phraseCount}
				</span>
			</button>

			{hasProgress ? (
				<div className="mx-3 mb-1.5 -mt-0.5 flex items-center gap-1.5">
					<div className="h-0.5 flex-1 overflow-hidden rounded-full bg-surf-3">
						<div
							className="h-full w-full rounded-full bg-grn origin-left transition-transform duration-300 motion-reduce:transition-none"
							style={{ transform: `scaleX(${pct / 100})` }}
						/>
					</div>
					<Link
						href={`/${lang}/review?system=phrases&category=${category.id}`}
						className="shrink-0 text-[10.5px] font-medium text-acc hover:text-acc/80 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-1 rounded-sm"
						onClick={handleReviewClick}
					>
						{t("phrasebook.categories.review")}
					</Link>
				</div>
			) : null}
		</div>
	);
};
