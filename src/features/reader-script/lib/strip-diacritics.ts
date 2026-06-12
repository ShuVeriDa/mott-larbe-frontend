// Arabic combining diacritics (harakat) Unicode range
const ARABIC_DIACRITIC_RE = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۤۧۨ-ۭ]/g;

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
