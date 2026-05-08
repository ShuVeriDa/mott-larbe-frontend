"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent, ReactRenderer } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import type { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";
import { SlashExtension } from "./slash-extension";
import { SlashMenu } from "./slash-menu";
import type { SlashMenuItem, SlashMenuHandle } from "./slash-menu";
import type { Editor } from "@tiptap/react";

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

// ── Bubble toolbar button ────────────────────────────────────────────────────

const BubbleBtn = ({
	active,
	onExec,
	children,
	title,
}: {
	active?: boolean;
	onExec: () => void;
	children: React.ReactNode;
	title: string;
}) => (
	<button
		type="button"
		title={title}
		onMouseDown={(e) => {
			e.preventDefault();
			onExec();
		}}
		className={`flex h-7 w-7 items-center justify-center rounded-[5px] transition-colors ${
			active ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/15 hover:text-white"
		}`}
	>
		{children}
	</button>
);

const Divider = () => <div className="mx-0.5 h-4 w-px bg-white/20" />;

// ── Slash portal state ────────────────────────────────────────────────────────

interface SlashPortalState {
	items: SlashMenuItem[];
	rect: DOMRect;
	command: (item: SlashMenuItem) => void;
}

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
			StarterKit.configure({ heading: { levels: [2, 3] } }),
			Underline,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({ placeholder }),
			SlashExtension.configure({
				suggestion: {
					char: "/",
					items: ({ query }: { query: string }) => {
						if (!query) return slashMenuItems;
						const q = query.toLowerCase();
						return slashMenuItems.filter(
							(item) =>
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
								setSlashPortal((prev) =>
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
					command({ editor: ed, range, props }: { editor: Editor; range: { from: number; to: number }; props: { id: SlashMenuItem } }) {
						ed.chain().focus().deleteRange(range).run();
						props.id.command(ed);
					},
				},
			}),
		],
		editorProps: {
			attributes: {
				class: "cursor-text text-[14.5px] leading-[1.75] text-t-1 outline-none caret-acc",
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
					className="z-9999 flex items-center gap-px rounded-[9px] bg-[#1a1a1a] px-1.5 py-1.5 shadow-xl"
				>
					<select
						className="h-6 cursor-pointer appearance-none rounded-[4px] border-none bg-transparent px-1.5 text-[11px] text-white/80 outline-none hover:bg-white/10 hover:text-white"
						value={
							editor.isActive("heading", { level: 2 })
								? "h2"
								: editor.isActive("heading", { level: 3 })
								? "h3"
								: editor.isActive("blockquote")
								? "blockquote"
								: "p"
						}
						onChange={(e) => {
							const v = e.target.value;
							if (v === "p") editor.chain().focus().setParagraph().run();
							else if (v === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
							else if (v === "h3") editor.chain().focus().setHeading({ level: 3 }).run();
							else if (v === "blockquote") editor.chain().focus().setBlockquote().run();
						}}
					>
						<option value="p" style={{ background: "#1a1a1a" }}>Text</option>
						<option value="h2" style={{ background: "#1a1a1a" }}>Heading 2</option>
						<option value="h3" style={{ background: "#1a1a1a" }}>Heading 3</option>
						<option value="blockquote" style={{ background: "#1a1a1a" }}>Quote</option>
					</select>

					<Divider />

					<BubbleBtn title="Bold" active={editor.isActive("bold")} onExec={() => editor.chain().focus().toggleBold().run()}>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path d="M4 8h5.5a2.5 2.5 0 000-5H4v5zM4 8h6a2.5 2.5 0 010 5H4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</BubbleBtn>
					<BubbleBtn title="Italic" active={editor.isActive("italic")} onExec={() => editor.chain().focus().toggleItalic().run()}>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path d="M10 3H7M9 13H6M9 3L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					</BubbleBtn>
					<BubbleBtn title="Underline" active={editor.isActive("underline")} onExec={() => editor.chain().focus().toggleUnderline().run()}>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path d="M5 3v5a3 3 0 006 0V3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					</BubbleBtn>
					<BubbleBtn title="Strike" active={editor.isActive("strike")} onExec={() => editor.chain().focus().toggleStrike().run()}>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path d="M3 8h10M5.5 5.5C5.5 4.12 6.62 3 8 3s2.5 1.12 2.5 2.5M5.5 10.5C5.5 11.88 6.62 13 8 13s2.5-1.12 2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						</svg>
					</BubbleBtn>

					<Divider />

					<BubbleBtn title="Bullet list" active={editor.isActive("bulletList")} onExec={() => editor.chain().focus().toggleBulletList().run()}>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<circle cx="3" cy="5" r="1.1" fill="currentColor" />
							<circle cx="3" cy="9" r="1.1" fill="currentColor" />
							<circle cx="3" cy="13" r="1.1" fill="currentColor" />
							<path d="M6.5 5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						</svg>
					</BubbleBtn>
					<BubbleBtn title="Ordered list" active={editor.isActive("orderedList")} onExec={() => editor.chain().focus().toggleOrderedList().run()}>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path d="M2 3.5h1.5M2 3.5v2.5h1.5M2 9h1.5a.5.5 0 010 1H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M6.5 4.5h7M6.5 9h7M6.5 13h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						</svg>
					</BubbleBtn>

					{extraToolbarItems && (
						<>
							<Divider />
							{extraToolbarItems}
						</>
					)}
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
						onMouseDown={(e) => {
							e.preventDefault();
							editor.chain().focus().insertContent("/").run();
						}}
						className="flex h-6 w-6 items-center justify-center rounded-[5px] text-t-4 transition-colors hover:bg-surf-2 hover:text-t-2"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
				className="[&_.tiptap]:cursor-text [&_.tiptap]:outline-none [&_.tiptap_blockquote]:my-3 [&_.tiptap_blockquote]:border-l-[3px] [&_.tiptap_blockquote]:border-acc-muted [&_.tiptap_blockquote]:pl-3.5 [&_.tiptap_blockquote]:text-t-2 [&_.tiptap_blockquote_p]:mb-0 [&_.tiptap_h2]:mb-1.5 [&_.tiptap_h2]:mt-6 [&_.tiptap_h2]:font-display [&_.tiptap_h2]:text-[18px] [&_.tiptap_h2]:font-medium [&_.tiptap_h2]:text-t-1 [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:text-[15px] [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-t-1 [&_.tiptap_li]:mb-1 [&_.tiptap_ol]:mb-3 [&_.tiptap_ol]:pl-5 [&_.tiptap_p:last-child]:mb-0 [&_.tiptap_p]:mb-2.5 [&_.tiptap_ul]:mb-3 [&_.tiptap_ul]:pl-5 [&_.tiptap_p.is-editor-empty:first-child]:before:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child]:before:float-left [&_.tiptap_p.is-editor-empty:first-child]:before:h-0 [&_.tiptap_p.is-editor-empty:first-child]:before:text-t-4 [&_.tiptap_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]"
				style={{ "--editor-min-h": minHeight } as React.CSSProperties}
			>
				<EditorContent editor={editor} />
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
							command={(item) => {
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
