"use client";

import { useI18n } from "@/shared/lib/i18n";
import { EditorToolbar, getSlashItems } from "@/shared/ui/admin-text-editor";
import { Button } from "@/shared/ui/button";
import { AlignLeft, X, Plus } from "lucide-react";
import type { TipTapDoc, TipTapNode } from "@/shared/ui/notion-editor";
import { NotionEditor } from "@/shared/ui/notion-editor";
import { Typography } from "@/shared/ui/typography";
import {
	type ChangeEvent,
	type ComponentProps,
	type MouseEvent,
	useRef,
	useState,
} from "react";
import type { PageContent } from "../model/use-admin-text-create-page";

export type { TipTapDoc, TipTapNode };

// ── Stats helpers ─────────────────────────────────────────────────────────────

const extractText = (doc: TipTapDoc): string => {
	const walk = (nodes: TipTapNode[]): string =>
		nodes.map(n => (n.text ? n.text : walk(n.content ?? []))).join(" ");
	return walk(doc.content);
};

const countWords = (doc: TipTapDoc) => {
	const text = extractText(doc).trim();
	return text ? text.split(/\s+/).filter(Boolean).length : 0;
};
const countChars = (doc: TipTapDoc) =>
	extractText(doc).replace(/\s/g, "").length;
const countParagraphs = (doc: TipTapDoc) => {
	const blockTypes = new Set(["paragraph", "heading", "listItem"]);
	const walk = (nodes: TipTapNode[]): number =>
		nodes.reduce(
			(acc, n) =>
				acc + (blockTypes.has(n.type) ? 1 : 0) + walk(n.content ?? []),
			0,
		);
	return Math.max(walk(doc.content), 1);
};

// ── Sub-components ────────────────────────────────────────────────────────────

const EditorFooter = ({
	stats,
	t,
}: {
	stats: { words: number; chars: number; paragraphs: number };
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<div className="flex flex-wrap items-center gap-3 border-t border-bd-1 bg-surf-2 px-[22px] py-[7px] text-[11px] text-t-3 transition-colors max-sm:px-4">
		<div className="flex items-center gap-1">
			<AlignLeft className="size-3" />
			{t("admin.texts.createPage.words")}:&nbsp;
			<Typography tag="span" className="font-medium text-t-2">
				{stats.words}
			</Typography>
		</div>
		<div className="h-3 w-px bg-bd-2" />
		<div>
			{t("admin.texts.createPage.chars")}:&nbsp;
			<Typography tag="span" className="font-medium text-t-2">
				{stats.chars}
			</Typography>
		</div>
		<div className="h-3 w-px bg-bd-2 max-sm:hidden" />
		<div className="max-sm:hidden">
			{t("admin.texts.createPage.paragraphs")}:&nbsp;
			<Typography tag="span" className="font-medium text-t-2">
				{stats.paragraphs}
			</Typography>
		</div>
	</div>
);

const DeletePageDialog = ({
	pageIndex,
	onConfirm,
	onCancel,
	t,
}: {
	pageIndex: number;
	onConfirm: () => void;
	onCancel: () => void;
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
		<div className="mx-4 w-full max-w-sm rounded-xl border border-bd-1 bg-surf p-6 shadow-xl">
			<Typography tag="h2" className="text-base font-semibold text-t-1">
				{t("admin.texts.createPage.deletePageTitle")}
			</Typography>
			<Typography tag="p" className="mt-2 text-sm text-t-3">
				{t("admin.texts.createPage.deletePageBody", { n: pageIndex + 1 })}
			</Typography>
			<div className="mt-5 flex justify-end gap-2">
				<Button
					onClick={onCancel}
					className="rounded-lg border border-bd-1 px-4 py-1.5 text-sm text-t-2 transition-colors hover:bg-surf-2"
				>
					{t("admin.texts.createPage.deletePageCancel")}
				</Button>
				<Button
					onClick={onConfirm}
					className="rounded-lg bg-red px-4 py-1.5 text-sm text-white transition-opacity hover:opacity-80"
				>
					{t("admin.texts.createPage.deletePageConfirm")}
				</Button>
			</div>
		</div>
	</div>
);

// ── Main component ────────────────────────────────────────────────────────────

interface TextCreateEditorProps {
	title: string;
	pages: PageContent[];
	activePage: number;
	onTitleChange: (value: string) => void;
	onPageContentChange: (doc: TipTapDoc, wordCount: number) => void;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onDeletePage: (index: number) => void;
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
	onDeletePage,
	onSaveDraft,
	onPublish,
}: TextCreateEditorProps) => {
	const { t } = useI18n();
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });
	const [editor, setEditor] = useState<
		import("@/shared/ui/notion-editor").Editor | null
	>(null);
	const slashItems = getSlashItems(t);
	const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
		null,
	);

	const handlePageCloseClick = (e: MouseEvent, index: number) => {
		e.stopPropagation();
		const hasContent = extractText(pages[index].doc).trim().length > 0;
		if (hasContent) {
			setConfirmDeleteIndex(index);
		} else {
			onDeletePage(index);
		}
	};

	const handleConfirmDelete = () => {
		if (confirmDeleteIndex !== null) {
			onDeletePage(confirmDeleteIndex);
			setConfirmDeleteIndex(null);
		}
	};

	const handleCancelDelete = () => setConfirmDeleteIndex(null);

	const adjustTitleHeight = () => {
		if (titleRef.current) {
			titleRef.current.style.height = "auto";
			titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
		}
	};

	const handleTitleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onTitleChange(e.currentTarget.value);
		adjustTitleHeight();
	};

	const handleUpdate = (doc: TipTapDoc) => {
		const wc = countWords(doc);
		onPageContentChange(doc, wc);
		setStats({
			words: wc,
			chars: countChars(doc),
			paragraphs: countParagraphs(doc),
		});
	};

	const handleKeyDown = (event: KeyboardEvent) => {
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
	};

	const titleLen = title.length;
	const titleWarn = titleLen > 160;

	const keyboardHints = (
		<>
			<Typography
				tag="span"
				className="rounded-[3px] bg-surf-3 px-1 py-px text-t-3"
			>
				Ctrl+S
			</Typography>
			<Typography tag="span">—</Typography>
			<Typography tag="span">
				{t("admin.texts.createPage.saveDraft")}
			</Typography>
			<Typography
				tag="span"
				className="ml-1 rounded-[3px] bg-surf-3 px-1 py-px text-t-3"
			>
				Ctrl+↵
			</Typography>
			<Typography tag="span">—</Typography>
			<Typography tag="span">{t("admin.texts.createPage.publish")}</Typography>
			<Typography
				tag="span"
				className="ml-2 rounded-[3px] bg-surf-3 px-1 py-px text-t-3"
			>
				/
			</Typography>
			<Typography tag="span">—</Typography>
			<Typography tag="span">блоки</Typography>
		</>
	);

	return (
		<div className="flex min-w-0 flex-col border-r border-bd-1 max-[900px]:border-r-0">
			<div className="border-b border-bd-1 px-[22px] pt-5 max-sm:px-4 max-sm:pt-4 bg-surf">
				<textarea
					ref={titleRef}
					value={title}
					onChange={handleTitleInput}
					placeholder={t("admin.texts.createPage.titlePlaceholder")}
					rows={1}
					maxLength={200}
					className="w-full resize-none overflow-hidden border-none bg-transparent font-display text-[22px] font-normal leading-[1.35] text-t-1 outline-none placeholder:text-t-4 max-sm:text-[18px]"
				/>
				<div
					className={`pb-2.5 pt-1 text-right text-[10.5px] ${titleWarn ? "text-amb" : "text-t-4"}`}
				>
					{titleLen} / 200
				</div>
			</div>

			<EditorToolbar editor={editor} t={t} keyboardHints={keyboardHints} />

			<div className="sticky top-[93px] z-10 flex items-center overflow-x-auto border-b border-bd-1 bg-surf px-3.5 transition-colors [scrollbar-width:none]">
				{pages.map((_, i) => {
					const handleTabClick: NonNullable<
						ComponentProps<"button">["onClick"]
					> = () => onSelectPage(i);
					const handleCloseClick: NonNullable<
						ComponentProps<"button">["onClick"]
					> = e => handlePageCloseClick(e, i);
					return (
						<div
							key={i}
							className={`group/tab flex h-9 shrink-0 items-center gap-1 border-b-2 pl-3 pr-1.5 transition-colors ${
								i === activePage
									? "border-acc text-acc-strong"
									: "border-transparent text-t-3 hover:text-t-2"
							}`}
						>
							<Button
								onClick={handleTabClick}
								className="flex items-center gap-1.5 text-xs"
							>
								<Typography
									tag="span"
									className={`flex h-[17px] w-[17px] items-center justify-center rounded-[4px] text-[10px] font-semibold ${
										i === activePage
											? "bg-acc-muted text-acc-strong"
											: "bg-surf-3 text-t-3"
									}`}
								>
									{i + 1}
								</Typography>
								{t("admin.texts.createPage.pageN", { n: i + 1 })}
							</Button>
							{pages.length > 1 && (
								<Button
									title={t("admin.texts.createPage.deletePage")}
									onClick={handleCloseClick}
									className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] opacity-0 transition-opacity hover:bg-surf-3 group-hover/tab:opacity-100"
								>
									<X className="size-2" />
								</Button>
							)}
						</div>
					);
				})}

				<Button
					title={t("admin.texts.createPage.addPage")}
					onClick={onAddPage}
					className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
				>
					<Plus className="size-[14px]" />
				</Button>

				<div className="ml-auto shrink-0 pl-2 text-[11px] text-t-3">
					{t("admin.texts.createPage.pages", { n: pages.length })}
				</div>
			</div>

			<div className="group relative flex-1 px-[22px] py-[22px] pb-10 max-sm:px-4 bg-surf">
				<NotionEditor
					key={activePage}
					content={
						pages[activePage]?.doc ?? {
							type: "doc",
							content: [{ type: "paragraph" }],
						}
					}
					placeholder={t("admin.texts.createPage.startTyping")}
					slashMenuItems={slashItems}
					onUpdate={handleUpdate}
					onKeyDown={handleKeyDown}
					onEditorReady={setEditor}
				/>
			</div>

			{confirmDeleteIndex !== null && (
				<DeletePageDialog
					pageIndex={confirmDeleteIndex}
					onConfirm={handleConfirmDelete}
					onCancel={handleCancelDelete}
					t={t}
				/>
			)}

			<EditorFooter stats={stats} t={t} />
		</div>
	);
};
