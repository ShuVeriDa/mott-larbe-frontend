import type { TextToken, TipTapDoc, TipTapNode } from "../../api";

export interface MarkAttrs {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	superscript?: boolean;
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
	headingLevel?: 1 | 2 | 3 | 4;
	headingFontWeight?: string;
	// Cyrillic plain text of this paragraph — used for highlight/note matching
	// when segments contain transliterated display text (non-Cyrillic scripts).
	cyrillicText?: string;
}

const resolveMarks = (marks: TipTapNode["marks"]): MarkAttrs => {
	if (!marks) return {};
	const result: MarkAttrs = {};
	for (const m of marks) {
		if (m.type === "bold") result.bold = true;
		if (m.type === "italic") result.italic = true;
		if (m.type === "underline") result.underline = true;
		if (m.type === "superscript") result.superscript = true;
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
export const contentRawFromRich = (contentRich: TipTapDoc): string => {
	if (!contentRich?.content) return "";
	return nodeToRaw(contentRich as unknown as TipTapNode).replace(/\n{3,}/g, "\n\n").trim();
};

export const renderRichContent = (
	contentRich: TipTapDoc,
	tokens: readonly TextToken[],
	displayOnly?: boolean,
	cyrillicRaw?: string,
	cyrillicContentRich?: TipTapDoc,
): RichParagraph[] => {
	if (!contentRich?.content) return [];

	// In displayOnly mode the content is transliterated — char offsets from the
	// Cyrillic contentRaw don't apply. Emit every text node as a plain text segment.
	if (displayOnly) {
		const paragraphs: RichParagraph[] = [];
		const emitDisplayOnly = (paraNode: TipTapNode, blockType?: "blockquote", headingLevel?: 1 | 2 | 3 | 4) => {
			const textAlign = (paraNode.attrs?.textAlign as RichParagraph["textAlign"]) ?? "left";
			const headingFontWeight = headingLevel
				? ((paraNode.attrs?.fontWeight as string | undefined) ?? undefined)
				: undefined;
			const segments: RichSegment[] = [];
			for (const node of paraNode.content ?? []) {
				if (node.type === "hardBreak") {
					segments.push({ kind: "text", value: "\n", marks: {} });
				} else if (node.type === "text" && node.text) {
					segments.push({ kind: "text", value: node.text, marks: resolveMarks(node.marks) });
				}
			}
			if (segments.length > 0) paragraphs.push({ textAlign, segments, blockType, headingLevel, headingFontWeight });
		};
		const walkDisplayOnly = (node: TipTapNode) => {
			if (node.type === "paragraph") {
				emitDisplayOnly(node);
			} else if (node.type === "heading") {
				const level = ((node.attrs?.level as number | undefined) ?? 2) as 1 | 2 | 3 | 4;
				emitDisplayOnly(node, undefined, level);
			} else if (node.type === "blockquote") {
				for (const child of node.content ?? []) {
					if (child.type === "paragraph") emitDisplayOnly(child, "blockquote");
					else walkDisplayOnly(child);
				}
			}
		};
		for (const block of contentRich.content) walkDisplayOnly(block);
		return paragraphs;
	}

	// When contentRich is transliterated (non-Cyrillic script), use the original
	// Cyrillic contentRich for offset-mapping (token positions refer to Cyrillic text).
	// The transliterated contentRich is only used to extract display text for plain segments.
	const mappingDoc = cyrillicContentRich ?? contentRich;

	// Use the provided Cyrillic raw string, or reconstruct it from the mapping doc.
	const contentRaw = cyrillicRaw ?? contentRawFromRich(mappingDoc);

	const sorted = [...tokens].sort((a, b) => a.startOffset - b.startOffset);
	let tokenIdx = 0;
	const paragraphs: RichParagraph[] = [];

	// rawCursor tracks our position in contentRaw.
	// We locate each text node by searching for it in contentRaw starting from rawCursor,
	// exactly like tokenize-content slices by offset — no arithmetic over TipTap node lengths.
	let rawCursor = 0;

	const processParagraphNode = (
		cyrParaNode: TipTapNode,
		blockType?: "blockquote",
		headingLevel?: 1 | 2 | 3 | 4,
	) => {
		const textAlign = (cyrParaNode.attrs?.textAlign as RichParagraph["textAlign"]) ?? "left";
		const headingFontWeight = headingLevel
			? ((cyrParaNode.attrs?.fontWeight as string | undefined) ?? undefined)
			: undefined;
		const segments: RichSegment[] = [];

		const emitText = (cyrText: string, marks: MarkAttrs) => {
			// Find this text node's actual position in the Cyrillic contentRaw
			const found = contentRaw.indexOf(cyrText, rawCursor);
			if (found === -1) return;
			const segStart = found;
			const segEnd = segStart + cyrText.length;
			rawCursor = segEnd;
			let cursor = 0;

			// Advance past tokens that fully ended before this segment
			while (tokenIdx < sorted.length && sorted[tokenIdx].endOffset <= segStart) {
				tokenIdx++;
			}

			// Cross-node token: started in a previous text node, overlaps into this one.
			// This happens e.g. when a nazalization marker splits "жан" | superscript-н | "-жӏаьла"
			// into separate TipTap nodes but the tokenizer kept "жан-жӏаьла" as one token.
			// The token's displayText was already emitted in the previous node — skip this overlap.
			const leadingTok = sorted[tokenIdx];
			if (leadingTok && leadingTok.startOffset < segStart && leadingTok.endOffset > segStart) {
				const overlapEnd = Math.min(leadingTok.endOffset - segStart, cyrText.length);
				cursor = overlapEnd;
				if (leadingTok.endOffset <= segEnd) tokenIdx++;
				if (cursor >= cyrText.length) return;
			}

			while (cursor < cyrText.length) {
				const absPos = segStart + cursor;

				while (tokenIdx < sorted.length && sorted[tokenIdx].endOffset <= absPos) {
					tokenIdx++;
				}

				const tok = sorted[tokenIdx];
				if (tok && tok.startOffset >= absPos && tok.startOffset < segEnd) {
					const relStart = tok.startOffset - segStart;
					const relEnd = Math.min(tok.endOffset - segStart, cyrText.length);
					if (cursor < relStart) {
						// Text between tokens — punctuation/spaces, same in all scripts
						segments.push({ kind: "text", value: cyrText.slice(cursor, relStart), marks });
					}
					segments.push({ kind: "token", value: tok.displayText ?? cyrText.slice(relStart, relEnd), token: tok, marks });
					cursor = relEnd;
					if (tok.endOffset <= segEnd) tokenIdx++;
				} else {
					// Remainder — punctuation/spaces after last token in segment
					segments.push({ kind: "text", value: cyrText.slice(cursor), marks });
					cursor = cyrText.length;
				}
			}
		};

		// Collect Cyrillic plain text for highlight/note matching when non-Cyrillic
		const cyrillicParts: string[] = [];

		for (const cyrNode of cyrParaNode.content ?? []) {
			if (cyrNode.type === "hardBreak") {
				segments.push({ kind: "text", value: "\n", marks: {} });
				cyrillicParts.push("\n");
				// hardBreak is a \n in contentRaw; advance past it
				const nlPos = contentRaw.indexOf("\n", rawCursor);
				if (nlPos !== -1) rawCursor = nlPos + 1;
			} else if (cyrNode.type === "text" && cyrNode.text) {
				// In script mode (cyrillicContentRich present), superscript-н is a
				// nazalization marker — backend already merged it into the preceding
				// transliterated node as ŋ/tanwin. Advance rawCursor but emit nothing.
				const isNazalizationMarker =
					cyrillicContentRich != null &&
					cyrNode.text.trim() === "н" &&
					cyrNode.marks?.some((m) => m.type === "superscript");
				if (isNazalizationMarker) {
					const found = contentRaw.indexOf(cyrNode.text, rawCursor);
					if (found !== -1) rawCursor = found + cyrNode.text.length;
					continue;
				}
				cyrillicParts.push(cyrNode.text);
				emitText(cyrNode.text, resolveMarks(cyrNode.marks));
			}
		}

		if (segments.length > 0) {
			const cyrillicText = cyrillicContentRich ? cyrillicParts.join("") : undefined;
			paragraphs.push({ textAlign, segments, blockType, headingLevel, headingFontWeight, cyrillicText });
		}
	};

	const walkNode = (cyrNode: TipTapNode) => {
		if (cyrNode.type === "paragraph") {
			processParagraphNode(cyrNode);
		} else if (cyrNode.type === "heading") {
			const level = ((cyrNode.attrs?.level as number | undefined) ?? 2) as 1 | 2 | 3 | 4;
			processParagraphNode(cyrNode, undefined, level);
		} else if (cyrNode.type === "blockquote") {
			for (const child of cyrNode.content ?? []) {
				if (child.type === "paragraph") {
					processParagraphNode(child, "blockquote");
				} else {
					walkNode(child);
				}
			}
		}
	};

	for (const block of mappingDoc.content) {
		walkNode(block);
	}

	return paragraphs;
};
