"use client";

import { useGenres } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { FilterGroup } from "@/shared/ui/filter-group";

interface LibraryFilterBarGenreGroupProps {
	genreId: string | null;
	onGenreChange: (genreId: string | null) => void;
}

export const LibraryFilterBarGenreGroup = ({
	genreId,
	onGenreChange,
}: LibraryFilterBarGenreGroupProps) => {
	const { t } = useI18n();
	const { data: genres } = useGenres();

	if (!genres?.length) return null;

	const options: { value: string | null; label: string }[] = [
		{ value: null, label: t("library.all") },
		...genres.map(genre => ({ value: genre.id, label: genre.name })),
	];

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("dashboard.genres.title")}
			</Typography>
			<FilterGroup
				options={options}
				value={genreId}
				onValueChange={onGenreChange}
			/>
		</>
	);
};
