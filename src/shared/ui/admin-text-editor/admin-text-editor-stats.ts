import type { TipTapDoc, TipTapNode } from "@/shared/ui/notion-editor";

const extractText = (doc: TipTapDoc): string => {
	const walk = (nodes: TipTapNode[]): string =>
		nodes.map(node => (node.text ? node.text : walk(node.content ?? []))).join(" ");
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
			(acc, node) =>
				acc + (blockTypes.has(node.type) ? 1 : 0) + walk(node.content ?? []),
			0,
		);
	return Math.max(walk(doc.content), 1);
};

export const hasTextContent = (doc: TipTapDoc): boolean => {
	return extractText(doc).trim().length > 0;
};
