"use client";

import type { AnnotatedFormOnPage } from "@/features/word-annotation/api/types";
import { Extension } from "@tiptap/core";
import type { Node as PmNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { EditorView } from "@tiptap/pm/view";

interface WordAnnotationHighlightState {
	forms: AnnotatedFormOnPage[];
	decorations: DecorationSet;
}

const pluginKey = new PluginKey<WordAnnotationHighlightState>("wordAnnotationHighlight");

export const WORD_ANNOTATION_CLICK_EVENT = "editor:word-annotation-click";

export interface WordAnnotationClickDetail {
	normalized: string;
	tokenId: string;
	isAnnotated: boolean;
	x: number;
	y: number;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		wordAnnotationHighlight: {
			setWordAnnotationHighlights: (forms: AnnotatedFormOnPage[]) => ReturnType;
		};
	}
}

const WORD_CHAR_RE = /\p{L}|\p{N}/u;
const isWordChar = (c: string) => WORD_CHAR_RE.test(c);

const buildDecorations = (doc: EditorState["doc"], forms: AnnotatedFormOnPage[]): DecorationSet => {
	if (!forms.length) return DecorationSet.empty;

	// Merge forms with the same normalized value — multiple lemmas can annotate the same word form.
	// occurrences order is the same across all entries for the same normalized form;
	// a token is annotated if ANY of the form entries marks it as annotated.
	const mergedByNormalized = new Map<string, { tokenIds: string[]; annotatedSet: Set<string> }>();
	for (const f of forms) {
		const existing = mergedByNormalized.get(f.normalized);
		if (existing) {
			for (const o of f.pageOccurrences) {
				if (o.isAnnotated) existing.annotatedSet.add(o.tokenId);
			}
		} else {
			mergedByNormalized.set(f.normalized, {
				tokenIds: f.pageOccurrences.map(o => o.tokenId),
				annotatedSet: new Set(f.pageOccurrences.filter(o => o.isAnnotated).map(o => o.tokenId)),
			});
		}
	}

	// Build lookup: normalized → ordered tokenIds (by position = occurrenceIndex)
	const occurrenceTokenIds = new Map<string, string[]>(
		[...mergedByNormalized.entries()].map(([n, v]) => [n, v.tokenIds]),
	);
	const annotatedTokenIdSet = new Set<string>(
		[...mergedByNormalized.values()].flatMap(v => [...v.annotatedSet]),
	);

	// Deduplicated list of unique normalized forms for the doc walk
	const uniqueForms = [...mergedByNormalized.keys()].map(n => ({ normalized: n }));

	const decos: Decoration[] = [];
	const occurrenceCounters = new Map<string, number>();

	doc.descendants((node: PmNode, pos: number) => {
		if (!node.isText || !node.text) return;
		const text = node.text;
		const lower = text.toLowerCase();

		for (const form of uniqueForms) {
			if (!form.normalized) continue;
			const formLower = form.normalized.toLowerCase();
			let from = 0;
			while (from < text.length) {
				const idx = lower.indexOf(formLower, from);
				if (idx === -1) break;
				const before = idx > 0 ? lower[idx - 1] : " ";
				const after = idx + formLower.length < lower.length ? lower[idx + formLower.length] : " ";
				if (!isWordChar(before) && !isWordChar(after)) {
					const occurrenceIndex = occurrenceCounters.get(form.normalized) ?? 0;
					occurrenceCounters.set(form.normalized, occurrenceIndex + 1);

					const tokenIds = occurrenceTokenIds.get(form.normalized);
					const tokenId = tokenIds?.[occurrenceIndex] ?? "";
					const isAnnotated = tokenId ? annotatedTokenIdSet.has(tokenId) : false;

					decos.push(
						Decoration.inline(pos + idx, pos + idx + formLower.length, {
							class: isAnnotated
								? "word-annotation-highlight"
								: "word-annotation-highlight-partial",
							"data-annotation-normalized": form.normalized,
							"data-annotation-token-id": tokenId,
							"data-annotation-is-annotated": isAnnotated ? "1" : "0",
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
				(forms: AnnotatedFormOnPage[]) =>
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
						const highlight = target.closest(".word-annotation-highlight, .word-annotation-highlight-partial") as HTMLElement | null;
						if (!highlight) return false;
						const normalized = highlight.dataset.annotationNormalized;
						const tokenId = highlight.dataset.annotationTokenId ?? "";
						const isAnnotated = highlight.dataset.annotationIsAnnotated === "1";
						if (!normalized) return false;
						document.dispatchEvent(
							new CustomEvent<WordAnnotationClickDetail>(WORD_ANNOTATION_CLICK_EVENT, {
								detail: { normalized, tokenId, isAnnotated, x: event.clientX, y: event.clientY },
							}),
						);
						return true;
					},
				},
			}),
		];
	},
});
