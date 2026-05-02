"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import {
	countCharsInHtml,
	countParagraphsInHtml,
	countWordsInHtml,
} from "../lib/html-utils";
import type { PageContent } from "../model/use-admin-text-edit-page";
import type { ProcessingStatus } from "@/entities/admin-text";

// ─── Editor body (remounts on activePage change via key prop) ───────────────

interface EditorBodyProps {
	initialHtml: string;
	onContentChange: (html: string) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	placeholder: string;
}

const EditorBody = ({ initialHtml, onContentChange, onKeyDown, placeholder }: EditorBodyProps) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.innerHTML = initialHtml || "";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

// ─── Toolbar button ──────────────────────────────────────────────────────────

const TbBtn = ({
	title,
	onExec,
	children,
}: {
	title: string;
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
		className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[5px] border-none bg-transparent text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
	>
		{children}
	</button>
);

// ─── Main editor column ──────────────────────────────────────────────────────

interface TextEditEditorProps {
	title: string;
	pages: PageContent[];
	activePage: number;
	processingStatus: ProcessingStatus;
	processingProgress: number;
	tokenCount: number;
	showRetokenizeBar: boolean;
	textId: string;
	onTitleChange: (value: string) => void;
	onPageContentChange: (html: string, wordCount: number) => void;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onSaveDraft: () => void;
	onSaveAndUpdate: () => void;
	onDismissRetokenize: () => void;
}

export const TextEditEditor = ({
	title,
	pages,
	activePage,
	processingStatus,
	processingProgress,
	tokenCount,
	showRetokenizeBar,
	textId,
	onTitleChange,
	onPageContentChange,
	onAddPage,
	onSelectPage,
	onSaveDraft,
	onSaveAndUpdate,
	onDismissRetokenize,
}: TextEditEditorProps) => {
	const { t, lang } = useI18n();
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });

	const handleContentChange = useCallback(
		(html: string) => {
			const wc = countWordsInHtml(html);
			onPageContentChange(html, wc);
			setStats({
				words: wc,
				chars: countCharsInHtml(html),
				paragraphs: countParagraphsInHtml(html),
			});
		},
		[onPageContentChange],
	);

	const handleEditorKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				onSaveDraft();
			}
			if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
				e.preventDefault();
				onSaveAndUpdate();
			}
		},
		[onSaveDraft, onSaveAndUpdate],
	);

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

	const exec = (command: string, value?: string) => {
		document.execCommand(command, false, value ?? undefined);
	};

	const titleLen = title.length;
	const titleWarn = titleLen > 160;

	// ── Tokenization status bar ──────────────────────────────────────────────
	const renderTokenBar = () => {
		if (processingStatus === "RUNNING") {
			return (
				<div className="flex items-center gap-2 border-b border-bd-1 bg-acc-muted px-6 py-2 transition-colors">
					<span className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-acc border-t-transparent" />
					<span className="flex-1 text-[11.5px] text-acc-strong">
						{t("admin.texts.editPage.tokenBar.running")} {processingProgress > 0 ? `${processingProgress}%` : ""}
					</span>
				</div>
			);
		}
		if (processingStatus === "ERROR") {
			return (
				<div className="flex items-center gap-2 border-b border-red/10 bg-red-muted px-6 py-2 transition-colors">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-red">
						<path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
						<path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						<circle cx="8" cy="11" r=".7" fill="currentColor" />
					</svg>
					<span className="flex-1 text-[11.5px] text-red-strong">
						{t("admin.texts.editPage.tokenBar.error")}
					</span>
				</div>
			);
		}
		if (processingStatus === "COMPLETED" && tokenCount > 0) {
			return (
				<div className="flex items-center gap-2 border-b border-bd-1 bg-grn-muted px-6 py-2 transition-colors">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-grn">
						<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
						<path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span className="flex-1 text-[11.5px] text-grn-strong">
						{t("admin.texts.editPage.tokenBar.done", {
							pages: pages.length,
							tokens: tokenCount,
						})}
					</span>
					<a
						href={`/${lang}/admin/texts/${textId}/versions`}
						className="shrink-0 text-[11px] font-medium text-acc transition-opacity hover:opacity-75"
					>
						{t("admin.texts.editPage.tokenBar.versions")} →
					</a>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="flex min-w-0 flex-col border-r border-bd-1 max-[900px]:border-r-0">
			{/* ── Tokenization status bar ── */}
			{renderTokenBar()}

			{/* ── Re-tokenize warning bar ── */}
			{showRetokenizeBar && (
				<div className="flex items-center gap-2 border-b border-amb/15 bg-amb-muted px-6 py-2 transition-colors">
					<svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 text-amb">
						<path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
						<path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						<circle cx="8" cy="11" r=".7" fill="currentColor" />
					</svg>
					<span className="flex-1 text-[11.5px] text-amb-strong">
						{t("admin.texts.editPage.retokenizeBar.text")}
					</span>
					<button
						type="button"
						onClick={onDismissRetokenize}
						className="shrink-0 rounded-[4px] px-1.5 py-0.5 text-[11px] text-t-3 transition-colors hover:bg-surf-3"
					>
						✕
					</button>
				</div>
			)}

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
			<div className="sticky top-[52px] z-10 flex items-center gap-px overflow-x-auto border-b border-bd-1 bg-surf px-2 py-[5px] transition-colors [scrollbar-width:none]">
				<div className="shrink-0">
					<select
						className="h-7 cursor-pointer appearance-none rounded-[5px] border-none bg-transparent px-2 pr-5 text-xs text-t-2 outline-none transition-colors hover:bg-surf-2 hover:text-t-1"
						defaultValue="p"
						onChange={(e) => {
							exec("formatBlock", e.target.value);
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

				<div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2 text-[10px] text-t-4 max-md:hidden">
					<span className="rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+S</span>
					<span>—</span>
					<span>{t("admin.texts.editPage.saveDraft")}</span>
					<span className="ml-1 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+↵</span>
					<span>—</span>
					<span>{t("admin.texts.editPage.saveUpdate")}</span>
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
					className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</button>

				<div className="ml-auto shrink-0 pl-2 text-[11px] text-t-3">
					{tokenCount > 0
						? t("admin.texts.editPage.pagesTokens", { n: pages.length, tokens: tokenCount })
						: t("admin.texts.createPage.pages", { n: pages.length })}
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
