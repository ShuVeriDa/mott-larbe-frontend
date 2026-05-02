"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { countCharsInHtml, countParagraphsInHtml, countWordsInHtml } from "../lib/html-to-tiptap";
import type { PageContent } from "../model/use-admin-text-create-page";

// ─────────────────────────────────────────────────────────────────────────────
// Internal: contenteditable body — remounts on activePage change via key prop
// ─────────────────────────────────────────────────────────────────────────────

interface EditorBodyProps {
	initialHtml: string;
	onContentChange: (html: string) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	placeholder: string;
}

const EditorBody = ({ initialHtml, onContentChange, onKeyDown, placeholder }: EditorBodyProps) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.innerHTML = initialHtml || "";
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only on mount — key prop handles page switches

	const handleInput = useCallback(() => {
		onContentChange(ref.current?.innerHTML ?? "");
	}, [onContentChange]);

	return (
		<div
			ref={ref}
			contentEditable
			suppressContentEditableWarning
			spellCheck={false}
			data-placeholder={placeholder}
			onInput={handleInput}
			onKeyDown={onKeyDown}
			className="min-h-[360px] cursor-text text-[14.5px] leading-[1.75] text-t-1 outline-none caret-acc empty:before:pointer-events-none empty:before:text-t-4 empty:before:content-[attr(data-placeholder)] [&_blockquote]:my-4 [&_blockquote]:border-l-[3px] [&_blockquote]:border-acc-muted [&_blockquote]:pl-3.5 [&_blockquote]:text-t-2 [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-[18px] [&_h2]:font-medium [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-[15px] [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:pl-5 [&_p:last-child]:mb-0 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:pl-5"
		/>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// Toolbar button helper
// ─────────────────────────────────────────────────────────────────────────────

interface TbBtnProps {
	title: string;
	onExec: () => void;
	children: React.ReactNode;
}

const TbBtn = ({ title, onExec, children }: TbBtnProps) => (
	<button
		type="button"
		title={title}
		onMouseDown={(e) => {
			e.preventDefault(); // Don't steal focus from editor
			onExec();
		}}
		className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] border-none bg-transparent text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
	>
		{children}
	</button>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main editor column component
// ─────────────────────────────────────────────────────────────────────────────

interface TextCreateEditorProps {
	title: string;
	pages: PageContent[];
	activePage: number;
	onTitleChange: (value: string) => void;
	onPageContentChange: (html: string, wordCount: number) => void;
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

	const handleContentChange = useCallback((html: string) => {
		const wc = countWordsInHtml(html);
		onPageContentChange(html, wc);
		setStats({
			words: wc,
			chars: countCharsInHtml(html),
			paragraphs: countParagraphsInHtml(html),
		});
	}, [onPageContentChange]);

	const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "s") {
			e.preventDefault();
			onSaveDraft();
		}
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			e.preventDefault();
			onPublish();
		}
	}, [onSaveDraft, onPublish]);

	// Auto-grow title textarea
	const adjustTitleHeight = useCallback(() => {
		if (titleRef.current) {
			titleRef.current.style.height = "auto";
			titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
		}
	}, []);

	const handleTitleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onTitleChange(e.target.value);
		adjustTitleHeight();
	}, [onTitleChange, adjustTitleHeight]);

	const exec = (command: string, value?: string) => {
		document.execCommand(command, false, value ?? undefined);
	};

	const formatBlock = (tag: string) => {
		exec("formatBlock", tag);
	};

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

			{/* ── Formatting toolbar ── */}
			<div className="sticky top-[52px] z-10 flex items-center gap-px overflow-x-auto border-b border-bd-1 bg-surf px-2 py-[5px] transition-colors [scrollbar-width:none] max-sm:top-[52px]">
				{/* Block format select */}
				<div className="shrink-0">
					<select
						className="h-7 cursor-pointer appearance-none rounded-[5px] border-none bg-transparent px-2 pr-5 text-xs text-t-2 outline-none transition-colors hover:bg-surf-2 hover:text-t-1"
						defaultValue="p"
						onChange={(e) => {
							const v = e.target.value;
							formatBlock(v);
							e.target.value = "p";
						}}
					>
						<option value="p">{t("admin.texts.createPage.formatText")}</option>
						<option value="h2">{t("admin.texts.createPage.formatH2")}</option>
						<option value="h3">{t("admin.texts.createPage.formatH3")}</option>
						<option value="blockquote">{t("admin.texts.createPage.formatQuote")}</option>
					</select>
				</div>

				<div className="mx-1 h-4 w-px shrink-0 bg-bd-2" />

				<div className="flex shrink-0 items-center gap-px">
					<TbBtn title={t("admin.texts.createPage.bold")} onExec={() => exec("bold")}>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M4 8h5.5a2.5 2.5 0 000-5H4v5zM4 8h6a2.5 2.5 0 010 5H4V8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</TbBtn>
					<TbBtn title={t("admin.texts.createPage.italic")} onExec={() => exec("italic")}>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M10 3H7M9 13H6M9 3L7 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						</svg>
					</TbBtn>
					<TbBtn title={t("admin.texts.createPage.underline")} onExec={() => exec("underline")}>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M5 3v5a3 3 0 006 0V3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						</svg>
					</TbBtn>
				</div>

				<div className="mx-1 h-4 w-px shrink-0 bg-bd-2" />

				<div className="flex shrink-0 items-center gap-px">
					<TbBtn title={t("admin.texts.createPage.bulletList")} onExec={() => exec("insertUnorderedList")}>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<circle cx="3.5" cy="5" r="1.2" fill="currentColor" />
							<circle cx="3.5" cy="9" r="1.2" fill="currentColor" />
							<circle cx="3.5" cy="13" r="1.2" fill="currentColor" />
							<path d="M7 5h6M7 9h6M7 13h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						</svg>
					</TbBtn>
					<TbBtn title={t("admin.texts.createPage.orderedList")} onExec={() => exec("insertOrderedList")}>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M2 4h1.5M2 4v2.5h1.5M2 9.5h1.5a.5.5 0 010 1H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M7 4.5h7M7 9h7M7 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						</svg>
					</TbBtn>
				</div>

				<div className="mx-1 h-4 w-px shrink-0 bg-bd-2" />

				<div className="flex shrink-0 items-center gap-px">
					<TbBtn title={t("admin.texts.createPage.undo")} onExec={() => exec("undo")}>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M3 7.5A5.5 5.5 0 1114 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							<path d="M3 3.5v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</TbBtn>
					<TbBtn title={t("admin.texts.createPage.redo")} onExec={() => exec("redo")}>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M13 7.5A5.5 5.5 0 102 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							<path d="M13 3.5v4H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</TbBtn>
				</div>

				{/* Keyboard hint */}
				<div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2 text-[10px] text-t-4 max-md:hidden">
					<span className="rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+S</span>
					<span>—</span>
					<span>{t("admin.texts.createPage.saveDraft")}</span>
					<span className="ml-1 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+↵</span>
					<span>—</span>
					<span>{t("admin.texts.createPage.publish")}</span>
				</div>
			</div>

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
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2 ml-0.5"
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
			<div className="flex-1 px-[22px] py-[22px] pb-10 max-sm:px-4">
				<EditorBody
					key={activePage}
					initialHtml={pages[activePage]?.html ?? ""}
					onContentChange={handleContentChange}
					onKeyDown={handleEditorKeyDown}
					placeholder={t("admin.texts.createPage.startTyping")}
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
