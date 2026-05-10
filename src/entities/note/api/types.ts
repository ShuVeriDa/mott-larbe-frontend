export interface Note {
	id: string;
	textId: string;
	pageNumber: number;
	selectedText: string | null;
	body: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateNoteDto {
	textId: string;
	pageNumber: number;
	selectedText?: string;
	body: string;
}

export interface UpdateNoteDto {
	body: string;
}
