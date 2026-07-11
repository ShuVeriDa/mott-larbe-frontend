"use client";

import { useLibraryFilters } from "@/features/library-filters";
import { useI18n } from "@/shared/lib/i18n";
import { FilterX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LibraryFilterBarGenreSelect } from "./library-filter-bar-genre-select";
import { LibraryFilterBarLangGroup } from "./library-filter-bar-lang-group";
import { LibraryFilterBarLevelGroup } from "./library-filter-bar-level-group";
import {
	LibraryFilterBarLangSelect,
	LibraryFilterBarLevelSelect,
	LibraryFilterBarProgressSelect,
} from "./library-filter-bar-mobile-selects";
import { LibraryFilterBarProgressGroup } from "./library-filter-bar-progress-group";
import { LibraryFilterBarSortSelect } from "./library-filter-bar-sort-select";
import { LibraryFilterDivider } from "./library-filter-divider";
import { LibraryFilterViewToggle } from "./library-filter-view-toggle";

interface LibraryFilterBarProps {
	mobileHideSortView?: boolean;
}

export const LibraryFilterBar = ({
	mobileHideSortView,
}: LibraryFilterBarProps) => {
	const { t } = useI18n();
	const {
		level,
		lang,
		status,
		sort,
		view,
		genreId,
		search,
		setLevel,
		setLang,
		setStatus,
		setSort,
		setView,
		setGenreId,
		resetFilters,
	} = useLibraryFilters();

	const containerRef = useRef<HTMLDivElement>(null);
	const [usePills, setUsePills] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const check = () => {
			setUsePills(el.clientWidth >= 1200);
			setIsDesktop(el.clientWidth >= 640);
		};
		check();
		const ro = new ResizeObserver(check);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const isFiltered =
		level !== "all" ||
		lang !== "all" ||
		status !== "all" ||
		sort !== "newest" ||
		genreId !== null ||
		search !== "";

	return (
		<nav
			ref={containerRef}
			className="border-b border-bd-1 bg-surf"
			aria-label={t("library.filtersLabel")}
		>
			<div className="flex shrink-0 items-center gap-1 overflow-x-auto px-3 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				{usePills ? (
					<>
						<LibraryFilterBarLevelGroup
							level={level}
							onLevelChange={setLevel}
						/>
						<LibraryFilterDivider />
						<LibraryFilterBarLangGroup lang={lang} onLangChange={setLang} />
						<LibraryFilterDivider />
						<LibraryFilterBarProgressGroup
							status={status}
							onStatusChange={setStatus}
						/>
						<LibraryFilterDivider />
					</>
				) : (
					<>
						<LibraryFilterBarLevelSelect
							level={level}
							onLevelChange={setLevel}
						/>
						<LibraryFilterBarLangSelect lang={lang} onLangChange={setLang} />
						<LibraryFilterBarProgressSelect
							status={status}
							onStatusChange={setStatus}
						/>
					</>
				)}

				<LibraryFilterBarGenreSelect
					genreId={genreId}
					onGenreChange={setGenreId}
				/>

				{(!mobileHideSortView || isDesktop) && (
					<>
						<LibraryFilterDivider />
						<LibraryFilterBarSortSelect sort={sort} onSortChange={setSort} />
						<LibraryFilterDivider />
						<LibraryFilterViewToggle view={view} onViewChange={setView} t={t} />
					</>
				)}

				{isFiltered && (
					<>
						<LibraryFilterDivider />
						<button
							type="button"
							onClick={resetFilters}
							title={t("library.resetFilters")}
							aria-label={t("library.resetFilters")}
							className="flex h-[22px] shrink-0 items-center gap-1 rounded-[5px] border border-red/30 bg-red-bg px-1.5 text-[10px] text-red-t transition-colors hover:border-red/50 hover:bg-red/10 sm:h-[26px] sm:px-2 sm:text-[11px]"
						>
							<FilterX className="size-3 shrink-0" strokeWidth={2} />
							<span className="hidden sm:inline">
								{t("library.resetFilters")}
							</span>
						</button>
					</>
				)}
			</div>
		</nav>
	);
};
