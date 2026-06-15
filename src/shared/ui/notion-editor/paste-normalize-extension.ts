import { Extension } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		pasteNormalize: {
			pasteAsPlainText: (text: string) => ReturnType;
			normalizeText: () => ReturnType;
		};
	}
}

// True if this line ends a logical paragraph (don't merge with next line)
const isParagraphEnd = (line: string): boolean => {
	const trimmed = line.trimEnd();
	// Ends with sentence-closing punctuation
	return /[.!?…»"'\]–—]\s*$/.test(trimmed);
};

// True if next line starts a new logical paragraph regardless of previous line
const isParagraphStart = (line: string): boolean => {
	const trimmed = line.trimStart();
	// Dialogue line, or empty
	return trimmed === "" || /^[—–-]\s/.test(trimmed);
};

/**
 * Merges soft-wrapped lines that came from PDF/Word page-width wrapping.
 * Input: array of non-empty paragraph strings already extracted from the editor.
 * Output: array of merged paragraph strings.
 *
 * Rule:
 *   - If current line ends the sentence (.!?…»"') → keep as separate paragraph
 *   - If next line starts with — (dialogue) → keep current as separate paragraph
 *   - Otherwise → merge current into next with a space (soft wrap)
 */
const mergeWrappedLines = (lines: string[]): string[] => {
	if (lines.length === 0) return [];

	const result: string[] = [];
	let buffer = lines[0];

	for (let i = 1; i < lines.length; i++) {
		const next = lines[i];

		if (isParagraphEnd(buffer) || isParagraphStart(next)) {
			// Hard break — flush buffer as its own paragraph
			result.push(buffer);
			buffer = next;
		} else {
			// Soft wrap — trim both sides before joining to avoid double spaces
			// or missing space when PDF strips trailing space before line break
			buffer = `${buffer.trimEnd()} ${next.trimStart()}`;
		}
	}
	result.push(buffer);
	return result;
};

/**
 * Converts a plain-text string (with \n\n paragraph breaks and \n soft wraps)
 * into a TipTap node array of paragraphs.
 * Used when pasting raw clipboard text.
 */
const plainTextToNodes = (rawText: string) => {
	const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// Split on explicit double-newline paragraph breaks first
	const blocks = text.split(/\n{2,}/);

	const paragraphs: string[] = [];
	for (const block of blocks) {
		const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
		if (lines.length === 0) continue;
		const merged = mergeWrappedLines(lines);
		paragraphs.push(...merged);
	}

	return paragraphs.map(p => ({
		type: "paragraph" as const,
		content: p ? [{ type: "text", text: p }] : [],
	}));
};

/**
 * Normalizes already-pasted content in the editor:
 * extracts all paragraphs as plain text lines and merges soft-wrapped ones.
 * Headings are preserved as-is (not merged).
 */
const extractAndNormalize = (editor: Editor): boolean => {
	const doc = editor.getJSON();
	if (!doc.content) return false;

	// Collect nodes preserving heading vs paragraph distinction
	interface RawNode {
		type: "heading" | "paragraph";
		level?: number;
		text: string;
	}

	const rawNodes: RawNode[] = [];

	const walk = (nodes: typeof doc.content) => {
		for (const node of nodes ?? []) {
			if (node.type === "heading") {
				const text = (node.content ?? [])
					.filter(n => n.type === "text")
					.map(n => n.text ?? "")
					.join("");
				rawNodes.push({ type: "heading", level: (node.attrs?.level as number) ?? 1, text });
			} else if (node.type === "paragraph") {
				const text = (node.content ?? [])
					.filter(n => n.type === "text")
					.map(n => n.text ?? "")
					.join("");
				rawNodes.push({ type: "paragraph", text });
			} else if (node.content) {
				walk(node.content);
			}
		}
	};
	walk(doc.content);

	// Separate into runs of consecutive paragraphs; merge soft wraps within each run
	const resultNodes: Array<{ type: string; attrs?: Record<string, unknown>; content?: Array<{ type: string; text: string }> }> = [];

	let paragraphBuffer: string[] = [];

	const flushParagraphs = () => {
		if (paragraphBuffer.length === 0) return;
		const merged = mergeWrappedLines(paragraphBuffer.filter(t => t !== ""));
		for (const text of merged) {
			resultNodes.push({
				type: "paragraph",
				content: text ? [{ type: "text", text }] : [],
			});
		}
		paragraphBuffer = [];
	};

	for (const node of rawNodes) {
		if (node.type === "heading") {
			flushParagraphs();
			resultNodes.push({
				type: "heading",
				attrs: { level: node.level },
				content: node.text ? [{ type: "text", text: node.text }] : [],
			});
		} else {
			paragraphBuffer.push(node.text);
		}
	}
	flushParagraphs();

	if (resultNodes.length === 0) return false;

	editor.chain().setContent({ type: "doc", content: resultNodes }, true).run();
	return true;
};

export const PasteNormalizeExtension = Extension.create({
	name: "pasteNormalize",

	addCommands() {
		return {
			pasteAsPlainText:
				(text: string) =>
				({ editor }) => {
					const nodes = plainTextToNodes(text);
					editor.chain().focus().insertContent(nodes, { updateSelection: true }).run();
					return true;
				},

			normalizeText:
				() =>
				({ editor }) => {
					return extractAndNormalize(editor as unknown as Editor);
				},
		};
	},

	addKeyboardShortcuts() {
		return {
			"Mod-Shift-v": ({ editor }) => {
				navigator.clipboard
					.readText()
					.then(text => {
						if (!text) return;
						const nodes = plainTextToNodes(text);
						editor.chain().focus().insertContent(nodes, { updateSelection: true }).run();
					})
					.catch(() => {
						// Clipboard access denied — browser security policy
					});
				return true;
			},
		};
	},
});
