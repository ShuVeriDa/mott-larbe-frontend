"use client";

import type { LibraryTextLanguage } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { FilterGroup } from "@/shared/ui/filter-group";

export interface LibraryPreviewFiltersProps {
	filterLang: LibraryTextLanguage | undefined;
	filterLevel: CefrLevel | undefined;
	langFilters: readonly LibraryTextLanguage[];
	levelFilters: readonly CefrLevel[];
	onResetLanguageFilter: () => void;
	onResetLevelFilter: () => void;
	onLanguageFilterToggle: (value: LibraryTextLanguage) => void;
	onLevelFilterToggle: (value: CefrLevel) => void;
}

export const LibraryPreviewFilters = ({
	filterLang,
	filterLevel,
	langFilters,
	levelFilters,
	onResetLanguageFilter,
	onResetLevelFilter,
	onLanguageFilterToggle,
	onLevelFilterToggle,
}: LibraryPreviewFiltersProps) => {
	const { t } = useI18n();

	const langOptions: { value: LibraryTextLanguage | undefined; label: string }[] = [
		{ value: undefined, label: t("dashboard.library.langAll") },
		...langFilters.slice(0, 1).map(l => ({ value: l, label: t(`shared.lang.${l}`) })),
	];

	const levelOptions: { value: CefrLevel | undefined; label: string }[] = [
		{ value: undefined, label: t("dashboard.library.levelAll") },
		...levelFilters.map(l => ({ value: l, label: t(`shared.cefrLevel.${l}`) })),
	];

	const handleLangChange = (value: LibraryTextLanguage | undefined) => {
		if (value === undefined) onResetLanguageFilter();
		else onLanguageFilterToggle(value);
	};

	const handleLevelChange = (value: CefrLevel | undefined) => {
		if (value === undefined) onResetLevelFilter();
		else onLevelFilterToggle(value);
	};

	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
			<FilterGroup
				options={langOptions}
				value={filterLang}
				onValueChange={handleLangChange}
			/>
			<div className="h-3 w-px bg-bd-2" />
			<FilterGroup
				options={levelOptions}
				value={filterLevel}
				onValueChange={handleLevelChange}
			/>
		</div>
	);
};
