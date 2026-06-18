"use client";

import type { CorrectFormNode } from "@/entities/spelling-dictionary";
import { cn } from "@/lib/utils";
import { CharsPopup } from "@/shared/ui/chars-popup";
import Superscript from "@tiptap/extension-superscript";
import { Tiptap, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Superscript as SuperscriptIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface CorrectFormEditorProps {
	value: CorrectFormNode[];
	onChange: (nodes: CorrectFormNode[]) => void;
	placeholder?: string;
	className?: string;
	autoFocus?: boolean;
	disabled?: boolean;
}

const nodesToTiptap = (nodes: CorrectFormNode[]) => ({
	type: "doc",
	content: [
		{
			type: "paragraph",
			content:
				nodes.length === 0 || (nodes.length === 1 && nodes[0].text === "")
					? []
					: nodes.map(n => ({
							type: "text",
							text: n.text,
							...(n.superscript ? { marks: [{ type: "superscript" }] } : {}),
						})),
		},
	],
});

const tiptapToNodes = (
	editor: ReturnType<typeof useEditor>,
): CorrectFormNode[] => {
	if (!editor) return [];
	const json = editor.getJSON();
	const paragraph = json.content?.[0];
	if (!paragraph?.content) return [{ text: "" }];
	return paragraph.content.map(
		(node: { type: string; text?: string; marks?: { type: string }[] }) => ({
			text: node.text ?? "",
			superscript: node.marks?.some(m => m.type === "superscript") ?? false,
		}),
	);
};

export const CorrectFormEditor = ({
	value,
	onChange,
	placeholder,
	className,
	autoFocus,
	disabled,
}: CorrectFormEditorProps) => {
	const onChangeRef = useRef(onChange);
	const editorRef = useRef<ReturnType<typeof useEditor>>(null);

	useEffect(() => {
		onChangeRef.current = onChange;
	});

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: false,
				blockquote: false,
				bulletList: false,
				orderedList: false,
				listItem: false,
				codeBlock: false,
				horizontalRule: false,
				hardBreak: false,
			}),
			Superscript,
		],
		content: nodesToTiptap(value),
		editorProps: {
			attributes: {
				class:
					"outline-none w-full text-[13px] leading-[1.6] text-t-1 caret-acc",
				spellcheck: "false",
				...(placeholder ? { "data-placeholder": placeholder } : {}),
			},
			handleKeyDown(_, event) {
				if (event.key === "Enter") {
					event.preventDefault();
					return true;
				}
				return false;
			},
		},
		onUpdate({ editor: ed }) {
			onChangeRef.current(tiptapToNodes(ed));
		},
		onCreate({ editor: ed }) {
			editorRef.current = ed;
		},
		editable: !disabled,
	});

	useEffect(() => {
		editorRef.current = editor;
	}, [editor]);

	useEffect(() => {
		if (!editor) return;
		const current = JSON.stringify(
			editor.getJSON().content?.[0]?.content ?? [],
		);
		const next = JSON.stringify(nodesToTiptap(value).content[0].content);
		if (current !== next) {
			editor.commands.setContent(nodesToTiptap(value), { emitUpdate: false });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	useEffect(() => {
		if (autoFocus && editor) {
			editor.commands.focus("end");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor]);

	const handleAppendTo = () => document.body;

	const handleSuperscriptMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		editor?.chain().focus().toggleSuperscript().run();
	};

	const handleInsertChar = (char: string) => {
		editorRef.current?.chain().focus().insertContent(char).run();
	};

	return (
		<div
			className={cn(
				"relative flex min-h-[34px] w-full items-center rounded-md border border-input bg-background px-3 py-1.5 transition-shadow duration-150 ease-out",
				disabled ? "cursor-not-allowed opacity-50" : "",
				className,
			)}
		>
			{editor && (
				<BubbleMenu
					editor={editor}
					appendTo={handleAppendTo}
					options={{ placement: "top" }}
					shouldShow={() => editor.state.selection.content().size > 0}
					className="z-9997"
				>
					<div className="flex items-center rounded-[6px] border border-bd-2 bg-surf px-0.5 py-0.5 shadow-md">
						<button
							type="button"
							onMouseDown={handleSuperscriptMouseDown}
							title="Надстрочный (superscript)"
							className={[
								"flex h-6 w-6 items-center justify-center rounded-[4px] text-[11px] font-medium transition-all duration-100 select-none",
								editor.isActive("superscript")
									? "bg-[#2783de]/10 text-[#2783de]"
									: "text-t-2 hover:bg-surf-3 hover:text-t-1 active:scale-95",
							].join(" ")}
						>
							<SuperscriptIcon className="size-[12px]" />
						</button>
					</div>
				</BubbleMenu>
			)}
			{editor && (
				<div className="flex-1 [&_.tiptap]:outline-none [&_.tiptap_p]:m-0 [&_.tiptap_p.is-editor-empty]:before:pointer-events-none [&_.tiptap_p.is-editor-empty]:before:float-left [&_.tiptap_p.is-editor-empty]:before:h-0 [&_.tiptap_p.is-editor-empty]:before:text-t-4 [&_.tiptap_p.is-editor-empty]:before:content-[attr(data-placeholder)]">
					<Tiptap editor={editor}>
						<Tiptap.Content />
					</Tiptap>
				</div>
			)}
			{!disabled && (
				<div className="ml-1 shrink-0">
					<CharsPopup onInsert={handleInsertChar} />
				</div>
			)}
		</div>
	);
};
