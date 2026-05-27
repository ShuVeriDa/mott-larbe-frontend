"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
	usePhrasebookCategories,
	usePhraseCategoryProgress,
	type PhrasebookCategory,
	type PhraseCategoryProgress,
} from "@/entities/phrasebook";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Skeleton } from "@/shared/ui/skeleton";

export const PhrasebookCategorySidebar = () => {
	const { t } = useI18n();
	const { data: categories, isLoading } = usePhrasebookCategories();
	const { data: progressList } = usePhraseCategoryProgress();
	const { activeCategoryId, setActiveCategoryId } = usePhrasebookFilters();

	const progressMap = new Map<string, PhraseCategoryProgress>(
		progressList?.map(p => [p.id, p]) ?? [],
	);

	return (
		<div className="w-[200px] shrink-0 bg-surf border-[0.5px] border-bd-1 rounded-card overflow-hidden flex flex-col">
			<div className="px-3 py-2.5 border-b border-bd-1 text-[10px] font-semibold text-t-3 uppercase tracking-[0.6px]">
				{t("phrasebook.categories.title")}
			</div>
			<div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden">
				{isLoading
					? Array.from({ length: 6 }, (_, i) => (
							<div key={i} className="flex items-center gap-2 px-3 py-2">
								<Skeleton className="w-4 h-4 rounded" />
								<Skeleton className="flex-1 h-3 rounded" />
							</div>
						))
					: categories?.map(cat => (
							<CategoryItem
								key={cat.id}
								category={cat}
								progress={progressMap.get(cat.id)}
								active={activeCategoryId === cat.id}
								onSelect={setActiveCategoryId}
							/>
						))}
			</div>
		</div>
	);
};

interface CategoryItemProps {
	category: PhrasebookCategory;
	progress: PhraseCategoryProgress | undefined;
	active: boolean;
	onSelect: (id: string | null) => void;
}

const CategoryItem = ({ category, progress, active, onSelect }: CategoryItemProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();
	const lang = params.lang ?? "ru";

	const handleClick = () => onSelect(active ? null : category.id);

	const pct = progress?.progressPercent ?? 0;
	const hasProgress = pct > 0;

	return (
		<div className="relative">
			<button
				type="button"
				onClick={handleClick}
				className={cn(
					"flex items-center gap-2 px-3 py-[7.5px] w-full text-left",
					"text-[12.5px] font-[inherit] cursor-pointer border-none",
					"transition-colors duration-100 relative",
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
							className="h-full rounded-full bg-grn transition-[width] duration-300"
							style={{ width: `${pct}%` }}
						/>
					</div>
					<Link
						href={`/${lang}/review?system=phrases&category=${category.id}`}
						className="shrink-0 text-[10.5px] font-medium text-acc hover:text-acc/80 transition-colors"
						onClick={(e) => e.stopPropagation()}
					>
						{t("phrasebook.categories.review")}
					</Link>
				</div>
			) : null}
		</div>
	);
};
