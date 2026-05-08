"use client";

import Color from "@tiptap/extension-color";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import type { Editor } from "@tiptap/react";
import { Tiptap, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import type {
	SuggestionKeyDownProps,
	SuggestionProps,
} from "@tiptap/suggestion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SlashExtension } from "./slash-extension";
import type { SlashMenuHandle, SlashMenuItem } from "./slash-menu";
import { SlashMenu } from "./slash-menu";

// ── Types ────────────────────────────────────────────────────────────────────

export interface TipTapNode {
	type: string;
	text?: string;
	marks?: { type: string }[];
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
}

export interface TipTapDoc {
	type: "doc";
	content: TipTapNode[];
}

export interface NotionEditorProps {
	content: TipTapDoc;
	placeholder?: string;
	slashMenuItems: SlashMenuItem[];
	extraToolbarItems?: React.ReactNode;
	onUpdate: (doc: TipTapDoc) => void;
	onKeyDown?: (event: KeyboardEvent) => boolean;
	onEditorReady?: (editor: Editor) => void;
	minHeight?: string;
}

// ── Color palette ────────────────────────────────────────────────────────────

const TEXT_COLORS = [
	{ label: "Default", value: null, tw: "bg-t-1" },
	{ label: "Gray", value: "#6b6a62", tw: "bg-[#6b6a62]" },
	{ label: "Brown", value: "#7c4b2a", tw: "bg-[#7c4b2a]" },
	{ label: "Orange", value: "#d97706", tw: "bg-[#d97706]" },
	{ label: "Yellow", value: "#ca8a04", tw: "bg-[#ca8a04]" },
	{ label: "Green", value: "#1a9e52", tw: "bg-[#1a9e52]" },
	{ label: "Blue", value: "#2254d3", tw: "bg-[#2254d3]" },
	{ label: "Purple", value: "#6d4ed4", tw: "bg-[#6d4ed4]" },
	{ label: "Pink", value: "#db2777", tw: "bg-[#db2777]" },
	{ label: "Red", value: "#dc2626", tw: "bg-[#dc2626]" },
] as const;

const BG_COLORS = [
	{ label: "Default", value: null, tw: "bg-surf" },
	{ label: "Gray bg", value: "rgba(0,0,0,0.06)", tw: "bg-[rgba(0,0,0,0.06)]" },
	{
		label: "Brown bg",
		value: "rgba(124,75,42,0.12)",
		tw: "bg-[rgba(124,75,42,0.12)]",
	},
	{
		label: "Orange bg",
		value: "rgba(217,119,6,0.12)",
		tw: "bg-[rgba(217,119,6,0.12)]",
	},
	{
		label: "Yellow bg",
		value: "rgba(202,138,4,0.12)",
		tw: "bg-[rgba(202,138,4,0.12)]",
	},
	{
		label: "Green bg",
		value: "rgba(26,158,82,0.12)",
		tw: "bg-[rgba(26,158,82,0.12)]",
	},
	{
		label: "Blue bg",
		value: "rgba(34,84,211,0.12)",
		tw: "bg-[rgba(34,84,211,0.12)]",
	},
	{
		label: "Purple bg",
		value: "rgba(109,78,212,0.12)",
		tw: "bg-[rgba(109,78,212,0.12)]",
	},
	{
		label: "Pink bg",
		value: "rgba(219,39,119,0.12)",
		tw: "bg-[rgba(219,39,119,0.12)]",
	},
	{
		label: "Red bg",
		value: "rgba(220,38,38,0.12)",
		tw: "bg-[rgba(220,38,38,0.12)]",
	},
] as const;

// ── Small helpers ─────────────────────────────────────────────────────────────

const Sep = () => <div className="mx-1 h-[18px] w-px shrink-0 bg-bd-2" />;

const Btn = ({
	active,
	onExec,
	title,
	children,
	wide,
}: {
	active?: boolean;
	onExec: () => void;
	title: string;
	children: React.ReactNode;
	wide?: boolean;
}) => (
	<button
		type="button"
		title={title}
		onMouseDown={(e) => { e.preventDefault(); onExec(); }}
		className={`flex shrink-0 items-center justify-center gap-1 rounded-[6px] text-[12px] font-medium transition-all duration-100 select-none
			${wide ? "h-7 px-2" : "h-7 w-7"}
			${active
				? "bg-[#2783de]/10 text-[#2783de]"
				: "text-t-2 hover:bg-surf-3 hover:text-t-1 active:scale-95"
			}`}
	>
		{children}
	</button>
);

// ── Block type dropdown ───────────────────────────────────────────────────────

const BLOCK_TYPES = [
	{ value: "p",          label: "Text",      shortLabel: "Text" },
	{ value: "h1",         label: "Heading 1", shortLabel: "H1" },
	{ value: "h2",         label: "Heading 2", shortLabel: "H2" },
	{ value: "h3",         label: "Heading 3", shortLabel: "H3" },
	{ value: "h4",         label: "Heading 4", shortLabel: "H4" },
	{ value: "blockquote", label: "Quote",     shortLabel: "Quote" },
] as const;

const BlockTypeDropdown = ({ editor }: { editor: Editor }) => {
	const [anchor, setAnchor] = useState<DOMRect | null>(null);
	const open = anchor !== null;

	const current =
		editor.isActive("heading", { level: 1 }) ? "h1" :
		editor.isActive("heading", { level: 2 }) ? "h2" :
		editor.isActive("heading", { level: 3 }) ? "h3" :
		editor.isActive("heading", { level: 4 }) ? "h4" :
		editor.isActive("blockquote") ? "blockquote" : "p";

	const currentLabel = BLOCK_TYPES.find(b => b.value === current)?.shortLabel ?? "Text";

	const apply = (v: string) => {
		if (v === "p") editor.chain().focus().setParagraph().run();
		else if (v === "h1") editor.chain().focus().setHeading({ level: 1 }).run();
		else if (v === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
		else if (v === "h3") editor.chain().focus().setHeading({ level: 3 }).run();
		else if (v === "h4") editor.chain().focus().setHeading({ level: 4 }).run();
		else if (v === "blockquote") editor.chain().focus().setBlockquote().run();
		setAnchor(null);
	};

	return (
		<div className="relative">
			<button
				type="button"
				onMouseDown={(e) => {
					e.preventDefault();
					const rect = e.currentTarget.getBoundingClientRect();
					setAnchor(prev => prev ? null : rect);
				}}
				className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 select-none"
			>
				{currentLabel}
				<svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-50">
					<path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>
			{open && anchor && createPortal(
				<>
					<div className="fixed inset-0 z-[9998]" onMouseDown={() => setAnchor(null)} />
					<div
						className="fixed z-[9999] min-w-[140px] overflow-hidden rounded-[10px] border border-bd-2 bg-surf p-1 shadow-lg"
						style={{
							top: anchor.bottom + 6,
							left: anchor.left,
						}}
					>
						{BLOCK_TYPES.map(b => (
							<button
								key={b.value}
								type="button"
								onMouseDown={(e) => { e.preventDefault(); apply(b.value); }}
								className={`flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-1.5 text-left text-[12.5px] transition-colors
									${current === b.value ? "bg-acc-muted text-acc-strong font-medium" : "text-t-1 hover:bg-surf-2"}`}
							>
								<span className="w-6 text-center text-[11px] font-semibold text-t-3">
									{b.shortLabel}
								</span>
								{b.label}
								{current === b.value && (
									<svg className="ml-auto" width="12" height="12" viewBox="0 0 12 12" fill="none">
										<path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								)}
							</button>
						))}
					</div>
				</>,
				document.body,
			)}
		</div>
	);
};

// ── Color picker panel ────────────────────────────────────────────────────────

const ColorPanel = ({
	editor,
	onClose,
}: {
	editor: Editor;
	onClose: () => void;
}) => {
	const [tab, setTab] = useState<"text" | "bg">("text");

	const activeTextColor =
		TEXT_COLORS.find(c => c.value && editor.isActive("textStyle", { color: c.value }))?.value ?? null;
	const activeHighlight =
		BG_COLORS.find(c => c.value && editor.isActive("highlight", { color: c.value }))?.value ?? null;

	return (
		<div
			className="w-[212px] overflow-hidden rounded-[12px] border border-bd-2 bg-surf shadow-lg"
			onMouseDown={(e) => e.preventDefault()}
		>
			{/* Tabs */}
			<div className="flex border-b border-bd-1">
				{(["text", "bg"] as const).map(t => (
					<button
						key={t}
						type="button"
						onMouseDown={(e) => { e.preventDefault(); setTab(t); }}
						className={`flex-1 py-2 text-[11.5px] font-medium transition-colors
							${tab === t ? "text-t-1 border-b-2 border-acc -mb-px" : "text-t-3 hover:text-t-2"}`}
					>
						{t === "text" ? "Text color" : "Background"}
					</button>
				))}
			</div>

			<div className="p-2.5">
				{tab === "text" ? (
					<div className="grid grid-cols-5 gap-1.5">
						{TEXT_COLORS.map(c => {
							const isActive = c.value === null ? activeTextColor === null : activeTextColor === c.value;
							return (
								<button
									key={c.label}
									type="button"
									title={c.label}
									onMouseDown={(e) => {
										e.preventDefault();
										c.value === null
											? editor.chain().focus().unsetColor().run()
											: editor.chain().focus().setColor(c.value).run();
										onClose();
									}}
									className={`relative flex h-[34px] w-full flex-col items-center justify-center gap-0.5 rounded-[7px] transition-all
										${isActive ? "bg-surf-3 ring-1.5 ring-acc" : "hover:bg-surf-2"}`}
								>
									<span
										className="text-[13px] font-bold leading-none"
										style={{ color: c.value ?? "var(--t-1)" }}
									>
										A
									</span>
									<span
										className="h-[3px] w-[14px] rounded-full"
										style={{ background: c.value ?? "var(--t-1)" }}
									/>
									{isActive && (
										<span className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-acc">
											<svg width="6" height="5" viewBox="0 0 6 5" fill="none">
												<path d="M1 2.5l1.5 1.5 2.5-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
									)}
								</button>
							);
						})}
					</div>
				) : (
					<div className="grid grid-cols-5 gap-1.5">
						{BG_COLORS.map(c => {
							const isActive = c.value === null ? activeHighlight === null : activeHighlight === c.value;
							return (
								<button
									key={c.label}
									type="button"
									title={c.label}
									onMouseDown={(e) => {
										e.preventDefault();
										c.value === null
											? editor.chain().focus().unsetHighlight().run()
											: editor.chain().focus().setHighlight({ color: c.value }).run();
										onClose();
									}}
									className={`relative flex h-[34px] w-full items-center justify-center rounded-[7px] border transition-all
										${isActive ? "border-acc ring-1.5 ring-acc" : "border-bd-1 hover:border-bd-2 hover:bg-surf-2"}`}
									style={{ background: c.value ?? undefined }}
								>
									{c.value === null && (
										<svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-t-3">
											<path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
										</svg>
									)}
									{isActive && (
										<span className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-acc">
											<svg width="6" height="5" viewBox="0 0 6 5" fill="none">
												<path d="M1 2.5l1.5 1.5 2.5-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
									)}
								</button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

// ── Slash portal state ────────────────────────────────────────────────────────

interface SlashPortalState {
	items: SlashMenuItem[];
	rect: DOMRect;
	command: (item: SlashMenuItem) => void;
}

// ── BubbleMenu content ───────────────────────────────────────────────────────

const BubbleMenuContent = ({
	editor,
	extraToolbarItems,
}: {
	editor: Editor;
	extraToolbarItems?: React.ReactNode;
}) => {
	const [colorOpen, setColorOpen] = useState(false);
	const [colorAnchor, setColorAnchor] = useState<DOMRect | null>(null);
	const colorBtnRef = useRef<HTMLButtonElement>(null);

	const activeTextColor = TEXT_COLORS.find(
		c => c.value && editor.isActive("textStyle", { color: c.value }),
	);
	const activeHighlight = BG_COLORS.find(
		c => c.value && editor.isActive("highlight", { color: c.value }),
	);

	const toggleColor = () => {
		const rect = colorBtnRef.current?.getBoundingClientRect() ?? null;
		setColorAnchor(rect);
		setColorOpen(v => !v);
	};

	return (
		<>
			{/* ── Main toolbar ── */}
			<div className="flex items-center gap-0.5 rounded-[11px] border border-bd-2 bg-surf px-1.5 py-1.5 shadow-lg backdrop-blur-sm">
				<BlockTypeDropdown editor={editor} />
				<Sep />
				<Btn title="Bold" active={editor.isActive("bold")} onExec={() => editor.chain().focus().toggleBold().run()}>
					<svg width="13" height="14" viewBox="0 0 14 16" fill="none">
						<path d="M3.5 8h5a2.5 2.5 0 000-5h-5v5zM3.5 8h5.5a2.5 2.5 0 010 5H3.5V8z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</Btn>
				<Btn title="Italic" active={editor.isActive("italic")} onExec={() => editor.chain().focus().toggleItalic().run()}>
					<svg width="11" height="14" viewBox="0 0 11 16" fill="none">
						<path d="M9 2H5.5M5.5 14H2M7 2L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
					</svg>
				</Btn>
				<Btn title="Underline" active={editor.isActive("underline")} onExec={() => editor.chain().focus().toggleUnderline().run()}>
					<svg width="13" height="14" viewBox="0 0 14 16" fill="none">
						<path d="M2 14h10M3.5 2v5.5a3.5 3.5 0 007 0V2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
					</svg>
				</Btn>
				<Btn title="Strikethrough" active={editor.isActive("strike")} onExec={() => editor.chain().focus().toggleStrike().run()}>
					<svg width="13" height="13" viewBox="0 0 14 14" fill="none">
						<path d="M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
						<path d="M4.5 4.5C4.5 3.12 5.62 2 7 2s2.5 1.12 2.5 2.5M4.5 9.5C4.5 10.88 5.62 12 7 12s2.5-1.12 2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					</svg>
				</Btn>
				<Btn title="Code" active={editor.isActive("code")} onExec={() => editor.chain().focus().toggleCode().run()}>
					<svg width="14" height="13" viewBox="0 0 16 14" fill="none">
						<path d="M5 1.5L1 7l4 5.5M11 1.5L15 7l-4 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
				</Btn>
				<Sep />
				{/* Color button — shows colored underbar like Notion */}
				<button
					ref={colorBtnRef}
					type="button"
					title="Color"
					onMouseDown={(e) => { e.preventDefault(); toggleColor(); }}
					className={`flex h-7 w-8 shrink-0 flex-col items-center justify-center gap-px rounded-[6px] transition-all select-none
						${colorOpen ? "bg-acc text-white" : "text-t-2 hover:bg-surf-3 hover:text-t-1 active:scale-95"}`}
				>
					<span className="text-[13px] font-bold leading-none">A</span>
					<span
						className="h-[3px] w-[14px] rounded-full transition-colors"
						style={{
							background: colorOpen
								? "white"
								: activeTextColor?.value ?? activeHighlight?.value ?? "var(--t-3)",
						}}
					/>
				</button>
				{extraToolbarItems && (
					<>
						<Sep />
						{extraToolbarItems}
					</>
				)}
			</div>

			{/* ── Color picker portal ── */}
			{colorOpen && colorAnchor && createPortal(
				<>
					<div className="fixed inset-0 z-[9998]" onMouseDown={() => setColorOpen(false)} />
					<div
						className="fixed z-[9999]"
						style={{ top: colorAnchor.bottom + 6, left: colorAnchor.left }}
					>
						<ColorPanel editor={editor} onClose={() => setColorOpen(false)} />
					</div>
				</>,
				document.body,
			)}
		</>
	);
};

// ── Main component ───────────────────────────────────────────────────────────

export const NotionEditor = ({
	content,
	placeholder,
	slashMenuItems,
	extraToolbarItems,
	onUpdate,
	onKeyDown,
	onEditorReady,
	minHeight = "360px",
}: NotionEditorProps) => {
	const swappingRef = useRef(false);
	const slashMenuRef = useRef<SlashMenuHandle>(null);
	const [slashPortal, setSlashPortal] = useState<SlashPortalState | null>(null);

	const hideSlash = useCallback(() => setSlashPortal(null), []);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
			Underline,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			TextStyle,
			Color,
			Highlight.configure({ multicolor: true }),
			Placeholder.configure({ placeholder }),
			SlashExtension.configure({
				suggestion: {
					char: "/",
					items: ({ query }: { query: string }) => {
						if (!query) return slashMenuItems;
						const q = query.toLowerCase();
						return slashMenuItems.filter(
							item =>
								item.title.toLowerCase().includes(q) ||
								item.description.toLowerCase().includes(q),
						);
					},
					render() {
						return {
							onStart(props: SuggestionProps<SlashMenuItem>) {
								const rect = props.clientRect?.();
								if (!rect) return;
								setSlashPortal({
									items: props.items,
									rect,
									command: (item: SlashMenuItem) => {
										item.command(props.editor as Editor);
										props.command({ id: item });
									},
								});
							},
							onUpdate(props: SuggestionProps<SlashMenuItem>) {
								const rect = props.clientRect?.();
								setSlashPortal(prev =>
									prev
										? {
												items: props.items,
												rect: rect ?? prev.rect,
												command: (item: SlashMenuItem) => {
													item.command(props.editor as Editor);
													props.command({ id: item });
												},
											}
										: null,
								);
							},
							onKeyDown(props: SuggestionKeyDownProps) {
								if (props.event.key === "Escape") {
									setSlashPortal(null);
									return true;
								}
								return slashMenuRef.current?.onKeyDown(props) ?? false;
							},
							onExit() {
								setSlashPortal(null);
							},
						};
					},
					command({
						editor: ed,
						range,
						props,
					}: {
						editor: Editor;
						range: { from: number; to: number };
						props: { id: SlashMenuItem };
					}) {
						ed.chain().focus().deleteRange(range).run();
						props.id.command(ed);
					},
				},
			}),
		],
		editorProps: {
			attributes: {
				class:
					"cursor-text text-[14.5px] leading-[1.75] text-t-1 outline-none caret-acc",
				spellcheck: "false",
				style: `min-height: ${minHeight}`,
			},
			handleKeyDown(_, event) {
				return onKeyDown?.(event) ?? false;
			},
		},
		content,
		onUpdate({ editor: ed }) {
			if (swappingRef.current) return;
			onUpdate(ed.getJSON() as TipTapDoc);
		},
	});

	useEffect(() => {
		if (editor && onEditorReady) {
			onEditorReady(editor);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor]);

	return (
		<div className="relative">
			{/* ── Bubble menu ── */}
			{editor && (
				<BubbleMenu
					editor={editor}
					appendTo={() => document.body}
					options={{ placement: "top" }}
					className="z-[9997]"
				>
					<BubbleMenuContent
						editor={editor}
						extraToolbarItems={extraToolbarItems}
					/>
				</BubbleMenu>
			)}

			{/* ── Floating menu on empty line ── */}
			{editor && (
				<FloatingMenu
					editor={editor}
					options={{ placement: "left" }}
					className="flex items-center"
				>
					<button
						type="button"
						title="Insert block (/)"
						onMouseDown={e => {
							e.preventDefault();
							editor.chain().focus().insertContent("/").run();
						}}
						className="flex h-6 w-6 items-center justify-center rounded-[5px] text-t-4 transition-colors hover:bg-surf-2 hover:text-t-2"
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
				</FloatingMenu>
			)}

			{/* ── Drag handle ── */}
			{editor && (
				<DragHandle editor={editor}>
					<div className="flex h-5 w-4 cursor-grab items-center justify-center rounded-[4px] text-t-4 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100! hover:bg-surf-2 hover:text-t-2 active:cursor-grabbing">
						<svg width="10" height="14" viewBox="0 0 10 16" fill="none">
							<circle cx="3" cy="4" r="1.2" fill="currentColor" />
							<circle cx="7" cy="4" r="1.2" fill="currentColor" />
							<circle cx="3" cy="8" r="1.2" fill="currentColor" />
							<circle cx="7" cy="8" r="1.2" fill="currentColor" />
							<circle cx="3" cy="12" r="1.2" fill="currentColor" />
							<circle cx="7" cy="12" r="1.2" fill="currentColor" />
						</svg>
					</div>
				</DragHandle>
			)}

			{/* ── Editor content ── */}
			<div
				className="[&_.tiptap]:cursor-text [&_.tiptap]:outline-none [&_.tiptap_blockquote]:my-3 [&_.tiptap_blockquote]:border-l-[3px] [&_.tiptap_blockquote]:border-acc-muted [&_.tiptap_blockquote]:pl-3.5 [&_.tiptap_blockquote]:text-t-2 [&_.tiptap_blockquote_p]:mb-0 [&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:mt-8 [&_.tiptap_h1]:font-display [&_.tiptap_h1]:text-[26px] [&_.tiptap_h1]:font-semibold [&_.tiptap_h1]:text-t-1 [&_.tiptap_h2]:mb-1.5 [&_.tiptap_h2]:mt-6 [&_.tiptap_h2]:font-display [&_.tiptap_h2]:text-[18px] [&_.tiptap_h2]:font-medium [&_.tiptap_h2]:text-t-1 [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:text-[15px] [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-t-1 [&_.tiptap_h4]:mb-1 [&_.tiptap_h4]:mt-3 [&_.tiptap_h4]:text-[13.5px] [&_.tiptap_h4]:font-semibold [&_.tiptap_h4]:uppercase [&_.tiptap_h4]:tracking-wide [&_.tiptap_h4]:text-t-2 [&_.tiptap_li]:mb-1 [&_.tiptap_ol]:mb-3 [&_.tiptap_ol]:pl-5 [&_.tiptap_p:last-child]:mb-0 [&_.tiptap_p]:mb-2.5 [&_.tiptap_ul]:mb-3 [&_.tiptap_ul]:pl-5 [&_.tiptap_p.is-editor-empty:first-child]:before:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child]:before:float-left [&_.tiptap_p.is-editor-empty:first-child]:before:h-0 [&_.tiptap_p.is-editor-empty:first-child]:before:text-t-4 [&_.tiptap_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.tiptap_mark]:rounded-[2px] [&_.tiptap_mark]:px-[1px]"
				style={{ "--editor-min-h": minHeight } as React.CSSProperties}
			>
				{editor && (
					<Tiptap editor={editor}>
						<Tiptap.Content />
					</Tiptap>
				)}
			</div>

			{/* ── Slash command portal ── */}
			{slashPortal &&
				createPortal(
					<div
						className="fixed z-[9999]"
						style={{
							top: slashPortal.rect.bottom + 6,
							left: slashPortal.rect.left,
						}}
					>
						<SlashMenu
							ref={slashMenuRef}
							items={slashPortal.items}
							command={item => {
								slashPortal.command(item);
								hideSlash();
							}}
						/>
					</div>,
					document.body,
				)}
		</div>
	);
};
