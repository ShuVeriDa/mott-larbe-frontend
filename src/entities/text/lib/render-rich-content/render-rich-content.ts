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
	blockType?: "blockquote";
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

// Mirrors backend extractTextFromTiptap exactly: iterative stack, separator emitted
// immediately on pop (before children are processed), then node.text, then children pushed.
const nodeToRaw = (root: TipTapNode): string => {
	const result: string[] = [];
	const stack: TipTapNode[] = [root];
	while (stack.length) {
		const node = stack.pop()!;
		if (typeof node.text === "string") result.push(node.text);
		if (Array.isArray(node.content)) {
			for (let i = node.content.length - 1; i >= 0; i--) {
				stack.push(node.content[i]);
			}
		}
		switch (node.type) {
			case "paragraph": case "listItem": case "hardBreak": case "blockquote": result.push("\n"); break;
			case "heading": case "codeBlock": result.push("\n\n"); break;
		}
	}
	return result.join("");
};

// Reconstruct contentRaw from TipTap doc, mirroring the backend pipeline exactly.
export const contentRawFromRich = (contentRich: unknown): string => {
	const doc = contentRich as TipTapDoc;
	if (!doc?.content) return "";
	return nodeToRaw(doc as unknown as TipTapNode).replace(/\n{3,}/g, "\n\n").trim();
};

export const renderRichContent = (
	contentRich: unknown,
	tokens: readonly TextToken[],
): RichParagraph[] => {
	const doc = contentRich as TipTapDoc;
	if (!doc?.content) return [];

	// Reconstruct the same string the backend used to compute token offsets.
	const contentRaw = contentRawFromRich(contentRich);

	const sorted = [...tokens].sort((a, b) => a.startOffset - b.startOffset);
	let tokenIdx = 0;
	const paragraphs: RichParagraph[] = [];

	// rawCursor tracks our position in contentRaw.
	// We locate each text node by searching for it in contentRaw starting from rawCursor,
	// exactly like tokenize-content slices by offset — no arithmetic over TipTap node lengths.
	let rawCursor = 0;

	const processParagraphNode = (paraNode: TipTapNode, blockType?: "blockquote") => {
		const textAlign = (paraNode.attrs?.textAlign as RichParagraph["textAlign"]) ?? "left";
		const segments: RichSegment[] = [];

		const emitText = (text: string, marks: MarkAttrs) => {
			// Find this text node's actual position in contentRaw
			const found = contentRaw.indexOf(text, rawCursor);
			if (found === -1) return;
			const segStart = found;
			const segEnd = segStart + text.length;
			rawCursor = segEnd;
			let cursor = 0;

			while (cursor < text.length) {
				const absPos = segStart + cursor;

				while (tokenIdx < sorted.length && sorted[tokenIdx].endOffset <= absPos) {
					tokenIdx++;
				}

				const tok = sorted[tokenIdx];
				if (tok && tok.startOffset >= absPos && tok.startOffset < segEnd) {
					const relStart = tok.startOffset - segStart;
					const relEnd = tok.endOffset - segStart;
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
		};

		for (const node of paraNode.content ?? []) {
			if (node.type === "hardBreak") {
				segments.push({ kind: "text", value: "\n", marks: {} });
				// hardBreak is a \n in contentRaw; advance past it
				const nlPos = contentRaw.indexOf("\n", rawCursor);
				if (nlPos !== -1) rawCursor = nlPos + 1;
			} else if (node.type === "text" && node.text) {
				emitText(node.text, resolveMarks(node.marks));
			}
		}

		if (segments.length > 0) {
			paragraphs.push({ textAlign, segments, blockType });
		}
	};

	const walkNode = (node: TipTapNode) => {
		if (node.type === "paragraph") {
			processParagraphNode(node);
		} else if (node.type === "blockquote") {
			for (const child of node.content ?? []) {
				if (child.type === "paragraph") {
					processParagraphNode(child, "blockquote");
				} else {
					walkNode(child);
				}
			}
		}
	};

	for (const block of doc.content) {
		walkNode(block);
	}

	return paragraphs;
};
