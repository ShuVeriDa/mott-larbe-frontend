export interface TocItem {
	id: string;
	label: string;
}

export const getArabicToc = (t: (key: string) => string): TocItem[] => [
	{ id: "arabic-why", label: t("scriptGuide.arabic.whyTitle") },
	{ id: "arabic-rules", label: t("scriptGuide.arabic.keyRules") },
	{ id: "arabic-consonants", label: t("scriptGuide.arabic.consonantsTitle") },
	{ id: "arabic-vowels", label: t("scriptGuide.arabic.vowelsTitle") },
	{ id: "arabic-examples", label: t("scriptGuide.arabic.examplesTitle") },
];

export const getLatinToc = (t: (key: string) => string): TocItem[] => [
	{ id: "latin-rules", label: t("scriptGuide.latin.keyRules") },
	{ id: "latin-alphabet", label: t("scriptGuide.latin.alphabetTitle") },
	{ id: "latin-examples", label: t("scriptGuide.latin.examplesTitle") },
];
