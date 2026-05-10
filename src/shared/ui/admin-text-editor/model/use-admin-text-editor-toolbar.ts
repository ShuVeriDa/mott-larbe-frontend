"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { Editor } from "@/shared/ui/notion-editor";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import {
	type BlockTypeValue,
	getAdminTextEditorBlockTypeOptions,
} from "./get-admin-text-editor-block-type-options";
import { getAdminTextEditorToolbarActionSections } from "./get-admin-text-editor-toolbar-action-sections";

interface UseAdminTextEditorToolbarParams {
	editor: Editor | null;
	t: ReturnType<typeof useI18n>["t"];
}

export const useAdminTextEditorToolbar = ({
	editor,
	t,
}: UseAdminTextEditorToolbarParams) => {
	const [, forceUpdate] = useState(0);
	const [blockTypeAnchor, setBlockTypeAnchor] = useState<DOMRect | null>(null);

	useEffect(() => {
		if (!editor) return;
		const handleEditorChange = () => forceUpdate(n => n + 1);
		editor.on("selectionUpdate", handleEditorChange);
		editor.on("transaction", handleEditorChange);

		return () => {
			editor.off("selectionUpdate", handleEditorChange);
			editor.off("transaction", handleEditorChange);
		};
	}, [editor]);

	const blockTypeOpen = blockTypeAnchor !== null;

	const blockTypeOptions = getAdminTextEditorBlockTypeOptions(t);

	const currentBlockType: BlockTypeValue = editor?.isActive("heading", { level: 1 })
		? "h1"
		: editor?.isActive("heading", { level: 2 })
			? "h2"
			: editor?.isActive("heading", { level: 3 })
				? "h3"
				: editor?.isActive("heading", { level: 4 })
					? "h4"
					: editor?.isActive("blockquote")
						? "blockquote"
						: "p";

	const currentBlockTypeLabel =
		blockTypeOptions.find(option => option.value === currentBlockType)?.label ??
		t("admin.texts.createPage.formatText");

	const handleBlockTypeMouseDown: NonNullable<
		ComponentProps<"button">["onMouseDown"]
	> = event => {
		event.preventDefault();
		const rect = event.currentTarget.getBoundingClientRect();
		setBlockTypeAnchor(prev => (prev ? null : rect));
	};

	const handleBlockTypeBackdropMouseDown: NonNullable<
		ComponentProps<"div">["onMouseDown"]
	> = () => {
		setBlockTypeAnchor(null);
	};

	const handleBlockTypeApply = (value: BlockTypeValue) => {
		if (!editor) return;
		if (value === "p") editor.chain().focus().setParagraph().run();
		else if (value === "h1") editor.chain().focus().setHeading({ level: 1 }).run();
		else if (value === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
		else if (value === "h3") editor.chain().focus().setHeading({ level: 3 }).run();
		else if (value === "h4") editor.chain().focus().setHeading({ level: 4 }).run();
		else if (value === "blockquote") editor.chain().focus().setBlockquote().run();
		setBlockTypeAnchor(null);
	};

	const getHandleBlockTypeItemMouseDown = (
		value: BlockTypeValue,
	): NonNullable<ComponentProps<"button">["onMouseDown"]> => {
		return event => {
			event.preventDefault();
			handleBlockTypeApply(value);
		};
	};

	const handleToggleBold = () => editor?.chain().focus().toggleBold().run();
	const handleToggleItalic = () => editor?.chain().focus().toggleItalic().run();
	const handleToggleUnderline = () => editor?.chain().focus().toggleUnderline().run();
	const handleToggleStrike = () => editor?.chain().focus().toggleStrike().run();
	const handleToggleBulletList = () =>
		editor?.chain().focus().toggleBulletList().run();
	const handleToggleOrderedList = () =>
		editor?.chain().focus().toggleOrderedList().run();
	const handleSetAlignLeft = () => editor?.chain().focus().setTextAlign("left").run();
	const handleSetAlignCenter = () =>
		editor?.chain().focus().setTextAlign("center").run();
	const handleSetAlignRight = () =>
		editor?.chain().focus().setTextAlign("right").run();
	const handleSetAlignJustify = () =>
		editor?.chain().focus().setTextAlign("justify").run();
	const handleUndo = () => editor?.chain().focus().undo().run();
	const handleRedo = () => editor?.chain().focus().redo().run();

	const toolbarActionSections = getAdminTextEditorToolbarActionSections({
		editor,
		t,
		handlers: {
			handleToggleBold,
			handleToggleItalic,
			handleToggleUnderline,
			handleToggleStrike,
			handleToggleBulletList,
			handleToggleOrderedList,
			handleSetAlignLeft,
			handleSetAlignCenter,
			handleSetAlignRight,
			handleSetAlignJustify,
			handleUndo,
			handleRedo,
		},
	});

	return {
		blockTypeAnchor,
		blockTypeOpen,
		blockTypeOptions,
		currentBlockType,
		currentBlockTypeLabel,
		getHandleBlockTypeItemMouseDown,
		handleBlockTypeBackdropMouseDown,
		handleBlockTypeMouseDown,
		toolbarActionSections,
	};
};
