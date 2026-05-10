"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { Editor } from "@/shared/ui/notion-editor";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	List,
	ListOrdered,
	Redo,
	Strikethrough,
	Subscript,
	Superscript,
	Underline,
	Undo,
	type LucideIcon,
} from "lucide-react";

interface ToolbarActionHandlers {
	handleToggleBold: () => void;
	handleToggleItalic: () => void;
	handleToggleUnderline: () => void;
	handleToggleStrike: () => void;
	handleToggleSuperscript: () => void;
	handleToggleSubscript: () => void;
	handleToggleBulletList: () => void;
	handleToggleOrderedList: () => void;
	handleSetAlignLeft: () => void;
	handleSetAlignCenter: () => void;
	handleSetAlignRight: () => void;
	handleSetAlignJustify: () => void;
	handleUndo: () => void;
	handleRedo: () => void;
}

interface ToolbarActionItem {
	id: string;
	title: string;
	active?: boolean;
	onExec: () => void;
	Icon: LucideIcon;
}

export type ToolbarActionSections = ToolbarActionItem[][];

interface GetToolbarActionSectionsParams {
	editor: Editor | null;
	t: ReturnType<typeof useI18n>["t"];
	handlers: ToolbarActionHandlers;
}

export const getAdminTextEditorToolbarActionSections = ({
	editor,
	t,
	handlers,
}: GetToolbarActionSectionsParams): ToolbarActionSections => [
	[
		{
			id: "bold",
			title: t("admin.texts.createPage.bold"),
			active: editor?.isActive("bold"),
			onExec: handlers.handleToggleBold,
			Icon: Bold,
		},
		{
			id: "italic",
			title: t("admin.texts.createPage.italic"),
			active: editor?.isActive("italic"),
			onExec: handlers.handleToggleItalic,
			Icon: Italic,
		},
		{
			id: "underline",
			title: t("admin.texts.createPage.underline"),
			active: editor?.isActive("underline"),
			onExec: handlers.handleToggleUnderline,
			Icon: Underline,
		},
		{
			id: "strike",
			title: "Strike",
			active: editor?.isActive("strike"),
			onExec: handlers.handleToggleStrike,
			Icon: Strikethrough,
		},
		{
			id: "superscript",
			title: t("admin.texts.createPage.superscript"),
			active: editor?.isActive("superscript"),
			onExec: handlers.handleToggleSuperscript,
			Icon: Superscript,
		},
		{
			id: "subscript",
			title: t("admin.texts.createPage.subscript"),
			active: editor?.isActive("subscript"),
			onExec: handlers.handleToggleSubscript,
			Icon: Subscript,
		},
	],
	[
		{
			id: "bullet-list",
			title: t("admin.texts.createPage.bulletList"),
			active: editor?.isActive("bulletList"),
			onExec: handlers.handleToggleBulletList,
			Icon: List,
		},
		{
			id: "ordered-list",
			title: t("admin.texts.createPage.orderedList"),
			active: editor?.isActive("orderedList"),
			onExec: handlers.handleToggleOrderedList,
			Icon: ListOrdered,
		},
	],
	[
		{
			id: "align-left",
			title: "По левому краю",
			active: editor?.isActive({ textAlign: "left" }),
			onExec: handlers.handleSetAlignLeft,
			Icon: AlignLeft,
		},
		{
			id: "align-center",
			title: "По центру",
			active: editor?.isActive({ textAlign: "center" }),
			onExec: handlers.handleSetAlignCenter,
			Icon: AlignCenter,
		},
		{
			id: "align-right",
			title: "По правому краю",
			active: editor?.isActive({ textAlign: "right" }),
			onExec: handlers.handleSetAlignRight,
			Icon: AlignRight,
		},
		{
			id: "align-justify",
			title: "По ширине",
			active: editor?.isActive({ textAlign: "justify" }),
			onExec: handlers.handleSetAlignJustify,
			Icon: AlignJustify,
		},
	],
	[
		{
			id: "undo",
			title: t("admin.texts.createPage.undo"),
			onExec: handlers.handleUndo,
			Icon: Undo,
		},
		{
			id: "redo",
			title: t("admin.texts.createPage.redo"),
			onExec: handlers.handleRedo,
			Icon: Redo,
		},
	],
];
