import { http } from "@/shared/api";
import type { CreateFolderDto, Folder } from "./types";

export const folderApi = {
	list: async (): Promise<Folder[]> => {
		const { data } = await http.get<Folder[]>("/dictionary/folders");
		return data;
	},

	create: async (body: CreateFolderDto): Promise<Folder> => {
		const { data } = await http.post<Folder>("/dictionary/folders", body);
		return data;
	},
};
