"use client";

import type { LibraryProgressStatus } from "@/entities/library-text";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import {
	LIBRARY_FILTER_BAR_PROGRESS_STATUSES,
	libraryFilterProgressLabelKey,
} from "../lib/library-filter-bar-config";
import { FilterGroup } from "@/shared/ui/filter-group";

export interface LibraryFilterBarProgressGroupProps {
	status: LibraryProgressStatus | "all";
	onStatusChange: (value: LibraryProgressStatus | "all") => void;
}

export const LibraryFilterBarProgressGroup = ({
	status,
	onStatusChange,
}: LibraryFilterBarProgressGroupProps) => {
	const { t } = useI18n();

	const options: { value: LibraryProgressStatus | "all"; label: string }[] = [
		{ value: "all", label: t("library.all") },
		...LIBRARY_FILTER_BAR_PROGRESS_STATUSES.map(s => ({
			value: s as LibraryProgressStatus | "all",
			label: t(libraryFilterProgressLabelKey(s)),
		})),
	];

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("library.filterProgress")}
			</Typography>
			<FilterGroup
				options={options}
				value={status}
				onValueChange={onStatusChange}
			/>
		</>
	);
};
