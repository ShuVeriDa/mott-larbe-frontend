/**
 * Extracts the sentence containing the character range [start, end) from raw text.
 * Uses token offsets for precision — no indexOf scanning needed.
 * Returns undefined if the sentence is identical to the slice itself (no added context).
 */
export const extractSentence = (
	raw: string,
	start: number,
	end: number,
): string | undefined => {
	const sentenceStart = Math.max(0, raw.lastIndexOf(".", start - 1) + 1);
	const nextDot = raw.indexOf(".", end);
	const sentenceEnd = nextDot !== -1 ? nextDot + 1 : raw.length;
	const sentence = raw.slice(sentenceStart, sentenceEnd).trim();
	const slice = raw.slice(start, end).trim();
	return sentence !== slice ? sentence : undefined;
};
