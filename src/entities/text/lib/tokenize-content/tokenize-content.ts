import type { TextToken } from "../../api";

export type ParagraphSegment =
	| { kind: "text"; value: string }
	| { kind: "token"; token: TextToken };

export interface TokenizedParagraph {
	segments: ParagraphSegment[];
}

const PARAGRAPH_SEPARATOR = /\r?\n\s*\r?\n/;

export const tokenizeContent = (
	contentRaw: string,
	tokens: readonly TextToken[],
): TokenizedParagraph[] => {
	if (!contentRaw) return [];

	const sorted = [...tokens].sort((a, b) => a.start - b.start);
	const paragraphs: TokenizedParagraph[] = [];

	let cursor = 0;
	const re = new RegExp(PARAGRAPH_SEPARATOR, "g");
	const boundaries: number[] = [];
	let match: RegExpExecArray | null;
	while ((match = re.exec(contentRaw))) {
		boundaries.push(match.index);
		boundaries.push(match.index + match[0].length);
	}
	boundaries.push(contentRaw.length);

	let i = 0;
	let tokenIdx = 0;

	while (cursor < contentRaw.length) {
		const paraEnd = boundaries[i] ?? contentRaw.length;
		const segments: ParagraphSegment[] = [];
		let textCursor = cursor;

		while (
			tokenIdx < sorted.length &&
			sorted[tokenIdx].start < paraEnd
		) {
			const tok = sorted[tokenIdx];
			if (tok.start < cursor) {
				tokenIdx += 1;
				continue;
			}
			if (textCursor < tok.start) {
				segments.push({
					kind: "text",
					value: contentRaw.slice(textCursor, tok.start),
				});
			}
			segments.push({ kind: "token", token: tok });
			textCursor = tok.end;
			tokenIdx += 1;
		}

		if (textCursor < paraEnd) {
			segments.push({
				kind: "text",
				value: contentRaw.slice(textCursor, paraEnd),
			});
		}

		if (segments.length > 0) {
			paragraphs.push({ segments });
		}

		const skipEnd = boundaries[i + 1] ?? contentRaw.length;
		cursor = skipEnd;
		i += 2;
	}

	return paragraphs;
};
