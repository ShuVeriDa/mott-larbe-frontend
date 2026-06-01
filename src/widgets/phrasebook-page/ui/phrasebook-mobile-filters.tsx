"use client";

import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { useI18n } from "@/shared/lib/i18n";
import { PhrasebookMobileFilterTag } from "./phrasebook-mobile-filter-tag";

export const PhrasebookMobileFilters = () => {
	const { t } = useI18n();
	const { lang, savedOnly, setLang, setSavedOnly, setActiveCategoryId } = usePhrasebookFilters();

	const handleLangAll = () => setLang(null);
	const handleLangChe = () => setLang("che");
	const handleLangRu = () => setLang("ru");
	const handleShowAll = () => { setSavedOnly(false); setActiveCategoryId(null); };
	const handleShowSaved = () => { setSavedOnly(true); setActiveCategoryId(null); };

	return (
		<div className="flex overflow-x-auto gap-1.5 px-3.5 py-2 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<PhrasebookMobileFilterTag active={lang === null} onClick={handleLangAll}>
				{t("phrasebook.filters.allLangs")}
			</PhrasebookMobileFilterTag>
			<PhrasebookMobileFilterTag active={lang === "che"} onClick={handleLangChe}>
				{t("phrasebook.lang.che")}
			</PhrasebookMobileFilterTag>
			<PhrasebookMobileFilterTag active={lang === "ru"} onClick={handleLangRu}>
				{t("phrasebook.lang.ru")}
			</PhrasebookMobileFilterTag>
			<div className="w-px h-7 bg-bd-2 mx-0.5 shrink-0 self-center" />
			<PhrasebookMobileFilterTag active={!savedOnly} onClick={handleShowAll}>
				{t("phrasebook.filters.all")}
			</PhrasebookMobileFilterTag>
			<PhrasebookMobileFilterTag active={savedOnly} onClick={handleShowSaved}>
				{t("phrasebook.filters.saved")}
			</PhrasebookMobileFilterTag>
		</div>
	);
};
