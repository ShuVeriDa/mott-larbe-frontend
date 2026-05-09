"use client";

import { useLibraryFilters } from "@/features/library-filters";
import { useI18n } from "@/shared/lib/i18n";
import { ChangeEvent } from 'react';
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
		<>
			<div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 max-sm:px-3">
				<span className="font-display text-sm font-medium tracking-[-0.1px] text-t-1">
					{t("library.title")}
				</span>
				<span className="hidden text-xs text-t-3 sm:block">
					{t("library.total", { count: String(totalCount) })}
				</span>

				<div className="flex-1" />

				<div className="relative hidden sm:block">
					<span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-t-3">
						<SearchIcon />
					</span>
					<input
						type="text"
						value={search}
						onChange={handleSearch}
						placeholder={t("library.searchPlaceholder")}
						autoComplete="off"
						className="h-[30px] w-[200px] rounded-base border border-bd-2 bg-surf pl-7 pr-2.5 text-xs text-t-1 outline-none placeholder:text-t-3 transition-[border-color,background-color,width] duration-150 focus:w-[240px] focus:border-acc/40 focus:bg-surf-2"
					/>
				</div>

				<button
					type="button"
					onClick={onRefresh}
					aria-label={t("library.refresh")}
					className="hidden h-[30px] w-[30px] shrink-0 items-center justify-center rounded-base border border-bd-2 bg-transparent text-t-2 transition-colors duration-100 hover:bg-surf-2 hover:text-t-1 sm:flex"
				>
					<RefreshIcon />
				</button>
			</div>

			<div className="flex shrink-0 border-b border-bd-1 bg-surf px-3 py-2 sm:hidden">
				<div className="relative w-full">
					<span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-t-3">
						<SearchIcon />
					</span>
					<input
						type="text"
						value={search}
						onChange={handleSearch}
						placeholder={t("library.searchMobilePlaceholder")}
						autoComplete="off"
						className="h-9 w-full rounded-base border border-bd-2 bg-surf pl-8 pr-3 text-[13px] text-t-1 outline-none placeholder:text-t-3 transition-[border-color] duration-150 focus:border-acc/40"
					/>
				</div>
			</div>
		</>
	);
};

const SearchIcon = () => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 13 13"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.4"
	>
		<circle cx="5.5" cy="5.5" r="3.5" />
		<path d="M8.5 8.5l2.5 2.5" />
	</svg>
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
