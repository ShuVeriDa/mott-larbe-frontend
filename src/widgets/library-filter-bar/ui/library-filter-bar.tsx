"use client";

import { useLibraryFilters } from "@/features/library-filters";
import { useI18n } from "@/shared/lib/i18n";
import { LibraryFilterBarLangGroup } from "./library-filter-bar-lang-group";
import { LibraryFilterBarLevelGroup } from "./library-filter-bar-level-group";
import { LibraryFilterBarProgressGroup } from "./library-filter-bar-progress-group";
import { LibraryFilterBarSortSelect } from "./library-filter-bar-sort-select";
import { LibraryFilterDivider } from "./library-filter-divider";
import { LibraryFilterViewToggle } from "./library-filter-view-toggle";

export const LibraryFilterBar = () => {
	const { t } = useI18n();
	const {
		level,
		lang,
		status,
		sort,
		view,
		setLevel,
		setLang,
		setStatus,
		setSort,
		setView,
	} = useLibraryFilters();

	return (
		<div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-bd-1 bg-surf px-5 py-2 [scrollbar-width:none] max-sm:px-3 max-sm:gap-1 [&::-webkit-scrollbar]:hidden">
			<LibraryFilterBarLevelGroup level={level} onLevelChange={setLevel} />

			<LibraryFilterDivider />

			<LibraryFilterBarLangGroup lang={lang} onLangChange={setLang} />

			<LibraryFilterDivider />

			<LibraryFilterBarProgressGroup status={status} onStatusChange={setStatus} />

			<LibraryFilterDivider />

			<LibraryFilterBarSortSelect sort={sort} onSortChange={setSort} />

			<LibraryFilterDivider />

			<LibraryFilterViewToggle view={view} onViewChange={setView} t={t} />
		</div>
	);
};
