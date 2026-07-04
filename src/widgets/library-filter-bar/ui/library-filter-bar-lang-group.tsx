"use client";

import type { LibraryTextLanguage } from "@/entities/library-text";
import { useVisibleLanguages } from "@/entities/user";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { FilterGroup } from "@/shared/ui/filter-group";

export interface LibraryFilterBarLangGroupProps {
	lang: LibraryTextLanguage | "all";
	onLangChange: (value: LibraryTextLanguage | "all") => void;
}

export const LibraryFilterBarLangGroup = ({
	lang,
	onLangChange,
}: LibraryFilterBarLangGroupProps) => {
	const { t } = useI18n();
	const visibleLanguages = useVisibleLanguages();

	const options: { value: LibraryTextLanguage | "all"; label: string }[] = [
		{ value: "all", label: t("library.all") },
		...visibleLanguages.map(l => ({
			value: l.code as LibraryTextLanguage | "all",
			label: t(`shared.lang.${l.code}`),
		})),
	];

	return (
		<>
			<Typography
				tag="span"
				className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden"
			>
				{t("library.filterLang")}
			</Typography>
			<FilterGroup
				options={options}
				value={lang}
				onValueChange={onLangChange}
			/>
		</>
	);
};
