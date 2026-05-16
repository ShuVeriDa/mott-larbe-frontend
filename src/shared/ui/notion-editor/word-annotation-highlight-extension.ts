"use client";

import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { EditorView } from "@tiptap/pm/view";

interface WordAnnotationHighlightState {
	forms: string[];
	decorations: DecorationSet;
}

const pluginKey = new PluginKey<WordAnnotationHighlightState>("wordAnnotationHighlight");

export const WORD_ANNOTATION_CLICK_EVENT = "editor:word-annotation-click";

export interface WordAnnotationClickDetail {
	normalized: string;
	x: number;
	y: number;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		wordAnnotationHighlight: {
			setWordAnnotationHighlights: (forms: string[]) => ReturnType;
		};
	}
}

const buildDecorations = (doc: EditorState["doc"], forms: string[]): DecorationSet => {
	if (!forms.length) return DecorationSet.empty;

	const decos: Decoration[] = [];

	doc.descendants((node: PmNode, pos: number) => {
		if (!node.isText || !node.text) return;
		const text = node.text;
		const lower = text.toLowerCase();

		for (const form of forms) {
			if (!form) continue;
			const formLower = form.toLowerCase();
			let from = 0;
			while (from < text.length) {
				const idx = lower.indexOf(formLower, from);
				if (idx === -1) break;
				// Word boundary check: char before and after must not be a word char
				const before = idx > 0 ? lower[idx - 1] : " ";
				const after = idx + formLower.length < lower.length ? lower[idx + formLower.length] : " ";
				const isWordChar = (c: string) => /\p{L}|\p{N}/u.test(c);
				if (!isWordChar(before) && !isWordChar(after)) {
					decos.push(
						Decoration.inline(pos + idx, pos + idx + formLower.length, {
							class: "word-annotation-highlight",
							"data-annotation-normalized": form,
						}),
					);
				}
				from = idx + formLower.length;
			}
		}
	});

	return DecorationSet.create(doc, decos);
};

export const WordAnnotationHighlightExtension = Extension.create({
	name: "wordAnnotationHighlight",

	addCommands() {
		return {
			setWordAnnotationHighlights:
				(forms: string[]) =>
				({ dispatch, tr, state }) => {
					const decorations = buildDecorations(state.doc, forms);
					if (dispatch) {
						tr.setMeta(pluginKey, { forms, decorations });
						dispatch(tr);
					}
					return true;
				},
		};
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: pluginKey,
				state: {
					init(): WordAnnotationHighlightState {
						return { forms: [], decorations: DecorationSet.empty };
					},
					apply(tr: Transaction, prev: WordAnnotationHighlightState, _old: EditorState, newState: EditorState): WordAnnotationHighlightState {
						const meta = tr.getMeta(pluginKey) as WordAnnotationHighlightState | undefined;
						if (meta) return meta;
						if (tr.docChanged && prev.forms.length) {
							return {
								forms: prev.forms,
								decorations: buildDecorations(newState.doc, prev.forms),
							};
						}
						if (tr.docChanged) {
							return { ...prev, decorations: prev.decorations.map(tr.mapping, newState.doc) };
						}
						return prev;
					},
				},
				props: {
					decorations(state: EditorState) {
						return pluginKey.getState(state)?.decorations ?? DecorationSet.empty;
					},
					handleClick(view: EditorView, _pos: number, event: MouseEvent) {
						const target = event.target as HTMLElement;
						const highlight = target.closest(".word-annotation-highlight") as HTMLElement | null;
						if (!highlight) return false;
						const normalized = highlight.dataset.annotationNormalized;
						if (!normalized) return false;
						document.dispatchEvent(
							new CustomEvent<WordAnnotationClickDetail>(WORD_ANNOTATION_CLICK_EVENT, {
								detail: { normalized, x: event.clientX, y: event.clientY },
							}),
						);
						return true;
					},
				},
			}),
		];
	},
});
