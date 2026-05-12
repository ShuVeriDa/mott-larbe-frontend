"use client";

import type { LibraryProgressStatus } from "@/entities/library-text";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import {
	LIBRARY_FILTER_ACC_PILL_ACTIVE,
	LIBRARY_FILTER_ACC_PILL_IDLE,
	LIBRARY_FILTER_BAR_PROGRESS_STATUSES,
	libraryFilterProgressLabelKey,
} from "../lib/library-filter-bar-config";
import { LibraryFilterPill } from "./library-filter-pill";

export interface LibraryFilterBarProgressGroupProps {
	status: LibraryProgressStatus | "all";
	onStatusChange: (value: LibraryProgressStatus | "all") => void;
}

export const LibraryFilterBarProgressGroup = ({
	status,
	onStatusChange,
}: LibraryFilterBarProgressGroupProps) => {
	const { t } = useI18n();

	const handleAllClick = () => onStatusChange("all");

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("library.filterProgress")}
			</Typography>

			<LibraryFilterPill
				active={status === "all"}
				onClick={handleAllClick}
				className={
					status === "all"
						? LIBRARY_FILTER_ACC_PILL_ACTIVE
						: LIBRARY_FILTER_ACC_PILL_IDLE
				}
			>
				{t("library.all")}
			</LibraryFilterPill>

			{LIBRARY_FILTER_BAR_PROGRESS_STATUSES.map(s => {
				const handleClick = () => onStatusChange(s);
				return (
					<LibraryFilterPill
						key={s}
						active={status === s}
						onClick={handleClick}
						className={
							status === s
								? LIBRARY_FILTER_ACC_PILL_ACTIVE
								: LIBRARY_FILTER_ACC_PILL_IDLE
						}
					>
						{t(libraryFilterProgressLabelKey(s))}
					</LibraryFilterPill>
				);
			})}
		</>
	);
};
