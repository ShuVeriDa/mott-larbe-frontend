"use client";

import type {
	LibraryProgressStatus,
	LibraryTextLanguage,
} from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import {
	LIBRARY_FILTER_BAR_CEFR_LEVELS,
	LIBRARY_FILTER_BAR_LANG_OPTIONS,
	LIBRARY_FILTER_BAR_PROGRESS_STATUSES,
	libraryFilterProgressLabelKey,
} from "../lib/library-filter-bar-config";
import { FilterSelect } from "./filter-select";

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
	return (
		<FilterSelect
			value={level}
			options={options}
			onChange={v => onLevelChange(v as CefrLevel | "all")}
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
		...LIBRARY_FILTER_BAR_LANG_OPTIONS.map(l => ({ value: l, label: t(`library.lang.${l}`) })),
	];
	return (
		<FilterSelect
			value={lang}
			options={options}
			onChange={v => onLangChange(v as LibraryTextLanguage | "all")}
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
	return (
		<FilterSelect
			value={status}
			options={options}
			onChange={v => onStatusChange(v as LibraryProgressStatus | "all")}
		/>
	);
};
