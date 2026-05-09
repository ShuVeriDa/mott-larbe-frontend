"use client";

import { useState } from "react";
import {
	type LibraryTextLanguage,
	useLibraryTexts,
} from "@/entities/library-text";
import type { CefrLevel } from "@/shared/types";

const LANG_FILTERS: LibraryTextLanguage[] = ["CHE", "RU", "EN"];
const LEVEL_FILTERS: CefrLevel[] = ["A1", "A2", "B1", "B2"];

export const useLibraryPreview = (lang: string) => {
	const [filterLang, setFilterLang] = useState<LibraryTextLanguage | undefined>();
	const [filterLevel, setFilterLevel] = useState<CefrLevel | undefined>();

	const { data: library } = useLibraryTexts({
		orderBy: "newest",
		limit: 6,
		language: filterLang ? [filterLang] : undefined,
		level: filterLevel ? [filterLevel] : undefined,
	});

	const items = library?.items ?? [];

	const params = new URLSearchParams();
	if (filterLang) params.set("language", filterLang);
	if (filterLevel) params.set("level", filterLevel);
	const queryString = params.toString();
	const viewAllHref = `/${lang}/texts${queryString ? `?${queryString}` : ""}`;

	const handleResetLanguageFilter = () => setFilterLang(undefined);
	const handleResetLevelFilter = () => setFilterLevel(undefined);

	const handleLanguageFilterToggle = (value: LibraryTextLanguage) => {
		setFilterLang((current) => (current === value ? undefined : value));
	};

	const handleLevelFilterToggle = (value: CefrLevel) => {
		setFilterLevel((current) => (current === value ? undefined : value));
	};

	return {
		filterLang,
		filterLevel,
		items,
		viewAllHref,
		langFilters: LANG_FILTERS,
		levelFilters: LEVEL_FILTERS,
		handleResetLanguageFilter,
		handleResetLevelFilter,
		handleLanguageFilterToggle,
		handleLevelFilterToggle,
	};
};
