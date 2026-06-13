// Arabic combining diacritics only — Arabic letters (U+0621-U+064A) are intentionally excluded.
// Ranges:
//   U+0610-U+061A  extended Arabic annotation marks
//   U+064B-U+065F  harakat: tanwin-fath/kasr/damm, fatha, kasra, damma, sukun, shadda,
//                  inv-damma (U+0657), softness mark (U+06EC is below, but U+065F covers ٟ)
//   U+0670         superscript alef
//   U+06D6-U+06DC  Quranic annotation signs
//   U+06DF-U+06ED  Quranic signs incl. nūn-miniature U+06E8 and softness mark U+06EC
const ARABIC_DIACRITIC_RE =
	/[ؐ-ًؚ-ٰٟۖ-ۜ۟-ۭ]/g;

export const stripArabicDiacritics = (text: string): string =>
	text.replace(ARABIC_DIACRITIC_RE, "");

// Walk a TipTap doc recursively and strip diacritics from all text nodes.
// Returns a new doc object (shallow-cloned only where text differs).
export const stripDiacriticsFromDoc = <T extends object>(doc: T): T => {
	if (!doc || typeof doc !== "object") return doc;
	const node = doc as Record<string, unknown>;
	if (typeof node["text"] === "string") {
		const stripped = stripArabicDiacritics(node["text"]);
		if (stripped === node["text"]) return doc;
		return { ...node, text: stripped } as unknown as T;
	}
	if (Array.isArray(node["content"])) {
		const newContent = (node["content"] as unknown[]).map((child) =>
			stripDiacriticsFromDoc(child as object),
		);
		return { ...node, content: newContent } as unknown as T;
	}
	return doc;
};
