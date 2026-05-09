"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { Editor, SlashMenuItem } from "@/shared/ui/notion-editor";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useState } from "react";

export const TbBtn = ({
	title,
	active,
	onExec,
	children,
}: {
	title: string;
	active?: boolean;
	onExec: () => void;
	children: ReactNode;
}) => {
	const handleMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = e => {
		e.preventDefault();
		onExec();
	};
	return (
		<Button
			title={title}
			onMouseDown={handleMouseDown}
			className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[5px] transition-all duration-100 ${
				active
					? "bg-[#2783de]/10 text-[#2783de]"
					: "text-t-2 hover:bg-surf-2 hover:text-t-1 active:scale-95"
			}`}
		>
			{children}
		</Button>
	);
};

export const TbDivider = () => <div className="mx-0.5 h-4 w-px shrink-0 bg-bd-2" />;

export const getSlashItems = (t: ReturnType<typeof useI18n>["t"]): SlashMenuItem[] => [
	{
		title: t("admin.texts.createPage.formatText"),
		description: "Обычный абзац",
		icon: <Typography tag="span" className="text-[11px] font-medium text-t-2">¶</Typography>,
		command: editor => editor.chain().focus().setParagraph().run(),
	},
	{
		title: t("admin.texts.createPage.formatH2"),
		description: "Крупный заголовок",
		icon: <Typography tag="span" className="text-[11px] font-bold text-t-2">H2</Typography>,
		command: editor => editor.chain().focus().setHeading({ level: 2 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatH3"),
		description: "Средний заголовок",
		icon: <Typography tag="span" className="text-[10px] font-bold text-t-2">H3</Typography>,
		command: editor => editor.chain().focus().setHeading({ level: 3 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatQuote"),
		description: "Цитата",
		icon: <Typography tag="span" className="text-[13px] text-t-2">&quot;</Typography>,
		command: editor => editor.chain().focus().setBlockquote().run(),
	},
	{
		title: t("admin.texts.createPage.bulletList"),
		description: "Маркированный список",
		icon: (
			<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
				<circle cx="3" cy="5" r="1.3" fill="currentColor" />
				<circle cx="3" cy="9" r="1.3" fill="currentColor" />
				<circle cx="3" cy="13" r="1.3" fill="currentColor" />
				<path d="M7 5h7M7 9h7M7 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			</svg>
		),
		command: editor => editor.chain().focus().toggleBulletList().run(),
	},
	{
		title: t("admin.texts.createPage.orderedList"),
		description: "Нумерованный список",
		icon: (
			<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
				<path
					d="M2 3.5h1.5M2 3.5v2.5h1.5M2 9h1.5a.5.5 0 010 1H2"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinecap="round"
				/>
				<path d="M6.5 4.5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			</svg>
		),
		command: editor => editor.chain().focus().toggleOrderedList().run(),
	},
];

interface EditorToolbarProps {
	editor: Editor | null;
	t: ReturnType<typeof useI18n>["t"];
	keyboardHints?: ReactNode;
	extraItems?: ReactNode;
}

export const EditorToolbar = ({ editor, t, keyboardHints, extraItems }: EditorToolbarProps) => {
	const [, forceUpdate] = useState(0);
	useEffect(() => {
		if (!editor) return;
		const handler = () => forceUpdate(n => n + 1);
		editor.on("selectionUpdate", handler);
		editor.on("transaction", handler);
		return () => {
			editor.off("selectionUpdate", handler);
			editor.off("transaction", handler);
		};
	}, [editor]);

	const e = editor;

	const handleBlockTypeChange: NonNullable<ComponentProps<"select">["onChange"]> = ev => {
		if (!e) return;
		const v = ev.currentTarget.value;
		if (v === "p") e.chain().focus().setParagraph().run();
		else if (v === "h2") e.chain().focus().setHeading({ level: 2 }).run();
		else if (v === "h3") e.chain().focus().setHeading({ level: 3 }).run();
		else if (v === "blockquote") e.chain().focus().setBlockquote().run();
	};
	const handleToggleBold = () => e?.chain().focus().toggleBold().run();
	const handleToggleItalic = () => e?.chain().focus().toggleItalic().run();
	const handleToggleUnderline = () => e?.chain().focus().toggleUnderline().run();
	const handleToggleStrike = () => e?.chain().focus().toggleStrike().run();
	const handleToggleBulletList = () => e?.chain().focus().toggleBulletList().run();
	const handleToggleOrderedList = () => e?.chain().focus().toggleOrderedList().run();
	const handleSetAlignLeft = () => e?.chain().focus().setTextAlign("left").run();
	const handleSetAlignCenter = () => e?.chain().focus().setTextAlign("center").run();
	const handleSetAlignRight = () => e?.chain().focus().setTextAlign("right").run();
	const handleSetAlignJustify = () => e?.chain().focus().setTextAlign("justify").run();
	const handleUndo = () => e?.chain().focus().undo().run();
	const handleRedo = () => e?.chain().focus().redo().run();

	return (
		<div className="sticky top-[52px] z-10 flex items-center gap-px overflow-x-auto border-b border-bd-1 bg-surf px-2 py-[5px] transition-colors [scrollbar-width:none]">
			<div className="shrink-0">
				<select
					className="h-[28px] cursor-pointer appearance-none rounded-[5px] border-none bg-transparent px-2 pr-5 text-xs text-t-2 outline-none transition-colors hover:bg-surf-2 hover:text-t-1"
					value={
						e?.isActive("heading", { level: 2 })
							? "h2"
							: e?.isActive("heading", { level: 3 })
								? "h3"
								: e?.isActive("blockquote")
									? "blockquote"
									: "p"
					}
					onChange={handleBlockTypeChange}
				>
					<option value="p">{t("admin.texts.createPage.formatText")}</option>
					<option value="h2">{t("admin.texts.createPage.formatH2")}</option>
					<option value="h3">{t("admin.texts.createPage.formatH3")}</option>
					<option value="blockquote">{t("admin.texts.createPage.formatQuote")}</option>
				</select>
			</div>

			<TbDivider />

			<TbBtn title={t("admin.texts.createPage.bold")} active={e?.isActive("bold")} onExec={handleToggleBold}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M4 8h5.5a2.5 2.5 0 000-5H4v5zM4 8h6a2.5 2.5 0 010 5H4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.italic")} active={e?.isActive("italic")} onExec={handleToggleItalic}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M10 3H7M9 13H6M9 3L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.underline")} active={e?.isActive("underline")} onExec={handleToggleUnderline}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M5 3v5a3 3 0 006 0V3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="Strike" active={e?.isActive("strike")} onExec={handleToggleStrike}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
					<path d="M5.5 5.5C5.5 4.12 6.62 3 8 3s2.5 1.12 2.5 2.5M5.5 10.5C5.5 11.88 6.62 13 8 13s2.5-1.12 2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
				</svg>
			</TbBtn>

			<TbDivider />

			<TbBtn title={t("admin.texts.createPage.bulletList")} active={e?.isActive("bulletList")} onExec={handleToggleBulletList}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<circle cx="3" cy="5" r="1.2" fill="currentColor" />
					<circle cx="3" cy="9" r="1.2" fill="currentColor" />
					<circle cx="3" cy="13" r="1.2" fill="currentColor" />
					<path d="M6.5 5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.orderedList")} active={e?.isActive("orderedList")} onExec={handleToggleOrderedList}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 3.5h1.5M2 3.5v2.5h1.5M2 9h1.5a.5.5 0 010 1H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M6.5 4.5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>

			<TbDivider />

			<TbBtn title="По левому краю" active={e?.isActive({ textAlign: "left" })} onExec={handleSetAlignLeft}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M2 7.5h8M2 11h10M2 14.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="По центру" active={e?.isActive({ textAlign: "center" })} onExec={handleSetAlignCenter}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M4 7.5h8M3 11h10M5 14.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="По правому краю" active={e?.isActive({ textAlign: "right" })} onExec={handleSetAlignRight}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M6 7.5h8M4 11h10M8 14.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="По ширине" active={e?.isActive({ textAlign: "justify" })} onExec={handleSetAlignJustify}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M2 7.5h12M2 11h12M2 14.5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>

			<TbDivider />

			<TbBtn title={t("admin.texts.createPage.undo")} onExec={handleUndo}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M3 7.5A5.5 5.5 0 1114 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					<path d="M3 3.5v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.redo")} onExec={handleRedo}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M13 7.5A5.5 5.5 0 102 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					<path d="M13 3.5v4H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</TbBtn>

			{extraItems && (
				<>
					<TbDivider />
					{extraItems}
				</>
			)}

			{keyboardHints && (
				<div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2 text-[10px] text-t-4 max-lg:hidden">
					{keyboardHints}
				</div>
			)}
		</div>
	);
};
