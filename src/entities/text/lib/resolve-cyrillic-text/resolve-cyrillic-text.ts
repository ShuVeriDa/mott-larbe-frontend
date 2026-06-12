import type { TextToken } from "../../api";

// Collapse whitespace runs to a single space and trim edges.
const normalizeWs = (s: string) => s.replace(/\s+/g, " ").trim();

// Given a selection made on transliterated (Latin/Arabic) text, resolve the
// corresponding Cyrillic text slice from cyrillicRaw.
//
// Strategy: iterate over every possible start token i. For each i, grow a
// combined string token-by-token (including Cyrillic inter-token gaps from
// cyrillicRaw, since punctuation/spaces are identical across scripts).
// Stop growing when normCombined === normSelected (exact match → return slice)
// or when normCombined is no longer a prefix of normSelected and doesn't equal
// it (wrong start token → break inner loop and try next i).
export const resolveCyrillicText = (
	displaySelected: string,
	displayTokens: readonly TextToken[],
	cyrillicRaw: string,
): string => {
	if (!displayTokens.length) return displaySelected;

	const normSelected = normalizeWs(displaySelected);

	for (let i = 0; i < displayTokens.length; i++) {
		let combined = "";
		for (let j = i; j < displayTokens.length; j++) {
			const tok = displayTokens[j];
			if (j > i) {
				const prevTok = displayTokens[j - 1];
				combined += cyrillicRaw.slice(prevTok.endOffset, tok.startOffset);
			}
			combined += tok.displayText ?? tok.original;

			const normCombined = normalizeWs(combined);

			if (normCombined === normSelected) {
				return cyrillicRaw.slice(displayTokens[i].startOffset, tok.endOffset);
			}

			// normSelected must start with normCombined for this run to be viable.
			// If it doesn't, this start token is wrong — break and try next i.
			if (!normSelected.startsWith(normCombined)) break;
		}
	}

	return displaySelected;
};
