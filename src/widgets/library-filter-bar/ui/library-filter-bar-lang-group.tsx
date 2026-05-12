"use client";

import type { LibraryTextLanguage } from "@/entities/library-text";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import {
	LIBRARY_FILTER_ACC_PILL_ACTIVE,
	LIBRARY_FILTER_ACC_PILL_IDLE,
	LIBRARY_FILTER_BAR_LANG_OPTIONS,
} from "../lib/library-filter-bar-config";
import { LibraryFilterPill } from "./library-filter-pill";

export interface LibraryFilterBarLangGroupProps {
	lang: LibraryTextLanguage | "all";
	onLangChange: (value: LibraryTextLanguage | "all") => void;
}

export const LibraryFilterBarLangGroup = ({
	lang,
	onLangChange,
}: LibraryFilterBarLangGroupProps) => {
	const { t } = useI18n();

	const handleAllClick = () => onLangChange("all");

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("library.filterLang")}
			</Typography>

			<LibraryFilterPill
				active={lang === "all"}
				onClick={handleAllClick}
				className={
					lang === "all" ? LIBRARY_FILTER_ACC_PILL_ACTIVE : LIBRARY_FILTER_ACC_PILL_IDLE
				}
			>
				{t("library.all")}
			</LibraryFilterPill>

			{LIBRARY_FILTER_BAR_LANG_OPTIONS.map(l => {
				const handleClick = () => onLangChange(l);
				return (
					<LibraryFilterPill
						key={l}
						active={lang === l}
						onClick={handleClick}
						className={
							lang === l
								? LIBRARY_FILTER_ACC_PILL_ACTIVE
								: LIBRARY_FILTER_ACC_PILL_IDLE
						}
					>
						{t(`library.lang.${l}`)}
					</LibraryFilterPill>
				);
			})}
		</>
	);
};
