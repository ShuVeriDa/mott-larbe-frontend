import { http } from "@/shared/api";
import type {
	BulkAssignDto,
	CreateFolderDto,
	Folder,
	FoldersSummary,
	ReorderFoldersDto,
	UpdateFolderDto,
} from "./types";

export const folderApi = {
	list: async (): Promise<Folder[]> => {
		const { data } = await http.get<Folder[]>("/dictionary/folders");
		return data;
	},

	summary: async (): Promise<FoldersSummary> => {
		const { data } = await http.get<FoldersSummary>(
			"/dictionary/folders/summary",
		);
		return data;
	},

	byId: async (id: string): Promise<Folder> => {
		const { data } = await http.get<Folder>(`/dictionary/folders/${id}`);
		return data;
	},

	create: async (body: CreateFolderDto): Promise<Folder> => {
		const { data } = await http.post<Folder>("/dictionary/folders", body);
		return data;
	},

	update: async (id: string, body: UpdateFolderDto): Promise<Folder> => {
		const { data } = await http.patch<Folder>(
			`/dictionary/folders/${id}`,
			body,
		);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/dictionary/folders/${id}`);
	},

	reorder: async (body: ReorderFoldersDto): Promise<{ reordered: number }> => {
		const { data } = await http.patch<{ reordered: number }>(
			"/dictionary/folders/reorder",
			body,
		);
		return data;
	},

	bulkAssignEntries: async (body: BulkAssignDto): Promise<void> => {
		await http.patch("/dictionary/entries/bulk-assign", body);
	},
};
