"use client";

import { useI18n } from "@/shared/lib/i18n";

export type BlockTypeValue = "p" | "h1" | "h2" | "h3" | "h4" | "blockquote";

interface BlockTypeOption {
	value: BlockTypeValue;
	label: string;
	iconLabel: string;
	hint?: string;
}

export const getAdminTextEditorBlockTypeOptions = (
	t: ReturnType<typeof useI18n>["t"],
): BlockTypeOption[] => [
	{
		value: "p",
		label: t("admin.texts.createPage.formatText"),
		iconLabel: "T",
	},
	{
		value: "h1",
		label: t("admin.texts.createPage.formatH1"),
		iconLabel: "H1",
		hint: "#",
	},
	{
		value: "h2",
		label: t("admin.texts.createPage.formatH2"),
		iconLabel: "H2",
		hint: "##",
	},
	{
		value: "h3",
		label: t("admin.texts.createPage.formatH3"),
		iconLabel: "H3",
		hint: "###",
	},
	{
		value: "h4",
		label: t("admin.texts.createPage.formatH4"),
		iconLabel: "H4",
		hint: "####",
	},
	{
		value: "blockquote",
		label: t("admin.texts.createPage.formatQuote"),
		iconLabel: "\"",
		hint: "\"",
	},
];
