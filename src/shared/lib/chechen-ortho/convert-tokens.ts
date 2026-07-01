import type { TextToken } from "@/entities/text";

import { modernToOld } from "./modern-to-old";

// Returns a new tokens array with displayText converted to old orthography.
// Only creates new token objects where the text actually changed.
// Does not mutate the original array.
export const convertTokensToOld = (tokens: TextToken[]): TextToken[] =>
	tokens.map((token) => {
		const source = token.displayText ?? token.original;
		const converted = modernToOld(source);
		if (converted === undefined) return token;
		return { ...token, displayText: converted };
	});
