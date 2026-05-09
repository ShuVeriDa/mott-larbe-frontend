"use client";

import { Button } from "@/shared/ui/button";
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
import type { CSSProperties, ReactNode } from "react";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BubbleMenuContent } from "./bubble-menu-content";
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
	extraToolbarItems?: ReactNode;
	onUpdate: (doc: TipTapDoc) => void;
	onKeyDown?: (event: KeyboardEvent) => boolean;
	onEditorReady?: (editor: Editor) => void;
	minHeight?: string;
}

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

	const hideSlash = () => setSlashPortal(null);

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

	const handleInsertSlash: NonNullable<ComponentProps<"button">["onMouseDown"]> = e => {
		e.preventDefault();
		if (!editor) return;
		editor.chain().focus().insertContent("/").run();
	};

	const handleBubbleAppendTo = () => document.body;
	const handleSlashCommand = (item: SlashMenuItem) => {
		if (!slashPortal) return;
		slashPortal.command(item);
		hideSlash();
	};

	return (
		<div className="relative">
			{editor && (
				<BubbleMenu
					editor={editor}
					appendTo={handleBubbleAppendTo}
					options={{ placement: "top" }}
					className="z-9997"
				>
					<BubbleMenuContent editor={editor} extraToolbarItems={extraToolbarItems} />
				</BubbleMenu>
			)}

			{editor && (
				<FloatingMenu
					editor={editor}
					options={{ placement: "left" }}
					className="flex items-center"
				>
					<Button
						title="Insert block (/)"
						onMouseDown={handleInsertSlash}
						className="flex h-6 w-6 items-center justify-center rounded-[5px] text-t-4 transition-colors hover:bg-surf-2 hover:text-t-2"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
					</Button>
				</FloatingMenu>
			)}

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

			<div
				className="[&_.tiptap]:cursor-text [&_.tiptap]:outline-none [&_.tiptap_blockquote]:my-3 [&_.tiptap_blockquote]:border-l-[3px] [&_.tiptap_blockquote]:border-acc-muted [&_.tiptap_blockquote]:pl-3.5 [&_.tiptap_blockquote]:text-t-2 [&_.tiptap_blockquote_p]:mb-0 [&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:mt-8 [&_.tiptap_h1]:font-display [&_.tiptap_h1]:text-[26px] [&_.tiptap_h1]:font-semibold [&_.tiptap_h1]:text-t-1 [&_.tiptap_h2]:mb-1.5 [&_.tiptap_h2]:mt-6 [&_.tiptap_h2]:font-display [&_.tiptap_h2]:text-[18px] [&_.tiptap_h2]:font-medium [&_.tiptap_h2]:text-t-1 [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:text-[15px] [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-t-1 [&_.tiptap_h4]:mb-1 [&_.tiptap_h4]:mt-3 [&_.tiptap_h4]:text-[13.5px] [&_.tiptap_h4]:font-semibold [&_.tiptap_h4]:uppercase [&_.tiptap_h4]:tracking-wide [&_.tiptap_h4]:text-t-2 [&_.tiptap_li]:mb-1 [&_.tiptap_ol]:mb-3 [&_.tiptap_ol]:pl-5 [&_.tiptap_p:last-child]:mb-0 [&_.tiptap_p]:mb-2.5 [&_.tiptap_ul]:mb-3 [&_.tiptap_ul]:pl-5 [&_.tiptap_p.is-editor-empty:first-child]:before:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child]:before:float-left [&_.tiptap_p.is-editor-empty:first-child]:before:h-0 [&_.tiptap_p.is-editor-empty:first-child]:before:text-t-4 [&_.tiptap_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.tiptap_mark]:rounded-[2px] [&_.tiptap_mark]:px-px"
				style={{ "--editor-min-h": minHeight } as CSSProperties}
			>
				{editor && (
					<Tiptap editor={editor}>
						<Tiptap.Content />
					</Tiptap>
				)}
			</div>

			{slashPortal &&
				createPortal(
					<div
						className="fixed z-9999"
						style={{ top: slashPortal.rect.bottom + 6, left: slashPortal.rect.left }}
					>
						<SlashMenu
							ref={slashMenuRef}
							items={slashPortal.items}
							command={handleSlashCommand}
						/>
					</div>,
					document.body,
				)}
		</div>
	);
};
