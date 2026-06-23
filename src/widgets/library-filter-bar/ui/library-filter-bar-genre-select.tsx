"use client";

import { useGenres } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { FilterSelect } from "@/shared/ui/filter-select";

interface LibraryFilterBarGenreSelectProps {
	genreId: string | null;
	onGenreChange: (genreId: string | null) => void;
}

export const LibraryFilterBarGenreSelect = ({ genreId, onGenreChange }: LibraryFilterBarGenreSelectProps) => {
	const { t } = useI18n();
	const { data: genres } = useGenres();

	if (!genres?.length) return null;

	const options = [
		{ value: "", label: t("dashboard.genres.title") },
		...genres.map(g => ({ value: g.id, label: g.name })),
	];

	const handleChange = (v: string) => onGenreChange(v || null);
	return (
		<FilterSelect
			value={genreId ?? ""}
			options={options}
			onChange={handleChange}
			aria-label={t("dashboard.genres.title")}
		/>
	);
};
