import type {
	LibraryProgressStatus,
	LibraryTextLanguage,
} from "@/entities/library-text";
import type { CefrLevel } from "@/shared/types";

export const LIBRARY_FILTER_BAR_CEFR_LEVELS: readonly CefrLevel[] = [
	"A",
	"B",
	"C",
];

/** Languages shown as filter pills (subset of `LibraryTextLanguage`). */
export const LIBRARY_FILTER_BAR_LANG_OPTIONS: readonly LibraryTextLanguage[] =
	["CHE"];

export const LIBRARY_FILTER_BAR_PROGRESS_STATUSES: readonly LibraryProgressStatus[] =
	["NEW", "IN_PROGRESS", "COMPLETED"];

export const LIBRARY_FILTER_ACC_PILL_ACTIVE =
	"bg-acc-bg border-acc/25 text-acc-t";

export const LIBRARY_FILTER_ACC_PILL_IDLE =
	"border-bd-2 bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1";

export const libraryFilterLevelPillClass = (level: CefrLevel, active: boolean) => {
	if (active) {
		if (level === "A") return "bg-grn-bg border-grn/25 text-grn-t";
		if (level === "B") return "bg-amb-bg border-amb/25 text-amb-t";
		return "bg-red-bg border-red/25 text-red-t";
	}
	return LIBRARY_FILTER_ACC_PILL_IDLE;
};

export const libraryFilterProgressLabelKey = (status: LibraryProgressStatus) =>
	`library.progress.${status.toLowerCase().replace("_", "")}` as const;
