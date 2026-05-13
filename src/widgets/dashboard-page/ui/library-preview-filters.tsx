"use client";

import type { LibraryTextLanguage } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { LANG_TAG } from "@/shared/lib/lang-tag/lang-tag";
import type { CefrLevel } from "@/shared/types";
import { LibraryPreviewFilterButton } from "./library-preview-filter-button";

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

	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
			<div className="flex items-center gap-[3px]">
				<LibraryPreviewFilterButton
					active={filterLang === undefined}
					onClick={onResetLanguageFilter}
				>
					{t("dashboard.library.langAll")}
				</LibraryPreviewFilterButton>
				{langFilters.slice(0, 1).map(languageFilter => {
					const handleLanguageClick = () => {
						onLanguageFilterToggle(languageFilter);
					};
					return (
						<LibraryPreviewFilterButton
							key={languageFilter}
							active={filterLang === languageFilter}
							onClick={handleLanguageClick}
						>
							{LANG_TAG[languageFilter]}
						</LibraryPreviewFilterButton>
					);
				})}
			</div>

			<div className="h-3 w-px bg-bd-2" />

			<div className="flex items-center gap-[3px]">
				<LibraryPreviewFilterButton
					active={filterLevel === undefined}
					onClick={onResetLevelFilter}
				>
					{t("dashboard.library.levelAll")}
				</LibraryPreviewFilterButton>
				{levelFilters.map(levelFilter => {
					const handleLevelClick = () => {
						onLevelFilterToggle(levelFilter);
					};
					return (
						<LibraryPreviewFilterButton
							key={levelFilter}
							active={filterLevel === levelFilter}
							onClick={handleLevelClick}
						>
							{t(`shared.cefrLevel.${levelFilter}`)}
						</LibraryPreviewFilterButton>
					);
				})}
			</div>
		</div>
	);
};
