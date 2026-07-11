"use client";

import { useGenres } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { FilterSelect } from "@/shared/ui/filter-select";
import { useRef } from "react";

interface LibraryFilterBarGenreSelectProps {
	genreId: string | null;
	onGenreChange: (genreId: string | null) => void;
}

export const LibraryFilterBarGenreSelect = ({ genreId, onGenreChange }: LibraryFilterBarGenreSelectProps) => {
	const { t } = useI18n();
	const { data: genres } = useGenres();
	// Radix Select can mount with `value={genreId}` already set (e.g. arriving
	// from a genre card link) before its own Select.Item collection has
	// registered, and fires a spurious onValueChange("") on that first pass —
	// clearing a genre filter the user never touched. A real click always goes
	// through the trigger being opened first, so only trust onValueChange once
	// that has happened at least once.
	const hasOpenedRef = useRef(false);
	const handleOpenChange = (open: boolean) => {
		if (open) hasOpenedRef.current = true;
	};

	if (!genres?.length) return null;

	const options = [
		{ value: "", label: t("dashboard.genres.title") },
		...genres.map(g => ({ value: g.id, label: g.name })),
	];

	const handleChange = (v: string) => {
		if (!hasOpenedRef.current) return;
		onGenreChange(v || null);
	};
	return (
		<FilterSelect
			value={genreId ?? ""}
			options={options}
			onChange={handleChange}
			onOpenChange={handleOpenChange}
			aria-label={t("dashboard.genres.title")}
		/>
	);
};
