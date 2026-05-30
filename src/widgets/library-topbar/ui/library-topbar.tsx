"use client";

import type { LibraryTextCounts } from "@/entities/library-text";
import { useLibraryFilters } from "@/features/library-filters";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { SearchBox } from "@/shared/ui/search-box";
import { Typography } from "@/shared/ui/typography";
import { LibraryFilterBar } from "@/widgets/library-filter-bar";
import { ChangeEvent, useRef, useState } from "react";

interface LibraryTopbarProps {
	counts: LibraryTextCounts;
	onRefresh: () => void;
	title?: string;
}

export const LibraryTopbar = ({
	counts,
	onRefresh,
	title,
}: LibraryTopbarProps) => {
	const { t } = useI18n();
	const { search, setSearch } = useLibraryFilters();

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
			<div className="flex shrink-0 items-center gap-2.5 border-b-[0.5px] border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
				<Typography
					tag="h1"
					className="shrink-0 text-[13.5px] font-semibold text-t-1 max-md:text-[15px]"
				>
					{title ?? t("library.title")}
				</Typography>

				<div className="hidden items-center gap-3 sm:flex">
					<StatDot className="bg-t-3" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">{counts.total}</Typography>
						&nbsp;{t("library.stats.total")}
					</Typography>
					<StatDot className="bg-grn" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">{counts.completed}</Typography>
						&nbsp;{t("library.stats.done")}
					</Typography>
					<StatDot className="bg-acc" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">{counts.inProgress}</Typography>
						&nbsp;{t("library.stats.reading")}
					</Typography>
					<StatDot className="bg-t-4" />
					<Typography tag="span" className="text-[11px] text-t-3">
						<Typography tag="span" className="font-semibold text-t-2">{counts.new}</Typography>
						&nbsp;{t("library.stats.new")}
					</Typography>
				</div>

				<div className="flex-1" />

				<SearchBox
					value={inputValue}
					onChange={handleSearch}
					placeholder={t("library.searchPlaceholder")}
					wrapperClassName="hidden sm:flex w-[200px] focus-within:w-[240px] transition-[width] duration-150"
					className="text-xs"
				/>

				<Button
					size={"bare"}
					onClick={onRefresh}
					aria-label={t("library.refresh")}
					title={t("library.refresh")}
					className=" h-[30px] w-[30px] shrink-0 items-center justify-center rounded-base border border-bd-2 bg-transparent text-t-2 transition-colors duration-100 hover:bg-surf-2 hover:text-t-1 sm:flex"
				>
					<RefreshIcon />
				</Button>
			</div>

			<div className="flex shrink-0 border-b border-bd-1 bg-surf px-3 py-2 sm:hidden">
				<SearchBox
					value={inputValue}
					onChange={handleSearch}
					placeholder={t("library.searchMobilePlaceholder")}
					wrapperClassName="w-full h-9"
					className="text-[13px]"
				/>
			</div>
			<LibraryFilterBar />
		</div>
	);
};

const StatDot = ({ className }: { className: string }) => (
	<span className={`size-1.5 shrink-0 rounded-full ${className}`} />
);

const RefreshIcon = () => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 13 13"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.4"
	>
		<path d="M11 6.5A4.5 4.5 0 106.5 11" strokeLinecap="round" />
		<path d="M9 9l2.5 2-.5-2.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
