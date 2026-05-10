"use client";

import type { Editor } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

// ── Types ────────────────────────────────────────────────────────────────────

export interface SearchMatch {
	from: number;
	to: number;
}

interface SearchState {
	query: string;
	matches: SearchMatch[];
	activeIndex: number;
	decorations: DecorationSet;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		search: {
			setSearchQuery: (query: string) => ReturnType;
			clearSearch: () => ReturnType;
			findNext: () => ReturnType;
			findPrev: () => ReturnType;
			replaceActive: (replacement: string) => ReturnType;
			replaceAll: (replacement: string) => ReturnType;
		};
	}
}

// ── Plugin key ───────────────────────────────────────────────────────────────

export const searchPluginKey = new PluginKey<SearchState>("search");

// ── Helpers ──────────────────────────────────────────────────────────────────

const buildDecorations = (
	state: EditorState,
	matches: SearchMatch[],
	activeIndex: number,
): DecorationSet => {
	if (matches.length === 0) return DecorationSet.empty;

	const decorations = matches.map((match, index) =>
		Decoration.inline(match.from, match.to, {
			class:
				index === activeIndex
					? "search-highlight search-highlight--active"
					: "search-highlight",
		}),
	);

	return DecorationSet.create(state.doc, decorations);
};

const findMatches = (doc: EditorState["doc"], query: string): SearchMatch[] => {
	if (!query) return [];

	const matches: SearchMatch[] = [];
	const lowerQuery = query.toLowerCase();

	doc.descendants((node: PmNode, pos: number) => {
		if (!node.isText || !node.text) return;

		const text = node.text.toLowerCase();
		let index = 0;

		while (index < text.length) {
			const found = text.indexOf(lowerQuery, index);
			if (found === -1) break;
			matches.push({ from: pos + found, to: pos + found + query.length });
			index = found + 1;
		}
	});

	return matches;
};

// ── Extension ────────────────────────────────────────────────────────────────

export const SearchExtension = Extension.create({
	name: "search",

	addCommands() {
		return {
			setSearchQuery:
				(query: string) =>
				({ editor, dispatch, tr }) => {
					const matches = findMatches(editor.state.doc, query);
					const activeIndex = matches.length > 0 ? 0 : -1;
					const decorations = buildDecorations(
						editor.state,
						matches,
						activeIndex,
					);

					if (dispatch) {
						tr.setMeta(searchPluginKey, {
							query,
							matches,
							activeIndex,
							decorations,
						});
						dispatch(tr);
					}

					return true;
				},

			clearSearch:
				() =>
				({ dispatch, tr, editor }) => {
					if (dispatch) {
						tr.setMeta(searchPluginKey, {
							query: "",
							matches: [],
							activeIndex: -1,
							decorations: DecorationSet.empty,
						});
						dispatch(tr);
					}
					return true;
				},

			findNext:
				() =>
				({ editor, dispatch, tr }) => {
					const pluginState = searchPluginKey.getState(editor.state);
					if (!pluginState || pluginState.matches.length === 0) return false;

					const nextIndex =
						(pluginState.activeIndex + 1) % pluginState.matches.length;
					const decorations = buildDecorations(
						editor.state,
						pluginState.matches,
						nextIndex,
					);

					if (dispatch) {
						tr.setMeta(searchPluginKey, {
							...pluginState,
							activeIndex: nextIndex,
							decorations,
						});
						dispatch(tr);
					}

					const match = pluginState.matches[nextIndex];
					if (match) {
						editor.commands.setTextSelection({ from: match.from, to: match.to });
						scrollToMatch(editor, match);
					}

					return true;
				},

			findPrev:
				() =>
				({ editor, dispatch, tr }) => {
					const pluginState = searchPluginKey.getState(editor.state);
					if (!pluginState || pluginState.matches.length === 0) return false;

					const prevIndex =
						(pluginState.activeIndex - 1 + pluginState.matches.length) %
						pluginState.matches.length;
					const decorations = buildDecorations(
						editor.state,
						pluginState.matches,
						prevIndex,
					);

					if (dispatch) {
						tr.setMeta(searchPluginKey, {
							...pluginState,
							activeIndex: prevIndex,
							decorations,
						});
						dispatch(tr);
					}

					const match = pluginState.matches[prevIndex];
					if (match) {
						editor.commands.setTextSelection({ from: match.from, to: match.to });
						scrollToMatch(editor, match);
					}

					return true;
				},

			replaceActive:
				(replacement: string) =>
				({ editor, dispatch, tr, state }) => {
					const pluginState = searchPluginKey.getState(state);
					if (
						!pluginState ||
						pluginState.activeIndex === -1 ||
						pluginState.matches.length === 0
					)
						return false;

					const match = pluginState.matches[pluginState.activeIndex];
					if (!match) return false;

					if (dispatch) {
						tr.insertText(replacement, match.from, match.to);
						dispatch(tr);
					}

					// Re-run search after replace
					setTimeout(() => {
						editor.commands.setSearchQuery(pluginState.query);
					}, 0);

					return true;
				},

			replaceAll:
				(replacement: string) =>
				({ editor, dispatch, tr, state }) => {
					const pluginState = searchPluginKey.getState(state);
					if (!pluginState || pluginState.matches.length === 0) return false;

					if (dispatch) {
						// Replace from end to start to preserve positions
						const sorted = [...pluginState.matches].sort(
							(a, b) => b.from - a.from,
						);
						for (const match of sorted) {
							tr.insertText(replacement, match.from, match.to);
						}
						dispatch(tr);
					}

					setTimeout(() => {
						editor.commands.setSearchQuery(pluginState.query);
					}, 0);

					return true;
				},
		};
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: searchPluginKey,
				state: {
					init(): SearchState {
						return {
							query: "",
							matches: [],
							activeIndex: -1,
							decorations: DecorationSet.empty,
						};
					},
					apply(tr: Transaction, prev: SearchState, oldState: EditorState, newState: EditorState): SearchState {
						const meta = tr.getMeta(searchPluginKey) as SearchState | undefined;
						if (meta) return meta;

						// Rebuild matches after document changes
						if (tr.docChanged && prev.query) {
							const matches = findMatches(newState.doc, prev.query);
							const activeIndex = Math.min(
								prev.activeIndex,
								matches.length - 1,
							);
							return {
								query: prev.query,
								matches,
								activeIndex,
								decorations: buildDecorations(newState, matches, activeIndex),
							};
						}

						if (tr.docChanged) {
							return {
								...prev,
								decorations: prev.decorations.map(tr.mapping, newState.doc),
							};
						}

						return prev;
					},
				},
				props: {
					decorations(state: EditorState) {
						return searchPluginKey.getState(state)?.decorations ?? DecorationSet.empty;
					},
				},
			}),
		];
	},
});

// ── Scroll helper ─────────────────────────────────────────────────────────────

const scrollToMatch = (editor: Editor, match: SearchMatch) => {
	try {
		const domResult = editor.view.domAtPos(match.from);
		const domNode = domResult.node;
		const el =
			domNode instanceof Element
				? domNode
				: (domNode as ChildNode).parentElement;
		el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
	} catch {
		// ignore scroll errors
	}
};
