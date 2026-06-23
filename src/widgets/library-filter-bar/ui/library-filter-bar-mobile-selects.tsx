"use client";

import type {
	LibraryProgressStatus,
	LibraryTextLanguage,
} from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import {
	LIBRARY_FILTER_BAR_CEFR_LEVELS,
	LIBRARY_FILTER_BAR_PROGRESS_STATUSES,
	libraryFilterProgressLabelKey,
} from "../lib/library-filter-bar-config";
import { ENABLED_LANGUAGES } from "@/shared/lib/languages";
import { FilterSelect } from "@/shared/ui/filter-select";

interface LevelSelectProps {
	level: CefrLevel | "all";
	onLevelChange: (v: CefrLevel | "all") => void;
}

export const LibraryFilterBarLevelSelect = ({ level, onLevelChange }: LevelSelectProps) => {
	const { t } = useI18n();
	const options = [
		{ value: "all", label: t("library.filterLevel") },
		...LIBRARY_FILTER_BAR_CEFR_LEVELS.map(l => ({ value: l, label: t(`shared.cefrLevel.${l}`) })),
	];
	const handleChange = (v: string) => onLevelChange(v as CefrLevel | "all");
	return (
		<FilterSelect
			value={level}
			options={options}
			onChange={handleChange}
			aria-label={t("library.filterLevel")}
		/>
	);
};

interface LangSelectProps {
	lang: LibraryTextLanguage | "all";
	onLangChange: (v: LibraryTextLanguage | "all") => void;
}

export const LibraryFilterBarLangSelect = ({ lang, onLangChange }: LangSelectProps) => {
	const { t } = useI18n();
	const options = [
		{ value: "all", label: t("library.filterLang") },
		...ENABLED_LANGUAGES.map(l => ({ value: l.code as LibraryTextLanguage | "all", label: t(`shared.lang.${l.code}`) })),
	];
	const handleLangChange = (v: string) => onLangChange(v as LibraryTextLanguage | "all");
	return (
		<FilterSelect
			value={lang}
			options={options}
			onChange={handleLangChange}
			aria-label={t("library.filterLang")}
		/>
	);
};

interface ProgressSelectProps {
	status: LibraryProgressStatus | "all";
	onStatusChange: (v: LibraryProgressStatus | "all") => void;
}

export const LibraryFilterBarProgressSelect = ({ status, onStatusChange }: ProgressSelectProps) => {
	const { t } = useI18n();
	const options = [
		{ value: "all", label: t("library.filterProgress") },
		...LIBRARY_FILTER_BAR_PROGRESS_STATUSES.map(s => ({ value: s, label: t(libraryFilterProgressLabelKey(s)) })),
	];
	const handleStatusChange = (v: string) => onStatusChange(v as LibraryProgressStatus | "all");
	return (
		<FilterSelect
			value={status}
			options={options}
			onChange={handleStatusChange}
			aria-label={t("library.filterProgress")}
		/>
	);
};
