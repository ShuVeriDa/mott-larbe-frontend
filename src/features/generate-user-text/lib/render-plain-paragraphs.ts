import type { TipTapDoc } from "@/shared/ui/notion-editor";

export const renderPlainParagraphs = (doc: TipTapDoc): string[] =>
	doc.content
		.map((node) => node.content?.map((child) => child.text ?? "").join("") ?? "")
		.filter((text) => text.length > 0);
