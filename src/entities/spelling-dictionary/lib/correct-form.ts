export interface CorrectFormNode {
	text: string;
	superscript?: boolean;
}

const MARKER = "__cf__:";

/**
 * Parses correctForm string into structured nodes.
 * Supports both legacy plain strings and JSON-serialized node arrays.
 */
export const parseCorrectForm = (value: string): CorrectFormNode[] => {
	if (!value) return [{ text: "" }];
	if (value.startsWith(MARKER)) {
		try {
			return JSON.parse(value.slice(MARKER.length)) as CorrectFormNode[];
		} catch {
			// fall through to plain text
		}
	}
	return [{ text: value }];
};

/**
 * Serializes nodes to correctForm string for storage.
 * Plain text with no superscripts is stored as a legacy plain string (backward compat).
 */
export const serializeCorrectForm = (nodes: CorrectFormNode[]): string => {
	const allPlain = nodes.every(n => !n.superscript);
	if (allPlain) return nodes.map(n => n.text).join("");
	return MARKER + JSON.stringify(nodes);
};

/** Returns the display plain text (superscript chars included, no markers). */
export const getCorrectFormPlainText = (value: string): string =>
	parseCorrectForm(value)
		.map(n => n.text)
		.join("");

/** Returns true if the correctForm value contains any superscript nodes. */
export const correctFormHasSuperscript = (value: string): boolean =>
	parseCorrectForm(value).some(n => n.superscript);
