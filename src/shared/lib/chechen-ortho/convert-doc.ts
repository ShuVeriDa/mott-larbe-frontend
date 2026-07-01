import { modernToOld } from "./modern-to-old";

// Walk a TipTap doc recursively and convert text nodes from new to old Chechen orthography.
// Returns a new doc object (shallow-cloned only where text differs).
export const convertDocToOld = <T extends object>(doc: T): T => {
	if (!doc || typeof doc !== "object") return doc;
	const node = doc as Record<string, unknown>;
	if (typeof node["text"] === "string") {
		const converted = convertTextToOld(node["text"]);
		if (converted === node["text"]) return doc;
		return { ...node, text: converted } as unknown as T;
	}
	if (Array.isArray(node["content"])) {
		const newContent = (node["content"] as unknown[]).map((child) =>
			convertDocToOld(child as object),
		);
		return { ...node, content: newContent } as unknown as T;
	}
	return doc;
};

const convertTextToOld = (text: string): string =>
	text
		.split(/(\s+)/)
		.map((chunk) => {
			if (/^\s+$/.test(chunk)) return chunk;
			return modernToOld(chunk) ?? chunk;
		})
		.join("");
