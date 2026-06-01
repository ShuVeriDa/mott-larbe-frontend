"use client";

import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { useI18n } from "@/shared/lib/i18n";
import { PhrasebookFilterTag } from "./phrasebook-filter-tag";

export const PhrasebookFilters = () => {
	const { t } = useI18n();
	const { lang, savedOnly, setLang, setSavedOnly, setActiveCategoryId } = usePhrasebookFilters();

	const handleLangAll = () => setLang(null);
	const handleLangChe = () => setLang("che");
	const handleLangRu = () => setLang("ru");
	const handleShowAll = () => { setSavedOnly(false); setActiveCategoryId(null); };
	const handleShowSaved = () => { setSavedOnly(true); setActiveCategoryId(null); };

	return (
		<div className="flex gap-1.5 flex-wrap items-center">
			<span className="text-[11px] text-t-3 font-medium">
				{t("phrasebook.filters.lang")}
			</span>
			<PhrasebookFilterTag active={lang === null} onClick={handleLangAll}>
				{t("phrasebook.filters.all")}
			</PhrasebookFilterTag>
			<PhrasebookFilterTag active={lang === "che"} onClick={handleLangChe}>
				{t("phrasebook.lang.che")}
			</PhrasebookFilterTag>
			<PhrasebookFilterTag active={lang === "ru"} onClick={handleLangRu}>
				{t("phrasebook.lang.ru")}
			</PhrasebookFilterTag>
			<div className="w-px h-4 bg-bd-2 mx-0.5" />
			<span className="text-[11px] text-t-3 font-medium">
				{t("phrasebook.filters.show")}
			</span>
			<PhrasebookFilterTag active={!savedOnly} onClick={handleShowAll}>
				{t("phrasebook.filters.all")}
			</PhrasebookFilterTag>
			<PhrasebookFilterTag active={savedOnly} onClick={handleShowSaved}>
				{t("phrasebook.filters.saved")}
			</PhrasebookFilterTag>
		</div>
	);
};
