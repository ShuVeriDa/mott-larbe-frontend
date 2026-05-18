export type HighlightColor =
	| "yellow"
	| "green"
	| "blue"
	| "pink"
	| "orange"
	| "purple"
	| "teal"
	| "red"
	| string; // custom hex color from palette

export interface Highlight {
	id: string;
	textId: string;
	pageNumber: number;
	startOffset: number;
	endOffset: number;
	selectedText: string;
	color: HighlightColor;
	createdAt: string;
	updatedAt: string;
}

export interface CreateHighlightDto {
	textId: string;
	pageNumber: number;
	color: HighlightColor;
	startOffset: number;
	endOffset: number;
	selectedText: string;
}

export interface UpdateHighlightDto {
	color: HighlightColor;
}
