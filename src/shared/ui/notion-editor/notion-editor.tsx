"use client";

import { Button } from "@/shared/ui/button";
import Color from "@tiptap/extension-color";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import type { Extension } from "@tiptap/core";
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
import { ChechenSpellingDecorationExtension } from "./chechen-spelling-decoration-extension";
import { PalochkaDecorationExtension } from "./palochka-decoration-extension";
import { SearchExtension } from "./search-extension";
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
	extraExtensions?: Extension[];
	/** Called on each selection change with the selected text; return true to show phrase buttons in bubble menu */
	isSelectedPhrase?: (text: string) => boolean;
	onBubbleEditPhrase?: (selectedText: string) => void;
	onBubbleDeletePhrase?: (selectedText: string) => void;
	/** Called on each selection change with the selected text; return true to show annotation buttons in bubble menu */
	isSelectedAnnotation?: (text: string) => boolean;
	onBubbleEditAnnotation?: (selectedText: string) => void;
	onBubbleDeleteAnnotation?: (selectedText: string) => void;
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
	extraExtensions = [],
	isSelectedPhrase,
	onBubbleEditPhrase,
	onBubbleDeletePhrase,
	isSelectedAnnotation,
	onBubbleEditAnnotation,
	onBubbleDeleteAnnotation,
}: NotionEditorProps) => {
	const swappingRef = useRef(false);
	const slashMenuRef = useRef<SlashMenuHandle>(null);
	const [slashPortal, setSlashPortal] = useState<SlashPortalState | null>(null);
	const bubbleMenuEnabledRef = useRef(true);
	const [bubbleMenuEnabled, setBubbleMenuEnabled] = useState(true);
	const [selectionText, setSelectionText] = useState("");

	const hideSlash = () => setSlashPortal(null);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
			Underline,
			Superscript,
			Subscript,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			TextStyle,
			Color,
			Highlight.configure({ multicolor: true }),
			Placeholder.configure({ placeholder }),
			SearchExtension,
			PalochkaDecorationExtension,
			ChechenSpellingDecorationExtension,
			...extraExtensions,
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
		onSelectionUpdate({ editor: ed }) {
			if (!isSelectedPhrase && !isSelectedAnnotation) return;
			const { from, to } = ed.state.selection;
			const text = from === to ? "" : ed.state.doc.textBetween(from, to, " ").trim();
			setSelectionText(text);
		},
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

	useEffect(() => {
		if (!editor || swappingRef.current) return;
		const current = JSON.stringify(editor.getJSON());
		const next = JSON.stringify(content);
		if (current !== next) {
			swappingRef.current = true;
			editor.commands.setContent(content, { emitUpdate: false });
			swappingRef.current = false;
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [content]);

	const handleInsertSlash: NonNullable<
		ComponentProps<"button">["onMouseDown"]
	> = e => {
		e.preventDefault();
		if (!editor) return;
		editor.chain().focus().insertContent("/").run();
	};

	useEffect(() => {
		const hide = () => { bubbleMenuEnabledRef.current = false; setBubbleMenuEnabled(false); };
		const show = () => { bubbleMenuEnabledRef.current = true; setBubbleMenuEnabled(true); };
		document.addEventListener("admin:open-phrase-form", hide);
		document.addEventListener("admin:close-phrase-form", show);
		return () => {
			document.removeEventListener("admin:open-phrase-form", hide);
			document.removeEventListener("admin:close-phrase-form", show);
		};
	}, []);

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
					shouldShow={() => bubbleMenuEnabledRef.current && editor.state.selection.content().size > 0}
					className="z-9997"
				>
					{(() => {
						const isPhrase = isSelectedPhrase && selectionText
							? isSelectedPhrase(selectionText)
							: false;
						const isAnnotation = !isPhrase && isSelectedAnnotation && selectionText
							? isSelectedAnnotation(selectionText)
							: false;
						return (
							<BubbleMenuContent
								editor={editor}
								extraToolbarItems={isPhrase || isAnnotation ? undefined : extraToolbarItems}
								onEditPhrase={isPhrase && onBubbleEditPhrase
									? () => onBubbleEditPhrase(selectionText)
									: undefined}
								onDeletePhrase={isPhrase && onBubbleDeletePhrase
									? () => onBubbleDeletePhrase(selectionText)
									: undefined}
								onEditAnnotation={isAnnotation && onBubbleEditAnnotation
									? () => onBubbleEditAnnotation(selectionText)
									: undefined}
								onDeleteAnnotation={isAnnotation && onBubbleDeleteAnnotation
									? () => onBubbleDeleteAnnotation(selectionText)
									: undefined}
							/>
						);
					})()}
				</BubbleMenu>
			)}

			{editor && (
				<FloatingMenu
					editor={editor}
					options={{ placement: "left" }}
					className="-translate-x-1.5 flex items-center"
				>
					<Button
						title="Insert block (/)"
						size={"bare"}
						onMouseDown={handleInsertSlash}
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
					</Button>
				</FloatingMenu>
			)}

			{editor && (
				<DragHandle editor={editor}>
					<div className="ml-1 flex h-5 w-4 cursor-grab items-center justify-center rounded-[4px] text-t-4 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100! hover:bg-surf-2 hover:text-t-2 active:cursor-grabbing">
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
				className="[&_.tiptap]:cursor-text [&_.tiptap]:outline-none [&_.tiptap_blockquote]:my-3 [&_.tiptap_blockquote]:border-l-[3px] [&_.tiptap_blockquote]:border-acc-muted [&_.tiptap_blockquote]:pl-3.5 [&_.tiptap_blockquote]:text-t-2 [&_.tiptap_blockquote_p]:mb-0 [&_.tiptap_h1]:mb-2 [&_.tiptap_h1]:mt-8 [&_.tiptap_h1]:font-display [&_.tiptap_h1]:text-[26px] [&_.tiptap_h1]:font-semibold [&_.tiptap_h1]:text-t-1 [&_.tiptap_h2]:mb-1.5 [&_.tiptap_h2]:mt-6 [&_.tiptap_h2]:font-display [&_.tiptap_h2]:text-[18px] [&_.tiptap_h2]:font-medium [&_.tiptap_h2]:text-t-1 [&_.tiptap_h3]:mb-1 [&_.tiptap_h3]:mt-4 [&_.tiptap_h3]:text-[15px] [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-t-1 [&_.tiptap_h4]:mb-1 [&_.tiptap_h4]:mt-3 [&_.tiptap_h4]:text-[13.5px] [&_.tiptap_h4]:font-semibold [&_.tiptap_h4]:uppercase [&_.tiptap_h4]:tracking-wide [&_.tiptap_h4]:text-t-2 [&_.tiptap_li]:mb-1 [&_.tiptap_ol]:mb-3 [&_.tiptap_ol]:pl-5 [&_.tiptap_p:last-child]:mb-0 [&_.tiptap_p]:mb-2.5 [&_.tiptap_ul]:mb-3 [&_.tiptap_ul]:pl-5 [&_.tiptap_p.is-editor-empty:first-child]:before:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child]:before:float-left [&_.tiptap_p.is-editor-empty:first-child]:before:h-0 [&_.tiptap_p.is-editor-empty:first-child]:before:text-t-4 [&_.tiptap_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.tiptap_mark]:rounded-[2px] [&_.tiptap_mark]:px-px [&_.tiptap_.palochka-editor-char-upper]:rounded-[2px] [&_.tiptap_.palochka-editor-char-upper]:bg-acc-bg [&_.tiptap_.palochka-editor-char-upper]:px-px [&_.tiptap_.palochka-editor-char-upper]:text-acc-t [&_.tiptap_.palochka-editor-char-upper]:[box-decoration-break:clone] [&_.tiptap_.palochka-editor-char-lower]:rounded-[2px] [&_.tiptap_.palochka-editor-char-lower]:bg-pur-bg [&_.tiptap_.palochka-editor-char-lower]:px-px [&_.tiptap_.palochka-editor-char-lower]:text-pur-t [&_.tiptap_.palochka-editor-char-lower]:[box-decoration-break:clone] [&_.tiptap_.chechen-spell]:rounded-[2px] [&_.tiptap_.chechen-spell]:px-px [&_.tiptap_.chechen-spell]:[box-decoration-break:clone] [&_.tiptap_.chechen-spell-ya-yu-certain]:bg-amber-200 [&_.tiptap_.chechen-spell-ya-yu-certain]:text-amber-900 [&_.tiptap_.chechen-spell-ya-yu-likely]:bg-amber-100 [&_.tiptap_.chechen-spell-ya-yu-likely]:text-amber-800 [&_.tiptap_.chechen-spell-ya-yu-disputed]:bg-amber-50 [&_.tiptap_.chechen-spell-ya-yu-disputed]:text-amber-700 [&_.tiptap_.chechen-spell-diphthong-certain]:bg-sky-200 [&_.tiptap_.chechen-spell-diphthong-certain]:text-sky-900 [&_.tiptap_.chechen-spell-diphthong-likely]:bg-sky-100 [&_.tiptap_.chechen-spell-diphthong-likely]:text-sky-800 [&_.tiptap_.chechen-spell-diphthong-disputed]:bg-sky-50 [&_.tiptap_.chechen-spell-diphthong-disputed]:text-sky-700 [&_.tiptap_.phrase-editor-highlight]:rounded-[2px] [&_.tiptap_.phrase-editor-highlight]:bg-pur-bg [&_.tiptap_.phrase-editor-highlight]:px-px [&_.tiptap_.phrase-editor-highlight]:text-pur-t [&_.tiptap_.phrase-editor-highlight]:[box-decoration-break:clone] [&_.tiptap_.phrase-editor-highlight]:cursor-pointer [&_.tiptap_.phrase-editor-highlight]:transition-opacity [&_.tiptap_.phrase-editor-highlight]:hover:opacity-75 [&_.tiptap_.word-annotation-highlight]:rounded-[2px] [&_.tiptap_.word-annotation-highlight]:bg-acc-bg [&_.tiptap_.word-annotation-highlight]:px-px [&_.tiptap_.word-annotation-highlight]:text-acc-t [&_.tiptap_.word-annotation-highlight]:[box-decoration-break:clone] [&_.tiptap_.word-annotation-highlight]:cursor-pointer [&_.tiptap_.word-annotation-highlight]:transition-opacity [&_.tiptap_.word-annotation-highlight]:hover:opacity-75 [&_.tiptap_.word-annotation-highlight-partial]:cursor-pointer [&_.tiptap_.word-annotation-highlight-partial]:underline [&_.tiptap_.word-annotation-highlight-partial]:decoration-acc [&_.tiptap_.word-annotation-highlight-partial]:decoration-dotted [&_.tiptap_.word-annotation-highlight-partial]:underline-offset-2 [&_.tiptap_.word-annotation-highlight-partial]:transition-opacity [&_.tiptap_.word-annotation-highlight-partial]:hover:opacity-75"
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
						style={{
							top: slashPortal.rect.bottom + 6,
							left: slashPortal.rect.left,
						}}
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
