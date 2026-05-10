import type { TipTapDoc, TipTapNode } from "@/shared/ui/notion-editor";

const BLOCK_TYPES = new Set(["paragraph", "heading", "listItem"]);

const extractStats = (
	nodes: TipTapNode[],
): { text: string; paragraphs: number } => {
	let text = "";
	let paragraphs = 0;
	for (const node of nodes) {
		if (node.text) {
			text += node.text + " ";
		}
		if (BLOCK_TYPES.has(node.type)) {
			paragraphs++;
		}
		if (node.content?.length) {
			const child = extractStats(node.content);
			text += child.text;
			paragraphs += child.paragraphs;
		}
	}
	return { text, paragraphs };
};

export interface DocStats {
	words: number;
	chars: number;
	paragraphs: number;
}

export const computeDocStats = (doc: TipTapDoc): DocStats => {
	const { text, paragraphs } = extractStats(doc.content);
	const trimmed = text.trim();
	return {
		words: trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0,
		chars: text.replace(/\s/g, "").length,
		paragraphs: Math.max(paragraphs, 1),
	};
};

export const countWords = (doc: TipTapDoc): number => computeDocStats(doc).words;

export const hasTextContent = (doc: TipTapDoc): boolean => {
	const { text } = extractStats(doc.content);
	return text.trim().length > 0;
};
