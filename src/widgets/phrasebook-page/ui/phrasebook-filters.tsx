"use client";

import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

export const PhrasebookFilters = () => {
	const { t } = useI18n();
	const { lang, savedOnly, setLang, setSavedOnly } = usePhrasebookFilters();

	const handleLangAll = () => setLang(null);
	const handleLangChe = () => setLang("che");
	const handleLangRu = () => setLang("ru");
	const handleShowAll = () => setSavedOnly(false);
	const handleShowSaved = () => setSavedOnly(true);

	return (
		<div className="flex gap-1.5 flex-wrap items-center">
			<span className="text-[11px] text-t-3 font-medium">
				{t("phrasebook.filters.lang")}
			</span>
			<FilterTag active={lang === null} onClick={handleLangAll}>
				{t("phrasebook.filters.all")}
			</FilterTag>
			<FilterTag active={lang === "che"} onClick={handleLangChe}>
				{t("phrasebook.lang.che")}
			</FilterTag>
			<FilterTag active={lang === "ru"} onClick={handleLangRu}>
				{t("phrasebook.lang.ru")}
			</FilterTag>
			<div className="w-px h-4 bg-bd-2 mx-0.5" />
			<span className="text-[11px] text-t-3 font-medium">
				{t("phrasebook.filters.show")}
			</span>
			<FilterTag active={!savedOnly} onClick={handleShowAll}>
				{t("phrasebook.filters.all")}
			</FilterTag>
			<FilterTag active={savedOnly} onClick={handleShowSaved}>
				{t("phrasebook.filters.saved")}
			</FilterTag>
		</div>
	);
};

interface FilterTagProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

const FilterTag = ({ active, onClick, children }: FilterTagProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"h-6 px-2.5 rounded-base text-[11.5px] font-medium font-[inherit] cursor-pointer",
			"border-[0.5px] transition-all duration-150",
			active
				? "bg-acc-bg text-acc-t border-transparent"
				: "bg-surf-2 border-bd-2 text-t-2 hover:bg-surf-3 hover:text-t-1",
		)}
	>
		{children}
	</button>
);
