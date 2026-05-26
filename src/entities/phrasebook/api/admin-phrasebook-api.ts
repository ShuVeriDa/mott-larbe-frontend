import { http } from "@/shared/api";
import type {
	AdminPhrasebookCategory,
	AdminPhrasebookPhrase,
	AdminPhrasesResponse,
	AdminSuggestionsResponse,
	CreateAdminCategoryDto,
	UpdateAdminCategoryDto,
	CreateAdminPhraseDto,
	UpdateAdminPhraseDto,
	AdminPhrasesQuery,
} from "./admin-types";

const buildPhrasesParams = (q: AdminPhrasesQuery): Record<string, string | number> => {
	const p: Record<string, string | number> = {};
	if (q.categoryId) p.categoryId = q.categoryId;
	if (q.search) p.search = q.search;
	if (q.page) p.page = q.page;
	if (q.limit) p.limit = q.limit;
	return p;
};

export const adminPhrasebookApi = {
	getCategories: async (): Promise<AdminPhrasebookCategory[]> => {
		const { data } = await http.get<AdminPhrasebookCategory[]>("/admin/phrasebook/categories");
		return data;
	},

	createCategory: async (dto: CreateAdminCategoryDto): Promise<AdminPhrasebookCategory> => {
		const { data } = await http.post<AdminPhrasebookCategory>("/admin/phrasebook/categories", dto);
		return data;
	},

	updateCategory: async (id: string, dto: UpdateAdminCategoryDto): Promise<AdminPhrasebookCategory> => {
		const { data } = await http.patch<AdminPhrasebookCategory>(`/admin/phrasebook/categories/${id}`, dto);
		return data;
	},

	deleteCategory: async (id: string): Promise<void> => {
		await http.delete(`/admin/phrasebook/categories/${id}`);
	},

	getPhrases: async (query: AdminPhrasesQuery): Promise<AdminPhrasesResponse> => {
		const { data } = await http.get<AdminPhrasesResponse>("/admin/phrasebook/phrases", {
			params: buildPhrasesParams(query),
		});
		return data;
	},

	createPhrase: async (dto: CreateAdminPhraseDto): Promise<AdminPhrasebookPhrase> => {
		const { data } = await http.post<AdminPhrasebookPhrase>("/admin/phrasebook/phrases", dto);
		return data;
	},

	updatePhrase: async (id: string, dto: UpdateAdminPhraseDto): Promise<AdminPhrasebookPhrase> => {
		const { data } = await http.patch<AdminPhrasebookPhrase>(`/admin/phrasebook/phrases/${id}`, dto);
		return data;
	},

	deletePhrase: async (id: string): Promise<void> => {
		await http.delete(`/admin/phrasebook/phrases/${id}`);
	},

	getSuggestions: async (page = 1, limit = 50): Promise<AdminSuggestionsResponse> => {
		const { data } = await http.get<AdminSuggestionsResponse>("/admin/phrasebook/suggestions", {
			params: { page, limit },
		});
		return data;
	},

	deleteSuggestion: async (id: string): Promise<void> => {
		await http.delete(`/admin/phrasebook/suggestions/${id}`);
	},
};
