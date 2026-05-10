import { useI18n } from "@/shared/lib/i18n";

export interface AdminTextEditorShortcut {
	combo: string;
	label: string;
}

interface GetAdminTextEditorShortcutsParams {
	t: ReturnType<typeof useI18n>["t"];
	primaryShortcutLabel: string;
}

export const getAdminTextEditorShortcuts = ({
	t,
	primaryShortcutLabel,
}: GetAdminTextEditorShortcutsParams): AdminTextEditorShortcut[] => {
	return [
		{
			combo: "Ctrl/Cmd + S",
			label: t("admin.texts.createPage.shortcuts.saveDraft"),
		},
		{
			combo: "Ctrl/Cmd + Enter",
			label: primaryShortcutLabel,
		},
		{
			combo: "/",
			label: t("admin.texts.createPage.shortcuts.blocks"),
		},
		{
			combo: "Ctrl/Cmd + B",
			label: t("admin.texts.createPage.bold"),
		},
		{
			combo: "Ctrl/Cmd + I",
			label: t("admin.texts.createPage.italic"),
		},
		{
			combo: "Ctrl/Cmd + U",
			label: t("admin.texts.createPage.underline"),
		},
		{
			combo: "Ctrl/Cmd + .",
			label: t("admin.texts.createPage.superscript"),
		},
		{
			combo: "Ctrl/Cmd + ,",
			label: t("admin.texts.createPage.subscript"),
		},
		{
			combo: "Ctrl/Cmd + H",
			label: t("admin.texts.createPage.shortcuts.findReplace"),
		},
		{
			combo: "Ctrl/Cmd + Z",
			label: t("admin.texts.createPage.undo"),
		},
		{
			combo: "Shift + Ctrl/Cmd + Z",
			label: t("admin.texts.createPage.redo"),
		},
	];
};
