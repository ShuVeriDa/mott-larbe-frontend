import { http } from "@/shared/api";
import type { AdminGenre, Genre } from "./types";

export const genreApi = {
	list: async (): Promise<Genre[]> => {
		const { data } = await http.get<Genre[]>("/genres");
		return data;
	},

	adminList: async (): Promise<AdminGenre[]> => {
		const { data } = await http.get<AdminGenre[]>("/admin/genres");
		return data;
	},

	create: async (dto: { name: string; slug: string; sortOrder?: number }): Promise<AdminGenre> => {
		const { data } = await http.post<AdminGenre>("/admin/genres", dto);
		return data;
	},

	update: async (id: string, dto: { name?: string; slug?: string; sortOrder?: number }): Promise<AdminGenre> => {
		const { data } = await http.patch<AdminGenre>(`/admin/genres/${id}`, dto);
		return data;
	},

	delete: async (id: string): Promise<void> => {
		await http.delete(`/admin/genres/${id}`);
	},
};
