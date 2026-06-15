import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { SpellingEntry } from "@/entities/spelling-dictionary";

export const SPELLING_CORRECTION_CLASS = "spelling-correction";

export interface SpellingCorrectionMeta {
	entries: SpellingEntry[];
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		spellingCorrection: {
			applySpellingFix: (from: number, to: number, correctForm: string) => ReturnType;
			setSpellingEntries: (entries: SpellingEntry[]) => ReturnType;
		};
	}
}

const pluginKey = new PluginKey<{ decorations: DecorationSet; entries: SpellingEntry[] }>(
	"spellingCorrection",
);

/**
 * Preserves capitalization of the original text when applying a correction.
 * "Вахнера" + "вахне́ра" → "Вахне́ра"
 * "вахнера" + "вахне́ра" → "вахне́ра"
 * "ВАХНЕРА" + "вахне́ра" → "ВАХНЕ́РА" (all-caps)
 */
const applyCase = (original: string, replacement: string): string => {
	if (!original) return replacement;
	const isAllCaps = original === original.toUpperCase() && original !== original.toLowerCase();
	const isCapitalized = original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase();

	if (isAllCaps) return replacement.toUpperCase();
	if (isCapitalized) return replacement[0].toUpperCase() + replacement.slice(1);
	return replacement;
};

const buildDecorations = (doc: PmNode, entries: SpellingEntry[]): DecorationSet => {
	if (entries.length === 0) return DecorationSet.empty;

	const decorations: Decoration[] = [];

	doc.descendants((node: PmNode, pos: number) => {
		if (!node.isText || !node.text) return;
		const text = node.text;

		for (const entry of entries) {
			const wrong = entry.wrongForm; // always lowercase
			// Build a regex that matches the wrongForm as a substring (not word-boundary — partial match allowed)
			// We search case-insensitively but store the match range for case-preserving replacement
			const pattern = new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
			let match: RegExpExecArray | null;

			while ((match = pattern.exec(text)) !== null) {
				const from = pos + match.index;
				const to = from + match[0].length;

				decorations.push(
					Decoration.inline(from, to, {
						class: SPELLING_CORRECTION_CLASS,
						"data-wrong-form": entry.wrongForm,
						"data-correct-form": entry.correctForm,
						"data-entry-id": entry.id,
						"data-original-text": match[0],
						"data-from": String(from),
						"data-to": String(to),
					}),
				);
			}
		}
	});

	return DecorationSet.create(doc, decorations);
};

export const SpellingCorrectionExtension = Extension.create({
	name: "spellingCorrection",

	addCommands() {
		return {
			applySpellingFix:
				(from: number, to: number, correctForm: string) =>
				({ state, dispatch }) => {
					const originalText = state.doc.textBetween(from, to);
					const replacement = applyCase(originalText, correctForm);
					if (dispatch) {
						const tr = state.tr.insertText(replacement, from, to);
						dispatch(tr);
					}
					return true;
				},

			setSpellingEntries:
				(entries: SpellingEntry[]) =>
				({ editor, dispatch, tr }) => {
					if (dispatch) {
						tr.setMeta(pluginKey, { entries });
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
					init(): { decorations: DecorationSet; entries: SpellingEntry[] } {
						return { decorations: DecorationSet.empty, entries: [] };
					},
					apply(
						tr: Transaction,
						prev: { decorations: DecorationSet; entries: SpellingEntry[] },
						_oldState: EditorState,
						newState: EditorState,
					): { decorations: DecorationSet; entries: SpellingEntry[] } {
						const meta = tr.getMeta(pluginKey) as SpellingCorrectionMeta | undefined;
						const entries = meta?.entries ?? prev.entries;

						if (meta || tr.docChanged) {
							return { decorations: buildDecorations(newState.doc, entries), entries };
						}

						return {
							decorations: prev.decorations.map(tr.mapping, newState.doc),
							entries,
						};
					},
				},
				props: {
					decorations(state: EditorState) {
						return pluginKey.getState(state)?.decorations ?? DecorationSet.empty;
					},
				},
			}),
		];
	},
});
