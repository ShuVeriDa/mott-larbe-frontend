"use client";

import type { ProcessingStatus } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import type {
	Editor,
	SlashMenuItem,
	TipTapDoc,
} from "@/shared/ui/notion-editor";
import { NotionEditor } from "@/shared/ui/notion-editor";
import { useCallback, useMemo, useRef, useState } from "react";
import { countChars, countParagraphs, countWords } from "../lib/tiptap-utils";
import type { PageContent } from "../model/use-admin-text-edit-page";

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
}) => {
  const handleMouseDown: NonNullable<React.ComponentProps<"button">["onMouseDown"]> = e => {
			e.preventDefault();
			onExec();
		};
  return (
	<button
		type="button"
		title={title}
		onMouseDown={handleMouseDown}
		className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[5px] transition-all duration-100 ${
			active
				? "bg-[#2783de]/10 text-[#2783de]"
				: "text-t-2 hover:bg-surf-2 hover:text-t-1 active:scale-95"
		}`}
	>
		{children}
	</button>
);
};

const TbDivider = () => <div className="mx-0.5 h-4 w-px shrink-0 bg-bd-2" />;

// ── Toolbar ───────────────────────────────────────────────────────────────────

const EditorToolbar = ({
	editor,
	t,
}: {
	editor: Editor | null;
	t: ReturnType<typeof useI18n>["t"];
}) => {
	const [, forceUpdate] = useState(0);
	useMemo(() => {
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

		const handleChange: NonNullable<React.ComponentProps<"select">["onChange"]> = ev => {
						if (!e) return;
						const v = ev.target.value;
						if (v === "p") e.chain().focus().setParagraph().run();
						else if (v === "h2")
							e.chain().focus().setHeading({ level: 2 }).run();
						else if (v === "h3")
							e.chain().focus().setHeading({ level: 3 }).run();
						else if (v === "blockquote")
							e.chain().focus().setBlockquote().run();
					};
	const handleExec: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().toggleBold().run();
	const handleExec2: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().toggleItalic().run();
	const handleExec3: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().toggleUnderline().run();
	const handleExec4: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().toggleStrike().run();
	const handleExec5: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().toggleBulletList().run();
	const handleExec6: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().toggleOrderedList().run();
	const handleExec7: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().setTextAlign("left").run();
	const handleExec8: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().setTextAlign("center").run();
	const handleExec9: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().setTextAlign("right").run();
	const handleExec10: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().setTextAlign("justify").run();
	const handleExec11: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().undo().run();
	const handleExec12: NonNullable<React.ComponentProps<typeof TbBtn>["onExec"]> = () => e?.chain().focus().redo().run();
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
					onChange={handleChange}
				>
					<option value="p">{t("admin.texts.createPage.formatText")}</option>
					<option value="h2">{t("admin.texts.createPage.formatH2")}</option>
					<option value="h3">{t("admin.texts.createPage.formatH3")}</option>
					<option value="blockquote">
						{t("admin.texts.createPage.formatQuote")}
					</option>
				</select>
			</div>

			<TbDivider />

			<TbBtn
				title={t("admin.texts.createPage.bold")}
				active={e?.isActive("bold")}
				onExec={handleExec}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M4 8h5.5a2.5 2.5 0 000-5H4v5zM4 8h6a2.5 2.5 0 010 5H4V8z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title={t("admin.texts.createPage.italic")}
				active={e?.isActive("italic")}
				onExec={handleExec2}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M10 3H7M9 13H6M9 3L7 13"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title={t("admin.texts.createPage.underline")}
				active={e?.isActive("underline")}
				onExec={handleExec3}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M5 3v5a3 3 0 006 0V3M3 13h10"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title="Strike"
				active={e?.isActive("strike")}
				onExec={handleExec4}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M3 8h10"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
					/>
					<path
						d="M5.5 5.5C5.5 4.12 6.62 3 8 3s2.5 1.12 2.5 2.5M5.5 10.5C5.5 11.88 6.62 13 8 13s2.5-1.12 2.5-2.5"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>

			<TbDivider />

			<TbBtn
				title={t("admin.texts.createPage.bulletList")}
				active={e?.isActive("bulletList")}
				onExec={handleExec5}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<circle cx="3" cy="5" r="1.2" fill="currentColor" />
					<circle cx="3" cy="9" r="1.2" fill="currentColor" />
					<circle cx="3" cy="13" r="1.2" fill="currentColor" />
					<path
						d="M6.5 5h7M6.5 9h7M6.5 13h7"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title={t("admin.texts.createPage.orderedList")}
				active={e?.isActive("orderedList")}
				onExec={handleExec6}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 3.5h1.5M2 3.5v2.5h1.5M2 9h1.5a.5.5 0 010 1H2"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M6.5 4.5h7M6.5 9h7M6.5 13h7"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>

			<TbDivider />

			<TbBtn
				title="По левому краю"
				active={e?.isActive({ textAlign: "left" })}
				onExec={handleExec7}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 4h12M2 7.5h8M2 11h10M2 14.5h6"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title="По центру"
				active={e?.isActive({ textAlign: "center" })}
				onExec={handleExec8}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 4h12M4 7.5h8M3 11h10M5 14.5h6"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title="По правому краю"
				active={e?.isActive({ textAlign: "right" })}
				onExec={handleExec9}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 4h12M6 7.5h8M4 11h10M8 14.5h6"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title="По ширине"
				active={e?.isActive({ textAlign: "justify" })}
				onExec={handleExec10}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 4h12M2 7.5h12M2 11h12M2 14.5h8"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
			</TbBtn>

			<TbDivider />

			<TbBtn
				title={t("admin.texts.createPage.undo")}
				onExec={handleExec11}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M3 7.5A5.5 5.5 0 1114 12"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
					<path
						d="M3 3.5v4h4"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</TbBtn>
			<TbBtn
				title={t("admin.texts.createPage.redo")}
				onExec={handleExec12}
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path
						d="M13 7.5A5.5 5.5 0 102 12"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
					<path
						d="M13 3.5v4H9"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</TbBtn>

			<div className="ml-auto flex shrink-0 items-center gap-1.5 pl-2 text-[10px] text-t-4 max-lg:hidden">
				<span className="rounded-[3px] bg-surf-3 px-1 py-px text-t-3">
					Ctrl+S
				</span>
				<span>—</span>
				<span>{t("admin.texts.editPage.saveDraft")}</span>
				<span className="ml-1 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">
					Ctrl+↵
				</span>
				<span>—</span>
				<span>{t("admin.texts.editPage.saveUpdate")}</span>
				<span className="ml-2 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">
					/
				</span>
				<span>—</span>
				<span>блоки</span>
			</div>
		</div>
	);
};

const CHECHEN_CHARS = [
	"Ӏ",
	"гӀ",
	"ГӀ",
	"кх",
	"КХ",
	"нх",
	"НХ",
	"хь",
	"Хь",
	"цх",
	"ЦХ",
	"чх",
	"ЧХ",
];

// ── Slash items ───────────────────────────────────────────────────────────────

const useSlashItems = (t: ReturnType<typeof useI18n>["t"]): SlashMenuItem[] =>
	useMemo(
		() => [
			{
				title: t("admin.texts.createPage.formatText"),
				description: "Обычный абзац",
				icon: <span className="text-[11px] font-medium text-t-2">¶</span>,
				command: editor => editor.chain().focus().setParagraph().run(),
			},
			{
				title: t("admin.texts.createPage.formatH2"),
				description: "Крупный заголовок",
				icon: <span className="text-[11px] font-bold text-t-2">H2</span>,
				command: editor =>
					editor.chain().focus().setHeading({ level: 2 }).run(),
			},
			{
				title: t("admin.texts.createPage.formatH3"),
				description: "Средний заголовок",
				icon: <span className="text-[10px] font-bold text-t-2">H3</span>,
				command: editor =>
					editor.chain().focus().setHeading({ level: 3 }).run(),
			},
			{
				title: t("admin.texts.createPage.formatQuote"),
				description: "Цитата",
				icon: <span className="text-[13px] text-t-2">&quot;</span>,
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
						<path
							d="M7 5h7M7 9h7M7 13h7"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
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
						<path
							d="M6.5 4.5h7M6.5 9h7M6.5 13h7"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
					</svg>
				),
				command: editor => editor.chain().focus().toggleOrderedList().run(),
			},
		],
		[t],
	);

// ── Chechen chars popup (appears in BubbleMenu as extra item) ─────────────────

const CharsPopup = ({ onInsert }: { onInsert: (char: string) => void }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const { t } = useI18n();

		const handleMouseDown: NonNullable<React.ComponentProps<"button">["onMouseDown"]> = e => {
					e.preventDefault();
					setOpen(v => !v);
				};
return (
		<div ref={ref} className="relative">
			<button
				type="button"
				title={t("admin.texts.editPage.specialChars")}
				onMouseDown={handleMouseDown}
				className="flex h-7 items-center gap-1 rounded-[5px] px-1.5 text-[11px] font-semibold text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
			>
				Ӏ
			</button>
			{open && (
				<div
					className="absolute bottom-full left-0 z-30 mb-2 flex flex-wrap gap-1 rounded-[8px] border border-bd-2 bg-bg p-2 shadow-md"
					style={{ width: "192px" }}
				>
					{CHECHEN_CHARS.map(ch => {
					  const handleMouseDown: NonNullable<React.ComponentProps<"button">["onMouseDown"]> = e => {
								e.preventDefault();
								onInsert(ch);
								setOpen(false);
							};
					  return (
						<button
							key={ch}
							type="button"
							onMouseDown={handleMouseDown}
							className="flex h-7 min-w-[40px] items-center justify-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[12px] font-medium text-t-1 transition-colors hover:border-acc hover:bg-acc-muted hover:text-acc-strong"
						>
							{ch}
						</button>
					);
					})}
				</div>
			)}
		</div>
	);
};

// ── Main component ────────────────────────────────────────────────────────────

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
	onPageContentChange: (doc: TipTapDoc, wordCount: number) => void;
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
	const [editor, setEditor] = useState<Editor | null>(null);
	const editorRef = useRef<Editor | null>(null);
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
			setStats({
				words: wc,
				chars: countChars(doc),
				paragraphs: countParagraphs(doc),
			});
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
				onSaveAndUpdate();
				return true;
			}
			return false;
		},
		[onSaveDraft, onSaveAndUpdate],
	);

	const extraToolbarItems = useMemo(
		() => {
		  const handleInsert: NonNullable<React.ComponentProps<typeof CharsPopup>["onInsert"]> = char =>
					editorRef.current?.chain().focus().insertContent(char).run();
		  return (
			<CharsPopup
				onInsert={handleInsert
				}
			/>
		);
		},
		[],
	);

	const titleLen = title.length;
	const titleWarn = titleLen > 160;

	// ── Token status bar ──────────────────────────────────────────────────────
	const renderTokenBar = () => {
		if (processingStatus === "RUNNING") {
			return (
				<div className="flex items-center gap-2 border-b border-bd-1 bg-acc-muted px-6 py-2 transition-colors">
					<span className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-acc border-t-transparent" />
					<span className="flex-1 text-[11.5px] text-acc-strong">
						{t("admin.texts.editPage.tokenBar.running")}{" "}
						{processingProgress > 0 ? `${processingProgress}%` : ""}
					</span>
				</div>
			);
		}
		if (processingStatus === "ERROR") {
			return (
				<div className="flex items-center gap-2 border-b border-red/10 bg-red-muted px-6 py-2 transition-colors">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						className="shrink-0 text-red"
					>
						<path
							d="M8 2L14.5 13H1.5L8 2z"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinejoin="round"
						/>
						<path
							d="M8 6.5v3"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
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
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						className="shrink-0 text-grn"
					>
						<circle
							cx="8"
							cy="8"
							r="6"
							stroke="currentColor"
							strokeWidth="1.3"
						/>
						<path
							d="M5 8l2.5 2.5L11 5.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
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

		const handleEditorReady: NonNullable<React.ComponentProps<typeof NotionEditor>["onEditorReady"]> = ed => {
						editorRef.current = ed;
						setEditor(ed);
					};
return (
		<div className="flex min-w-0 flex-col border-r border-bd-1 max-[900px]:border-r-0">
			{renderTokenBar()}

			{/* ── Re-tokenize warning bar ── */}
			{showRetokenizeBar && (
				<div className="flex items-center gap-2 border-b border-amb/15 bg-amb-muted px-6 py-2 transition-colors">
					<svg
						width="15"
						height="15"
						viewBox="0 0 16 16"
						fill="none"
						className="shrink-0 text-amb"
					>
						<path
							d="M8 2L14.5 13H1.5L8 2z"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinejoin="round"
						/>
						<path
							d="M8 6.5v3"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
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

			{/* ── Toolbar ── */}
			<EditorToolbar editor={editor} t={t} />

			{/* ── Pages bar ── */}
			<div className="sticky top-[52px] z-10 flex items-center overflow-x-auto border-b border-bd-1 bg-surf px-3.5 transition-colors [scrollbar-width:none]">
				{pages.map((_, i) => {
				  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onSelectPage(i);
				  return (
					<div
						key={i}
						className={`group/tab flex h-9 shrink-0 items-center gap-1 border-b-2 pl-3 pr-1.5 transition-colors ${
							i === activePage
								? "border-acc text-acc-strong"
								: "border-transparent text-t-3 hover:text-t-2"
						}`}
					>
						<button
							type="button"
							onClick={handleClick}
							className="flex items-center gap-1.5 text-xs"
						>
							<span
								className={`flex h-[17px] w-[17px] items-center justify-center rounded-[4px] text-[10px] font-semibold ${
									i === activePage
										? "bg-acc-muted text-acc-strong"
										: "bg-surf-3 text-t-3"
								}`}
							>
								{i + 1}
							</span>
							{t("admin.texts.createPage.pageN", { n: i + 1 })}
						</button>
					</div>
				);
				})}

				<button
					type="button"
					title={t("admin.texts.createPage.addPage")}
					onClick={onAddPage}
					className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path
							d="M8 3v10M3 8h10"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</button>

				<div className="ml-auto shrink-0 pl-2 text-[11px] text-t-3">
					{tokenCount > 0
						? t("admin.texts.editPage.pagesTokens", {
								n: pages.length,
								tokens: tokenCount,
							})
						: t("admin.texts.createPage.pages", { n: pages.length })}
				</div>
			</div>

			{/* ── Editor body ── */}
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
					extraToolbarItems={extraToolbarItems}
					onUpdate={handleUpdate}
					onKeyDown={handleKeyDown}
					onEditorReady={handleEditorReady}
				/>
			</div>

			{/* ── Editor footer ── */}
			<div className="flex flex-wrap items-center gap-3 border-t border-bd-1 bg-surf-2 px-[22px] py-[7px] text-[11px] text-t-3 transition-colors max-sm:px-4">
				<div className="flex items-center gap-1">
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path
							d="M2 4h12M2 7.5h8M2 11h5"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
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
