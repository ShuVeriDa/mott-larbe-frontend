"use client";

import type { CefrLevel } from "@/shared/types";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import {
	LIBRARY_FILTER_ACC_PILL_ACTIVE,
	LIBRARY_FILTER_ACC_PILL_IDLE,
	LIBRARY_FILTER_BAR_CEFR_LEVELS,
	libraryFilterLevelPillClass,
} from "../lib/library-filter-bar-config";
import { LibraryFilterPill } from "./library-filter-pill";

export interface LibraryFilterBarLevelGroupProps {
	level: CefrLevel | "all";
	onLevelChange: (value: CefrLevel | "all") => void;
}

export const LibraryFilterBarLevelGroup = ({
	level,
	onLevelChange,
}: LibraryFilterBarLevelGroupProps) => {
	const { t } = useI18n();

	const handleAllClick = () => onLevelChange("all");

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("library.filterLevel")}
			</Typography>

			<LibraryFilterPill
				active={level === "all"}
				onClick={handleAllClick}
				className={
					level === "all" ? LIBRARY_FILTER_ACC_PILL_ACTIVE : LIBRARY_FILTER_ACC_PILL_IDLE
				}
			>
				{t("library.all")}
			</LibraryFilterPill>

			{LIBRARY_FILTER_BAR_CEFR_LEVELS.map(l => {
				const handleClick = () => onLevelChange(l);
				return (
					<LibraryFilterPill
						key={l}
						active={level === l}
						onClick={handleClick}
						className={libraryFilterLevelPillClass(l, level === l)}
					>
						{l}
					</LibraryFilterPill>
				);
			})}
		</>
	);
};
