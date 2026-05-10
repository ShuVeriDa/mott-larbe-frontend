"use client";

import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export interface CharLimitMarkerOptions {
	limit: number;
	markerTitle: string;
}

interface CharLimitPluginState {
	decorations: DecorationSet;
}

export const charLimitMarkerPluginKey = new PluginKey<CharLimitPluginState>(
	"charLimitMarker",
);

const findOverflowStart = (doc: PmNode, limit: number): number | null => {
	if (limit <= 0) return null;

	let nonWs = 0;

	const visit = (node: PmNode, pos: number): number | null => {
		if (node.isText) {
			const text = node.text ?? "";
			for (let i = 0; i < text.length; i += 1) {
				const ch = text[i];
				if (!ch || /\s/.test(ch)) continue;
				nonWs += 1;
				if (nonWs > limit) return pos + i;
			}
			return null;
		}

		if (!node.content.childCount) return null;

		let childPos = pos + 1;
		for (let i = 0; i < node.content.childCount; i += 1) {
			const child = node.content.child(i);
			const hit = visit(child, childPos);
			if (hit !== null) return hit;
			childPos += child.nodeSize;
		}
		return null;
	};

	return visit(doc, 0);
};

const buildDecorations = (
	state: EditorState,
	limit: number,
	markerTitle: string,
): DecorationSet => {
	const overflowFrom = findOverflowStart(state.doc, limit);
	if (overflowFrom === null) return DecorationSet.empty;

	const marker = Decoration.widget(
		overflowFrom,
		() => {
			const el = document.createElement("span");
			el.className = "char-limit-marker";
			el.setAttribute("aria-hidden", "true");
			return el;
		},
		{ side: -1, key: "char-limit-boundary" },
	);

	const overflowSegments: Decoration[] = [];

	state.doc.descendants((node: PmNode, pos: number) => {
		if (!node.isText || !node.text) return;
		const end = pos + node.text.length;
		if (end <= overflowFrom) return;
		const from = Math.max(pos, overflowFrom);
		const isFirstOverflow = from === overflowFrom;
		overflowSegments.push(
			Decoration.inline(from, end, {
				class: "char-limit-overflow",
				...(isFirstOverflow && markerTitle ? { title: markerTitle } : {}),
			}),
		);
	});

	return DecorationSet.create(state.doc, [marker, ...overflowSegments]);
};

export const CharLimitMarkerExtension = Extension.create<CharLimitMarkerOptions>({
	name: "charLimitMarker",

	addOptions() {
		return {
			limit: 1800,
			markerTitle: "",
		};
	},

	addProseMirrorPlugins() {
		const getOpts = () => this.options;

		return [
			new Plugin({
				key: charLimitMarkerPluginKey,
				state: {
					init: (_, state): CharLimitPluginState => {
						const { limit, markerTitle } = getOpts();
						return {
							decorations: buildDecorations(state, limit, markerTitle),
						};
					},
					apply(tr, pluginState, _old, newState): CharLimitPluginState {
						if (!tr.docChanged) return pluginState;
						const { limit, markerTitle } = getOpts();
						return {
							decorations: buildDecorations(newState, limit, markerTitle),
						};
					},
				},
				props: {
					decorations(state) {
						return (
							charLimitMarkerPluginKey.getState(state)?.decorations ??
							DecorationSet.empty
						);
					},
				},
			}),
		];
	},
});
