"use client";

import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { EditorView } from "@tiptap/pm/view";

interface PhraseHighlightState {
	phrases: string[];
	decorations: DecorationSet;
}

const pluginKey = new PluginKey<PhraseHighlightState>("phraseHighlight");

export const PHRASE_CLICK_EVENT = "editor:phrase-highlight-click";

export interface PhraseClickDetail {
	phraseText: string;
	x: number;
	y: number;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		phraseHighlight: {
			setPhraseHighlights: (phrases: string[]) => ReturnType;
		};
	}
}

const buildDecorations = (doc: EditorState["doc"], phrases: string[]): DecorationSet => {
	if (!phrases.length) return DecorationSet.empty;

	const decos: Decoration[] = [];

	doc.descendants((node: PmNode, pos: number) => {
		if (!node.isText || !node.text) return;
		const text = node.text;

		for (const phrase of phrases) {
			if (!phrase) continue;
			const lower = text.toLowerCase();
			const phraseLower = phrase.toLowerCase();
			let from = 0;
			while (from < text.length) {
				const idx = lower.indexOf(phraseLower, from);
				if (idx === -1) break;
				decos.push(
					Decoration.inline(pos + idx, pos + idx + phrase.length, {
						class: "phrase-editor-highlight",
						"data-phrase-text": phrase,
					}),
				);
				from = idx + phrase.length;
			}
		}
	});

	return DecorationSet.create(doc, decos);
};

export const PhraseHighlightExtension = Extension.create({
	name: "phraseHighlight",

	addCommands() {
		return {
			setPhraseHighlights:
				(phrases: string[]) =>
				({ dispatch, tr, state }) => {
					const decorations = buildDecorations(state.doc, phrases);
					if (dispatch) {
						tr.setMeta(pluginKey, { phrases, decorations });
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
					init(): PhraseHighlightState {
						return { phrases: [], decorations: DecorationSet.empty };
					},
					apply(tr: Transaction, prev: PhraseHighlightState, _old: EditorState, newState: EditorState): PhraseHighlightState {
						const meta = tr.getMeta(pluginKey) as PhraseHighlightState | undefined;
						if (meta) return meta;
						if (tr.docChanged && prev.phrases.length) {
							return {
								phrases: prev.phrases,
								decorations: buildDecorations(newState.doc, prev.phrases),
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
						const highlight = target.closest(".phrase-editor-highlight") as HTMLElement | null;
						if (!highlight) return false;
						const phraseText = highlight.dataset.phraseText;
						if (!phraseText) return false;
						// Collapse selection so BubbleMenu hides before modal opens
						view.dispatch(
							view.state.tr.setSelection(
								TextSelection.near(view.state.doc.resolve(_pos)),
							),
						);
						document.dispatchEvent(new Event("admin:open-phrase-form"));
						document.dispatchEvent(
							new CustomEvent<PhraseClickDetail>(PHRASE_CLICK_EVENT, {
								detail: { phraseText, x: event.clientX, y: event.clientY },
							}),
						);
						// Re-enable bubble menu after modal opens
						setTimeout(() => document.dispatchEvent(new Event("admin:close-phrase-form")), 100);
						return true;
					},
				},
			}),
		];
	},
});
