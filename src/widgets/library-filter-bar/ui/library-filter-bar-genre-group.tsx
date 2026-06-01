"use client";

import { useGenres } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	LIBRARY_FILTER_ACC_PILL_ACTIVE,
	LIBRARY_FILTER_ACC_PILL_IDLE,
} from "../lib/library-filter-bar-config";
import { LibraryFilterPill } from "./library-filter-pill";

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

	const handleAllClick = () => onGenreChange(null);

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("dashboard.genres.title")}
			</Typography>

			<LibraryFilterPill
				active={genreId === null}
				onClick={handleAllClick}
				title={t("library.all")}
				className={genreId === null ? LIBRARY_FILTER_ACC_PILL_ACTIVE : LIBRARY_FILTER_ACC_PILL_IDLE}
			>
				{t("library.all")}
			</LibraryFilterPill>

			{genres.map((genre) => {
				const handleClick = () => onGenreChange(genre.id);
				return (
					<LibraryFilterPill
						key={genre.id}
						active={genreId === genre.id}
						onClick={handleClick}
						title={genre.name}
						className={genreId === genre.id ? LIBRARY_FILTER_ACC_PILL_ACTIVE : LIBRARY_FILTER_ACC_PILL_IDLE}
					>
						{genre.name}
					</LibraryFilterPill>
				);
			})}
		</>
	);
};
