import { http } from "@/shared/api";
import type { Note, CreateNoteDto, UpdateNoteDto } from "./types";

export const noteApi = {
	getForPage: async (textId: string, pageNumber: number): Promise<Note[]> => {
		const { data } = await http.get<Note[]>(`/notes`, {
			params: { textId, pageNumber },
		});
		return data;
	},

	create: async (dto: CreateNoteDto): Promise<Note> => {
		const { data } = await http.post<Note>("/notes", dto);
		return data;
	},

	update: async (id: string, dto: UpdateNoteDto): Promise<Note> => {
		const { data } = await http.patch<Note>(`/notes/${id}`, dto);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/notes/${id}`);
	},
};
