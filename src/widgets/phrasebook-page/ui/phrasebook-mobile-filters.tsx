"use client";

import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

export const PhrasebookMobileFilters = () => {
	const { t } = useI18n();
	const { lang, savedOnly, setLang, setSavedOnly } = usePhrasebookFilters();

	const handleLangAll = () => setLang(null);
	const handleLangChe = () => setLang("che");
	const handleLangRu = () => setLang("ru");
	const handleShowAll = () => setSavedOnly(false);
	const handleShowSaved = () => setSavedOnly(true);

	return (
		<div className="flex overflow-x-auto gap-1.5 px-3.5 py-2 shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<MobileFilterTag active={lang === null} onClick={handleLangAll}>
				{t("phrasebook.filters.allLangs")}
			</MobileFilterTag>
			<MobileFilterTag active={lang === "che"} onClick={handleLangChe}>
				{t("phrasebook.lang.che")}
			</MobileFilterTag>
			<MobileFilterTag active={lang === "ru"} onClick={handleLangRu}>
				{t("phrasebook.lang.ru")}
			</MobileFilterTag>
			<div className="w-px h-7 bg-bd-2 mx-0.5 shrink-0 self-center" />
			<MobileFilterTag active={!savedOnly} onClick={handleShowAll}>
				{t("phrasebook.filters.all")}
			</MobileFilterTag>
			<MobileFilterTag active={savedOnly} onClick={handleShowSaved}>
				{t("phrasebook.filters.saved")}
			</MobileFilterTag>
		</div>
	);
};

interface MobileFilterTagProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

const MobileFilterTag = ({
	active,
	onClick,
	children,
}: MobileFilterTagProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"h-7 px-2.5 rounded-base text-[12px] font-medium font-[inherit]",
			"shrink-0 border-[0.5px] cursor-pointer transition-all duration-150",
			active
				? "bg-acc-bg text-acc-t border-transparent"
				: "bg-surf-2 border-bd-2 text-t-2",
		)}
	>
		{children}
	</button>
);
