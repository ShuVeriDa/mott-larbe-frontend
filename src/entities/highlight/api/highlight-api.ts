import { http } from "@/shared/api";
import type { Highlight, CreateHighlightDto, UpdateHighlightDto } from "./types";

export const highlightApi = {
	getForPage: async (textId: string, pageNumber: number): Promise<Highlight[]> => {
		const { data } = await http.get<Highlight[]>("/highlights", {
			params: { textId, pageNumber },
		});
		return data;
	},

	create: async (dto: CreateHighlightDto): Promise<Highlight> => {
		const { data } = await http.post<Highlight>("/highlights", dto);
		return data;
	},

	update: async (id: string, dto: UpdateHighlightDto): Promise<Highlight> => {
		const { data } = await http.patch<Highlight>(`/highlights/${id}`, dto);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/highlights/${id}`);
	},
};
