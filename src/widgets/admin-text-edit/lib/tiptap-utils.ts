import type { TipTapDoc, TipTapNode } from "../model/use-admin-text-edit-page";

const extractText = (doc: TipTapDoc): string => {
	const walk = (nodes: TipTapNode[]): string =>
		nodes.map((n) => (n.text ? n.text : walk(n.content ?? []))).join(" ");
	return walk(doc.content);
};

export const countWords = (doc: TipTapDoc): number => {
	const text = extractText(doc).trim();
	return text ? text.split(/\s+/).filter(Boolean).length : 0;
};

export const countChars = (doc: TipTapDoc): number => {
	return extractText(doc).replace(/\s/g, "").length;
};

export const countParagraphs = (doc: TipTapDoc): number => {
	const blockTypes = new Set(["paragraph", "heading", "listItem"]);
	const walk = (nodes: TipTapNode[]): number =>
		nodes.reduce(
			(acc, n) => acc + (blockTypes.has(n.type) ? 1 : 0) + walk(n.content ?? []),
			0,
		);
	return Math.max(walk(doc.content), 1);
};

export const countWordsInRaw = (raw: string): number => {
	if (!raw) return 0;
	return raw.trim().split(/\s+/).filter(Boolean).length;
};
