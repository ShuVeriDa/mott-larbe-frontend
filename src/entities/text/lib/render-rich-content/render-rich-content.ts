import type { TextToken } from "../../api";

export interface MarkAttrs {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	color?: string;
}

export interface RichSegment {
	kind: "text" | "token";
	value: string;
	token?: TextToken;
	marks: MarkAttrs;
}

export interface RichParagraph {
	textAlign: "left" | "center" | "right" | "justify";
	segments: RichSegment[];
}

interface TipTapMark {
	type: string;
	attrs?: Record<string, unknown>;
}

interface TipTapNode {
	type: string;
	text?: string;
	marks?: TipTapMark[];
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
}

interface TipTapDoc {
	type: "doc";
	content?: TipTapNode[];
}

const resolveMarks = (marks: TipTapMark[] | undefined): MarkAttrs => {
	if (!marks) return {};
	const result: MarkAttrs = {};
	for (const m of marks) {
		if (m.type === "bold") result.bold = true;
		if (m.type === "italic") result.italic = true;
		if (m.type === "underline") result.underline = true;
		if (m.type === "textStyle") {
			const color = (m.attrs as { color?: string } | undefined)?.color;
			if (color) result.color = color;
		}
	}
	return result;
};

// Mirrors backend extractTextFromTiptap: DFS, children first, then node.text, then separator.
const nodeToRaw = (node: TipTapNode): string => {
	let out = "";
	for (const child of node.content ?? []) out += nodeToRaw(child);
	if (typeof node.text === "string") out += node.text;
	switch (node.type) {
		case "paragraph": case "listItem": case "hardBreak": case "blockquote": out += "\n"; break;
		case "heading": case "codeBlock": out += "\n\n"; break;
	}
	return out;
};

export const renderRichContent = (
	contentRich: unknown,
	tokens: readonly TextToken[],
): RichParagraph[] => {
	const doc = contentRich as TipTapDoc;
	if (!doc?.content) return [];

	const blocks = doc.content;

	// Pre-compute each block's raw contribution, then find the trim offset.
	// Backend: join → replace(\n{3,}, \n\n) → trim
	const blockRaws = blocks.map(nodeToRaw);
	const joinedRaw = blockRaws.join("").replace(/\n{3,}/g, "\n\n");
	const trimStart = joinedRaw.length - joinedRaw.trimStart().length;

	const sorted = [...tokens].sort((a, b) => a.startOffset - b.startOffset);
	let tokenIdx = 0;
	const paragraphs: RichParagraph[] = [];

	// rawCursor tracks our position in joinedRaw (before trim adjustment)
	let rawCursor = 0;

	for (let bi = 0; bi < blocks.length; bi++) {
		const block = blocks[bi];
		const blockStart = rawCursor - trimStart; // offset in contentRaw
		rawCursor += blockRaws[bi].length;

		if (block.type !== "paragraph") continue;

		const textAlign = (block.attrs?.textAlign as RichParagraph["textAlign"]) ?? "left";
		const segments: RichSegment[] = [];
		let intraOffset = 0;

		const emitText = (text: string, marks: MarkAttrs) => {
			const absStart = blockStart + intraOffset;
			let cursor = 0;

			while (cursor < text.length) {
				const absPos = absStart + cursor;

				// Advance past tokens that ended before current position
				while (tokenIdx < sorted.length && sorted[tokenIdx].endOffset <= absPos) {
					tokenIdx++;
				}

				const tok = sorted[tokenIdx];
				if (tok && tok.startOffset >= absPos && tok.startOffset < absStart + text.length) {
					const relStart = tok.startOffset - absStart;
					const relEnd = tok.endOffset - absStart;
					if (cursor < relStart) {
						segments.push({ kind: "text", value: text.slice(cursor, relStart), marks });
					}
					segments.push({ kind: "token", value: text.slice(relStart, relEnd), token: tok, marks });
					cursor = relEnd;
					tokenIdx++;
				} else {
					segments.push({ kind: "text", value: text.slice(cursor), marks });
					cursor = text.length;
				}
			}
			intraOffset += text.length;
		};

		for (const node of block.content ?? []) {
			if (node.type === "hardBreak") {
				segments.push({ kind: "text", value: "\n", marks: {} });
				intraOffset += 1;
			} else if (node.type === "text" && node.text) {
				emitText(node.text, resolveMarks(node.marks));
			}
		}

		if (segments.length > 0) {
			paragraphs.push({ textAlign, segments });
		}
	}

	return paragraphs;
};
