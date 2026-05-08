"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { NotionEditor } from "@/shared/ui/notion-editor";
import type { TipTapDoc, TipTapNode, SlashMenuItem, Editor } from "@/shared/ui/notion-editor";
import type { PageContent } from "../model/use-admin-text-create-page";

export type { TipTapDoc, TipTapNode };

// ── Stats helpers ─────────────────────────────────────────────────────────────

const extractText = (doc: TipTapDoc): string => {
	const walk = (nodes: TipTapNode[]): string =>
		nodes.map((n) => (n.text ? n.text : walk(n.content ?? []))).join(" ");
	return walk(doc.content);
};

const countWords = (doc: TipTapDoc) => {
	const text = extractText(doc).trim();
	return text ? text.split(/\s+/).filter(Boolean).length : 0;
};
const countChars = (doc: TipTapDoc) => extractText(doc).replace(/\s/g, "").length;
const countParagraphs = (doc: TipTapDoc) => {
	const blockTypes = new Set(["paragraph", "heading", "listItem"]);
	const walk = (nodes: TipTapNode[]): number =>
		nodes.reduce((acc, n) => acc + (blockTypes.has(n.type) ? 1 : 0) + walk(n.content ?? []), 0);
	return Math.max(walk(doc.content), 1);
};

// ── Toolbar helpers ───────────────────────────────────────────────────────────

const TbBtn = ({
	title,
	active,
	onExec,
	children,
}: {
	title: string;
	active?: boolean;
	onExec: () => void;
	children: React.ReactNode;
}) => (
	<button
		type="button"
		title={title}
		onMouseDown={(e) => {
			e.preventDefault();
			onExec();
		}}
		className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[5px] transition-colors ${
			active ? "bg-acc-muted text-acc-strong" : "text-t-2 hover:bg-surf-2 hover:text-t-1"
		}`}
	>
		{children}
	</button>
);

const TbDivider = () => <div className="mx-0.5 h-4 w-px shrink-0 bg-bd-2" />;

// ── Slash items ───────────────────────────────────────────────────────────────

const useSlashItems = (t: ReturnType<typeof useI18n>["t"]): SlashMenuItem[] =>
	useMemo(() => [
		{
			title: t("admin.texts.createPage.formatText"),
			description: "Обычный абзац",
			icon: <span className="text-[11px] font-medium text-t-2">¶</span>,
			command: (editor) => editor.chain().focus().setParagraph().run(),
		},
		{
			title: t("admin.texts.createPage.formatH2"),
			description: "Крупный заголовок",
			icon: <span className="text-[11px] font-bold text-t-2">H2</span>,
			command: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
		},
		{
			title: t("admin.texts.createPage.formatH3"),
			description: "Средний заголовок",
			icon: <span className="text-[10px] font-bold text-t-2">H3</span>,
			command: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
		},
		{
			title: t("admin.texts.createPage.formatQuote"),
			description: "Цитата",
			icon: <span className="text-[13px] text-t-2">"</span>,
			command: (editor) => editor.chain().focus().setBlockquote().run(),
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
			command: (editor) => editor.chain().focus().toggleBulletList().run(),
		},
		{
			title: t("admin.texts.createPage.orderedList"),
			description: "Нумерованный список",
			icon: (
				<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
					<path d="M2 3.5h1.5M2 3.5v2.5h1.5M2 9h1.5a.5.5 0 010 1H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
					<path d="M6.5 4.5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			),
			command: (editor) => editor.chain().focus().toggleOrderedList().run(),
		},
	], [t]);

// ── Toolbar ───────────────────────────────────────────────────────────────────

const EditorToolbar = ({ editor, t }: { editor: Editor | null; t: ReturnType<typeof useI18n>["t"] }) => {
	// Re-render on selection change so active states update
	const [, forceUpdate] = useState(0);
	useMemo(() => {
		if (!editor) return;
		const handler = () => forceUpdate((n) => n + 1);
		editor.on("selectionUpdate", handler);
		editor.on("transaction", handler);
		return () => {
			editor.off("selectionUpdate", handler);
			editor.off("transaction", handler);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor]);

	const e = editor;

	return (
		<div className="sticky top-[52px] z-10 flex items-center gap-px overflow-x-auto border-b border-bd-1 bg-surf px-2 py-[5px] transition-colors [scrollbar-width:none]">

			{/* Block type select */}
			<div className="shrink-0">
				<select
					className="h-[28px] cursor-pointer appearance-none rounded-[5px] border-none bg-transparent px-2 pr-5 text-xs text-t-2 outline-none transition-colors hover:bg-surf-2 hover:text-t-1"
					value={
						e?.isActive("heading", { level: 2 }) ? "h2" :
						e?.isActive("heading", { level: 3 }) ? "h3" :
						e?.isActive("blockquote") ? "blockquote" : "p"
					}
					onChange={(ev) => {
						if (!e) return;
						const v = ev.target.value;
						if (v === "p") e.chain().focus().setParagraph().run();
						else if (v === "h2") e.chain().focus().setHeading({ level: 2 }).run();
						else if (v === "h3") e.chain().focus().setHeading({ level: 3 }).run();
						else if (v === "blockquote") e.chain().focus().setBlockquote().run();
					}}
				>
					<option value="p">{t("admin.texts.createPage.formatText")}</option>
					<option value="h2">{t("admin.texts.createPage.formatH2")}</option>
					<option value="h3">{t("admin.texts.createPage.formatH3")}</option>
					<option value="blockquote">{t("admin.texts.createPage.formatQuote")}</option>
				</select>
			</div>

			<TbDivider />

			{/* Inline formatting */}
			<TbBtn title={t("admin.texts.createPage.bold")} active={e?.isActive("bold")} onExec={() => e?.chain().focus().toggleBold().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M4 8h5.5a2.5 2.5 0 000-5H4v5zM4 8h6a2.5 2.5 0 010 5H4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.italic")} active={e?.isActive("italic")} onExec={() => e?.chain().focus().toggleItalic().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M10 3H7M9 13H6M9 3L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.underline")} active={e?.isActive("underline")} onExec={() => e?.chain().focus().toggleUnderline().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M5 3v5a3 3 0 006 0V3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="Strike" active={e?.isActive("strike")} onExec={() => e?.chain().focus().toggleStrike().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
					<path d="M5.5 5.5C5.5 4.12 6.62 3 8 3s2.5 1.12 2.5 2.5M5.5 10.5C5.5 11.88 6.62 13 8 13s2.5-1.12 2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
				</svg>
			</TbBtn>

			<TbDivider />

			{/* Lists */}
			<TbBtn title={t("admin.texts.createPage.bulletList")} active={e?.isActive("bulletList")} onExec={() => e?.chain().focus().toggleBulletList().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<circle cx="3" cy="5" r="1.2" fill="currentColor" />
					<circle cx="3" cy="9" r="1.2" fill="currentColor" />
					<circle cx="3" cy="13" r="1.2" fill="currentColor" />
					<path d="M6.5 5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.orderedList")} active={e?.isActive("orderedList")} onExec={() => e?.chain().focus().toggleOrderedList().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 3.5h1.5M2 3.5v2.5h1.5M2 9h1.5a.5.5 0 010 1H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M6.5 4.5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>

			<TbDivider />

			{/* Alignment */}
			<TbBtn title="По левому краю" active={e?.isActive({ textAlign: "left" })} onExec={() => e?.chain().focus().setTextAlign("left").run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M2 7.5h8M2 11h10M2 14.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="По центру" active={e?.isActive({ textAlign: "center" })} onExec={() => e?.chain().focus().setTextAlign("center").run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M4 7.5h8M3 11h10M5 14.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="По правому краю" active={e?.isActive({ textAlign: "right" })} onExec={() => e?.chain().focus().setTextAlign("right").run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M6 7.5h8M4 11h10M8 14.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>
			<TbBtn title="По ширине" active={e?.isActive({ textAlign: "justify" })} onExec={() => e?.chain().focus().setTextAlign("justify").run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M2 4h12M2 7.5h12M2 11h12M2 14.5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
			</TbBtn>

			<TbDivider />

			{/* Undo / Redo */}
			<TbBtn title={t("admin.texts.createPage.undo")} onExec={() => e?.chain().focus().undo().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M3 7.5A5.5 5.5 0 1114 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					<path d="M3 3.5v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</TbBtn>
			<TbBtn title={t("admin.texts.createPage.redo")} onExec={() => e?.chain().focus().redo().run()}>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M13 7.5A5.5 5.5 0 102 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					<path d="M13 3.5v4H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</TbBtn>

			{/* Keyboard hints */}
			<div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2 text-[10px] text-t-4 max-lg:hidden">
				<span className="rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+S</span>
				<span>—</span>
				<span>{t("admin.texts.createPage.saveDraft")}</span>
				<span className="ml-1 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+↵</span>
				<span>—</span>
				<span>{t("admin.texts.createPage.publish")}</span>
				<span className="ml-2 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">/</span>
				<span>—</span>
				<span>блоки</span>
			</div>
		</div>
	);
};

// ── Main component ────────────────────────────────────────────────────────────

interface TextCreateEditorProps {
	title: string;
	pages: PageContent[];
	activePage: number;
	onTitleChange: (value: string) => void;
	onPageContentChange: (doc: TipTapDoc, wordCount: number) => void;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onSaveDraft: () => void;
	onPublish: () => void;
}

export const TextCreateEditor = ({
	title,
	pages,
	activePage,
	onTitleChange,
	onPageContentChange,
	onAddPage,
	onSelectPage,
	onSaveDraft,
	onPublish,
}: TextCreateEditorProps) => {
	const { t } = useI18n();
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });
	const [editor, setEditor] = useState<Editor | null>(null);
	const slashItems = useSlashItems(t);

	const adjustTitleHeight = useCallback(() => {
		if (titleRef.current) {
			titleRef.current.style.height = "auto";
			titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
		}
	}, []);

	const handleTitleInput = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			onTitleChange(e.target.value);
			adjustTitleHeight();
		},
		[onTitleChange, adjustTitleHeight],
	);

	const handleUpdate = useCallback(
		(doc: TipTapDoc) => {
			const wc = countWords(doc);
			onPageContentChange(doc, wc);
			setStats({ words: wc, chars: countChars(doc), paragraphs: countParagraphs(doc) });
		},
		[onPageContentChange],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === "s") {
				event.preventDefault();
				onSaveDraft();
				return true;
			}
			if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
				event.preventDefault();
				onPublish();
				return true;
			}
			return false;
		},
		[onSaveDraft, onPublish],
	);

	const titleLen = title.length;
	const titleWarn = titleLen > 160;

	return (
		<div className="flex min-w-0 flex-col border-r border-bd-1 max-[900px]:border-r-0">

			{/* ── Title area ── */}
			<div className="border-b border-bd-1 px-[22px] pt-5 max-sm:px-4 max-sm:pt-4">
				<textarea
					ref={titleRef}
					value={title}
					onChange={handleTitleInput}
					placeholder={t("admin.texts.createPage.titlePlaceholder")}
					rows={1}
					maxLength={200}
					className="w-full resize-none overflow-hidden border-none bg-transparent font-display text-[22px] font-normal leading-[1.35] text-t-1 outline-none placeholder:text-t-4 max-sm:text-[18px]"
				/>
				<div className={`pb-2.5 pt-1 text-right text-[10.5px] ${titleWarn ? "text-amb" : "text-t-4"}`}>
					{titleLen} / 200
				</div>
			</div>

			{/* ── Toolbar ── */}
			<EditorToolbar editor={editor} t={t} />

			{/* ── Pages bar ── */}
			<div className="sticky top-[93px] z-10 flex items-center overflow-x-auto border-b border-bd-1 bg-surf-2 px-3.5 transition-colors [scrollbar-width:none]">
				{pages.map((_, i) => (
					<button
						key={i}
						type="button"
						onClick={() => onSelectPage(i)}
						className={`flex h-9 shrink-0 items-center gap-1.5 border-b-2 px-3 text-xs transition-colors ${
							i === activePage
								? "border-acc text-acc-strong"
								: "border-transparent text-t-3 hover:text-t-2"
						}`}
					>
						<span
							className={`flex h-[17px] w-[17px] items-center justify-center rounded-[4px] text-[10px] font-semibold ${
								i === activePage ? "bg-acc-muted text-acc-strong" : "bg-surf-3 text-t-3"
							}`}
						>
							{i + 1}
						</span>
						{t("admin.texts.createPage.pageN", { n: i + 1 })}
					</button>
				))}

				<button
					type="button"
					title={t("admin.texts.createPage.addPage")}
					onClick={onAddPage}
					className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</button>

				<div className="ml-auto shrink-0 pl-2 text-[11px] text-t-3">
					{t("admin.texts.createPage.pages", { n: pages.length })}
				</div>
			</div>

			{/* ── Editor body ── */}
			<div className="group relative flex-1 px-[22px] py-[22px] pb-10 max-sm:px-4">
				<NotionEditor
					key={activePage}
					content={pages[activePage]?.doc ?? { type: "doc", content: [{ type: "paragraph" }] }}
					placeholder={t("admin.texts.createPage.startTyping")}
					slashMenuItems={slashItems}
					onUpdate={handleUpdate}
					onKeyDown={handleKeyDown}
					onEditorReady={setEditor}
				/>
			</div>

			{/* ── Editor footer ── */}
			<div className="flex flex-wrap items-center gap-3 border-t border-bd-1 bg-surf-2 px-[22px] py-[7px] text-[11px] text-t-3 transition-colors max-sm:px-4">
				<div className="flex items-center gap-1">
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M2 4h12M2 7.5h8M2 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					</svg>
					{t("admin.texts.createPage.words")}:&nbsp;
					<span className="font-medium text-t-2">{stats.words}</span>
				</div>
				<div className="h-3 w-px bg-bd-2" />
				<div>
					{t("admin.texts.createPage.chars")}:&nbsp;
					<span className="font-medium text-t-2">{stats.chars}</span>
				</div>
				<div className="h-3 w-px bg-bd-2 max-sm:hidden" />
				<div className="max-sm:hidden">
					{t("admin.texts.createPage.paragraphs")}:&nbsp;
					<span className="font-medium text-t-2">{stats.paragraphs}</span>
				</div>
			</div>
		</div>
	);
};
