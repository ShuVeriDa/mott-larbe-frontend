"use client";

import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const PALOCHKA_UPPER_CHAR = "\u04C0";
export const PALOCHKA_LOWER_CHAR = "\u04CF";

const palochkaDecorationPluginKey = new PluginKey<DecorationSet>(
	"palochkaDecoration",
);

const buildDecorations = (doc: PmNode): DecorationSet => {
	const list: Decoration[] = [];
	doc.descendants((node: PmNode, pos: number) => {
		if (!node.isText || !node.text) return;

		for (let i = 0; i < node.text.length; i++) {
			const ch = node.text[i];
			const from = pos + i;
			const to = from + 1;

			if (ch === PALOCHKA_UPPER_CHAR) {
				list.push(
					Decoration.inline(from, to, {
						class: "palochka-editor-char palochka-editor-char-upper",
					}),
				);
			} else if (ch === PALOCHKA_LOWER_CHAR) {
				list.push(
					Decoration.inline(from, to, {
						class: "palochka-editor-char palochka-editor-char-lower",
					}),
				);
			}
		}
	});

	return DecorationSet.create(doc, list);
};

export const PalochkaDecorationExtension = Extension.create({
	name: "palochkaDecoration",

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: palochkaDecorationPluginKey,
				state: {
					init(_, { doc }): DecorationSet {
						return buildDecorations(doc);
					},
					apply(
						tr: Transaction,
						oldDeco: DecorationSet,
						_oldState: EditorState,
						newState: EditorState,
					): DecorationSet {
						if (tr.docChanged) return buildDecorations(newState.doc);
						return oldDeco.map(tr.mapping, newState.doc);
					},
				},
				props: {
					decorations(state: EditorState) {
						return (
							palochkaDecorationPluginKey.getState(state) ??
							DecorationSet.empty
						);
					},
				},
			}),
		];
	},
});
