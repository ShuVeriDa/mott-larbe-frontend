"use client";

import { useLibraryFilters } from "@/features/library-filters";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { SearchBox } from "@/shared/ui/search-box";
import { Typography } from "@/shared/ui/typography";
import { ChangeEvent } from "react";

interface LibraryTopbarProps {
	totalCount: number;
	onRefresh: () => void;
}

export const LibraryTopbar = ({
	totalCount,
	onRefresh,
}: LibraryTopbarProps) => {
	const { t } = useI18n();
	const { search, setSearch } = useLibraryFilters();

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.currentTarget.value);
	};

	return (
		<header>
			<div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 max-sm:px-3">
				<Typography
					tag="span"
					className="font-display text-sm font-medium tracking-[-0.1px] text-t-1"
				>
					{t("library.title")}
				</Typography>
				<Typography tag="span" className="hidden text-xs text-t-3 sm:block">
					{t("library.total", { count: String(totalCount) })}
				</Typography>

				<div className="flex-1" />

				<SearchBox
					value={search}
					onChange={handleSearch}
					placeholder={t("library.searchPlaceholder")}
					wrapperClassName="hidden sm:flex w-[200px] focus-within:w-[240px] transition-[width] duration-150"
					className="text-xs"
				/>

				<Button
					size={"bare"}
					onClick={onRefresh}
					aria-label={t("library.refresh")}
					className=" h-[30px] w-[30px] shrink-0 items-center justify-center rounded-base border border-bd-2 bg-transparent text-t-2 transition-colors duration-100 hover:bg-surf-2 hover:text-t-1 sm:flex"
				>
					<RefreshIcon />
				</Button>
			</div>

			<div className="flex shrink-0 border-b border-bd-1 bg-surf px-3 py-2 sm:hidden">
				<SearchBox
					value={search}
					onChange={handleSearch}
					placeholder={t("library.searchMobilePlaceholder")}
					wrapperClassName="w-full h-9"
					className="text-[13px]"
				/>
			</div>
		</header>
	);
};

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
