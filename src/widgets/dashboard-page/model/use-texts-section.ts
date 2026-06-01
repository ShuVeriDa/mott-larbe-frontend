"use client";

import { useLibraryTexts } from "@/entities/library-text";
import type { CefrLevel } from "@/shared/types";

const SECTION_LIMIT = 10;

export const useRecentTextsSection = () => {
	const { data, isPending } = useLibraryTexts({
		orderBy: "newest",
		limit: SECTION_LIMIT,
	});
	return { items: data?.items ?? [], isPending };
};

export const useByLevelTextsSection = (level: CefrLevel) => {
	const { data, isPending } = useLibraryTexts({
		orderBy: "newest",
		level: [level],
		limit: SECTION_LIMIT,
	});
	return { items: data?.items ?? [], isPending };
};

export const useShortTextsSection = () => {
	const { data, isPending } = useLibraryTexts({
		orderBy: "length",
		limit: SECTION_LIMIT,
	});

	const shortItems = (data?.items ?? []).filter((item) => item.wordCount <= 400);

	return { items: shortItems, isPending };
};
