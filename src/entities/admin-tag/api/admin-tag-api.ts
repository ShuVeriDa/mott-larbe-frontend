import { http } from "@/shared/api";
import type { AdminTag } from "./types";

export const adminTagApi = {
	list: async (): Promise<AdminTag[]> => {
		const { data } = await http.get<AdminTag[]>("/admin/tags");
		return data;
	},
};
