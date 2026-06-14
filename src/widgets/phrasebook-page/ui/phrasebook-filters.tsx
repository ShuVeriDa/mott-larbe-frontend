"use client";

import { usePhrasebookParams } from "../model/use-phrasebook-params";
import { useI18n } from "@/shared/lib/i18n";
import { ENABLED_LANGUAGES } from "@/shared/lib/languages";
import { FilterGroup } from "@/shared/ui/filter-group";
import { PhraseLang } from "@/entities/phrasebook";

export const PhrasebookFilters = () => {
	const { t } = useI18n();
	const { lang, savedOnly, setLang, setSavedOnly } = usePhrasebookParams();

	const langOptions: { value: PhraseLang | null; label: string }[] = [
		{ value: null, label: t("phrasebook.filters.all") },
		...ENABLED_LANGUAGES.map(l => ({
			value: l.code as PhraseLang,
			label: t(`shared.lang.${l.code}`),
		})),
	];

	const showOptions: { value: boolean; label: string }[] = [
		{ value: false, label: t("phrasebook.filters.all") },
		{ value: true, label: t("phrasebook.filters.saved") },
	];

	return (
		<div className="flex gap-1.5 flex-wrap items-center">
			<FilterGroup
				label={t("phrasebook.filters.lang")}
				options={langOptions}
				value={lang}
				onValueChange={setLang}
			/>
			<div className="w-px h-4 bg-bd-2 mx-0.5" />
			<FilterGroup
				label={t("phrasebook.filters.show")}
				options={showOptions}
				value={savedOnly}
				onValueChange={setSavedOnly}
			/>
		</div>
	);
};
