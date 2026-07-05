"use client";

import { usePhrasebookParams } from "../model/use-phrasebook-params";
import { useI18n } from "@/shared/lib/i18n";
import { useVisibleLanguages } from "@/entities/user";
import { FilterGroup } from "@/shared/ui/filter-group";
import { PhraseLang } from "@/entities/phrasebook";

export const PhrasebookMobileFilters = () => {
	const { t } = useI18n();
	const { lang, savedOnly, setLang, setSavedOnly } = usePhrasebookParams();
	const visibleLanguages = useVisibleLanguages();

	const langOptions: { value: PhraseLang | null; label: string }[] = [
		{ value: null, label: t("phrasebook.filters.allLangs") },
		...visibleLanguages.map(l => ({
			value: l.code as PhraseLang,
			label: t(`shared.lang.${l.code}`),
		})),
	];

	const showOptions: { value: boolean; label: string }[] = [
		{ value: false, label: t("phrasebook.filters.all") },
		{ value: true, label: t("phrasebook.filters.saved") },
	];

	return (
		<div className="flex overflow-x-auto gap-1.5 px-3.5 py-2 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<FilterGroup
				options={langOptions}
				value={lang}
				onValueChange={setLang}
				chipClassName="h-9 text-[12px]"
			/>
			<div className="w-px h-7 bg-bd-2 mx-0.5 shrink-0 self-center" />
			<FilterGroup
				options={showOptions}
				value={savedOnly}
				onValueChange={setSavedOnly}
				chipClassName="h-9 text-[12px]"
			/>
		</div>
	);
};
