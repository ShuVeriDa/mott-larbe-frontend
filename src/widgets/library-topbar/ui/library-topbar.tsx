"use client";

import type { LibraryTextCounts } from "@/entities/library-text";
import { useLibraryFilters } from "@/features/library-filters";
import { useI18n } from "@/shared/lib/i18n";
import { SearchBox } from "@/shared/ui/search-box";
import { Typography } from "@/shared/ui/typography";
import { LibraryFilterBar } from "@/widgets/library-filter-bar";
import { LibraryFilterBarSortSelect } from "@/widgets/library-filter-bar/ui/library-filter-bar-sort-select";
import { LibraryFilterViewToggle } from "@/widgets/library-filter-bar/ui/library-filter-view-toggle";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

interface LibraryTopbarProps {
	counts: LibraryTextCounts;
	title?: string;
}

export const LibraryTopbar = ({ counts, title }: LibraryTopbarProps) => {
	const { t } = useI18n();
	const { search, setSearch, sort, setSort, view, setView } = useLibraryFilters();

	const [inputValue, setInputValue] = useState(search);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.currentTarget.value;
		setInputValue(value);
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setSearch(value), 400);
	};

	return (
		<div>
			{/* Desktop title row */}
			<div className="flex shrink-0 items-center gap-2.5 border-b-[0.5px] border-bd-1 bg-white px-[22px] py-3 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
				<Typography
					tag="h1"
					className="shrink-0 text-[13.5px] font-semibold text-t-1 max-md:text-[15px]"
				>
					{title ?? t("library.title")}
				</Typography>

				<div className="hidden items-center gap-3 sm:flex">
					<StatDot className="bg-t-3" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">
							{counts.total}
						</Typography>
						&nbsp;{t("library.stats.total")}
					</Typography>
					<StatDot className="bg-grn" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">
							{counts.completed}
						</Typography>
						&nbsp;{t("library.stats.done")}
					</Typography>
					<StatDot className="bg-acc" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">
							{counts.inProgress}
						</Typography>
						&nbsp;{t("library.stats.reading")}
					</Typography>
					<StatDot className="bg-t-4" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">
							{counts.new}
						</Typography>
						&nbsp;{t("library.stats.new")}
					</Typography>
				</div>

				<div className="flex-1" />

				<SearchBox
					value={inputValue}
					onChange={handleSearch}
					placeholder={t("library.searchPlaceholder")}
					wrapperClassName="hidden sm:flex w-[180px] focus-within:w-[220px] transition-[width] duration-150"
					className="text-xs"
				/>
			</div>

			{/* Mobile row 1: search + sort + view toggle */}
			<div className="flex items-center gap-1.5 border-b border-bd-1 bg-white px-3 py-1.5 sm:hidden">
				<SearchBox
					value={inputValue}
					onChange={handleSearch}
					placeholder={t("library.searchMobilePlaceholder")}
					wrapperClassName="flex-1 h-[26px]"
					className="text-[11px]"
				/>
				<LibraryFilterBarSortSelect sort={sort} onSortChange={setSort} />
				<LibraryFilterViewToggle view={view} onViewChange={setView} t={t} />
			</div>

			{/* Row 2 (mobile) / single row (desktop): remaining filters */}
			<LibraryFilterBar mobileHideSortView />
		</div>
	);
};

const StatDot = ({ className }: { className: string }) => (
	<span className={`size-1.5 shrink-0 rounded-full ${className}`} />
);
