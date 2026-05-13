import type {
	ReaderLetterSpacing,
	ReaderLineHeight,
	ReaderPagePadding,
	ReaderParagraphSpacing,
} from "@/features/reader-text-width";

export const READER_SETTINGS_LEGEND = [
	{ key: "KNOWN", swatchClass: "bg-[var(--grn)]" },
	{ key: "LEARNING", swatchClass: "bg-[var(--amb)]" },
	{ key: "NEW", swatchClass: "bg-[var(--t-4)]" },
] as const;

export const PAGE_PADDING_OPTIONS: Array<{ value: ReaderPagePadding; labelKey: string }> = [
	{ value: "compact", labelKey: "reader.settings.paddingCompact" },
	{ value: "normal", labelKey: "reader.settings.paddingNormal" },
	{ value: "wide", labelKey: "reader.settings.paddingWide" },
];

export const LINE_HEIGHT_OPTIONS: Array<{ value: ReaderLineHeight; labelKey: string }> = [
	{ value: "compact", labelKey: "reader.settings.lineCompact" },
	{ value: "normal", labelKey: "reader.settings.lineNormal" },
	{ value: "relaxed", labelKey: "reader.settings.lineRelaxed" },
];

export const LETTER_SPACING_OPTIONS: Array<{ value: ReaderLetterSpacing; labelKey: string }> = [
	{ value: "tight", labelKey: "reader.settings.spacingTight" },
	{ value: "normal", labelKey: "reader.settings.spacingNormal" },
	{ value: "wide", labelKey: "reader.settings.spacingWide" },
];

export const PARAGRAPH_SPACING_OPTIONS: Array<{ value: ReaderParagraphSpacing; labelKey: string }> = [
	{ value: "none", labelKey: "reader.settings.paragraphSpacingNone" },
	{ value: "compact", labelKey: "reader.settings.paragraphSpacingCompact" },
	{ value: "normal", labelKey: "reader.settings.paragraphSpacingNormal" },
	{ value: "relaxed", labelKey: "reader.settings.paragraphSpacingRelaxed" },
];

export const THEME_SWATCHES: Array<{
	value: "default" | "paper" | "sepia" | "warm" | "night" | "green" | "slate";
	color: string;
	labelKey: string;
}> = [
	{ value: "default", color: "#ffffff", labelKey: "reader.settings.themeDefault" },
	{ value: "paper", color: "#e8e6df", labelKey: "reader.settings.themePaper" },
	{ value: "sepia", color: "#f4efe6", labelKey: "reader.settings.themeSepia" },
	{ value: "warm", color: "#fdf3e3", labelKey: "reader.settings.themeWarm" },
	{ value: "night", color: "#1a1a1e", labelKey: "reader.settings.themeNight" },
	{ value: "green", color: "#1a2418", labelKey: "reader.settings.themeGreen" },
	{ value: "slate", color: "#1e2430", labelKey: "reader.settings.themeSlate" },
];
