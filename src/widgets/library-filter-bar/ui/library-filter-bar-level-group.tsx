"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { Typography } from "@/shared/ui/typography";
import {
	LIBRARY_FILTER_BAR_CEFR_LEVELS,
	libraryFilterLevelPillClass,
} from "../lib/library-filter-bar-config";
import { FilterGroup } from "@/shared/ui/filter-group";

export interface LibraryFilterBarLevelGroupProps {
	level: CefrLevel | "all";
	onLevelChange: (value: CefrLevel | "all") => void;
}

export const LibraryFilterBarLevelGroup = ({
	level,
	onLevelChange,
}: LibraryFilterBarLevelGroupProps) => {
	const { t } = useI18n();

	const options: { value: CefrLevel | "all"; label: string; activeClassName?: string }[] = [
		{ value: "all", label: t("library.all") },
		...LIBRARY_FILTER_BAR_CEFR_LEVELS.map(l => ({
			value: l as CefrLevel | "all",
			label: t(`shared.cefrLevel.${l}`),
			activeClassName: libraryFilterLevelPillClass(l, true),
		})),
	];

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("library.filterLevel")}
			</Typography>
			<FilterGroup
				options={options}
				value={level}
				onValueChange={onLevelChange}
			/>
		</>
	);
};
