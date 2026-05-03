import { http } from "@/shared/api";
import type {
	AdminDictContextsResponse,
	AdminDictEntryCard,
	AdminDictFrequencyStats,
	AdminDictListQuery,
	AdminDictListResponse,
	AdminDictNavEntry,
	AdminDictRelatedLemma,
	AdminDictStats,
	AdminDictUserStats,
	AddAdminLemmaDto,
	CreateAdminEntryDto,
	CreateAdminExampleDto,
	CreateAdminHeadwordDto,
	CreateAdminMorphFormDto,
	CreateAdminSenseDto,
	PatchAdminEntryDto,
	UpdateAdminExampleDto,
	UpdateAdminMorphFormDto,
	UpdateAdminSenseDto,
	AdminDictExample,
	AdminDictSense,
	AdminDictMorphForm,
	AdminDictHeadword,
} from "./admin-dictionary-types";

const buildListParams = (q: AdminDictListQuery): Record<string, string | number> => {
	const p: Record<string, string | number> = {};
	if (q.q) p.q = q.q;
	if (q.language) p.language = q.language;
	if (q.pos) p.pos = q.pos;
	if (q.level) p.level = q.level;
	if (q.sort) p.sort = q.sort;
	if (q.tab) p.tab = q.tab;
	if (q.page) p.page = q.page;
	if (q.limit) p.limit = q.limit;
	return p;
};

export const adminDictionaryApi = {
	stats: async (): Promise<AdminDictStats> => {
		const { data } = await http.get<AdminDictStats>("/admin/dictionary/stats");
		return data;
	},

	list: async (query: AdminDictListQuery): Promise<AdminDictListResponse> => {
		const { data } = await http.get<AdminDictListResponse>("/admin/dictionary", {
			params: buildListParams(query),
		});
		return data;
	},

	detail: async (id: string): Promise<AdminDictEntryCard> => {
		const { data } = await http.get<AdminDictEntryCard>(`/admin/dictionary/${id}`);
		return data;
	},

	update: async (id: string, body: PatchAdminEntryDto): Promise<AdminDictEntryCard> => {
		const { data } = await http.patch<AdminDictEntryCard>(`/admin/dictionary/${id}`, body);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/admin/dictionary/${id}`);
	},

	create: async (body: CreateAdminEntryDto): Promise<AdminDictEntryCard> => {
		const { data } = await http.post<AdminDictEntryCard>("/admin/dictionary", body);
		return data;
	},

	next: async (id: string): Promise<AdminDictNavEntry | null> => {
		const { data } = await http.get<AdminDictNavEntry | null>(`/admin/dictionary/${id}/next`);
		return data;
	},

	prev: async (id: string): Promise<AdminDictNavEntry | null> => {
		const { data } = await http.get<AdminDictNavEntry | null>(`/admin/dictionary/${id}/prev`);
		return data;
	},

	relatedLemmas: async (id: string): Promise<AdminDictRelatedLemma[]> => {
		const { data } = await http.get<AdminDictRelatedLemma[]>(`/admin/dictionary/${id}/related-lemmas`);
		return data;
	},

	frequencyStats: async (id: string): Promise<AdminDictFrequencyStats> => {
		const { data } = await http.get<AdminDictFrequencyStats>(`/admin/dictionary/${id}/frequency-stats`);
		return data;
	},

	userStats: async (id: string): Promise<AdminDictUserStats> => {
		const { data } = await http.get<AdminDictUserStats>(`/admin/dictionary/${id}/user-stats`);
		return data;
	},

	contexts: async (id: string, limit = 20): Promise<AdminDictContextsResponse> => {
		const { data } = await http.get<AdminDictContextsResponse>(`/admin/dictionary/${id}/contexts`, {
			params: { limit },
		});
		return data;
	},

	// Senses
	addSense: async (lemmaId: string, body: CreateAdminSenseDto): Promise<AdminDictSense> => {
		const { data } = await http.post<AdminDictSense>(`/admin/dictionary/${lemmaId}/senses`, body);
		return data;
	},

	updateSense: async (senseId: string, body: UpdateAdminSenseDto): Promise<AdminDictSense> => {
		const { data } = await http.patch<AdminDictSense>(`/admin/dictionary/senses/${senseId}`, body);
		return data;
	},

	deleteSense: async (senseId: string): Promise<void> => {
		await http.delete(`/admin/dictionary/senses/${senseId}`);
	},

	// Examples
	addExample: async (senseId: string, body: CreateAdminExampleDto): Promise<AdminDictExample> => {
		const { data } = await http.post<AdminDictExample>(`/admin/dictionary/senses/${senseId}/examples`, body);
		return data;
	},

	updateExample: async (exampleId: string, body: UpdateAdminExampleDto): Promise<AdminDictExample> => {
		const { data } = await http.patch<AdminDictExample>(`/admin/dictionary/examples/${exampleId}`, body);
		return data;
	},

	deleteExample: async (exampleId: string): Promise<void> => {
		await http.delete(`/admin/dictionary/examples/${exampleId}`);
	},

	// Headwords
	addHeadword: async (lemmaId: string, body: CreateAdminHeadwordDto): Promise<AdminDictHeadword> => {
		const { data } = await http.post<AdminDictHeadword>(`/admin/dictionary/${lemmaId}/headwords`, body);
		return data;
	},

	deleteHeadword: async (hwId: string): Promise<void> => {
		await http.delete(`/admin/dictionary/headwords/${hwId}`);
	},

	// Morph forms
	addForm: async (lemmaId: string, body: CreateAdminMorphFormDto): Promise<AdminDictMorphForm> => {
		const { data } = await http.post<AdminDictMorphForm>(`/admin/dictionary/${lemmaId}/forms`, body);
		return data;
	},

	updateForm: async (formId: string, body: UpdateAdminMorphFormDto): Promise<AdminDictMorphForm> => {
		const { data } = await http.patch<AdminDictMorphForm>(`/admin/dictionary/forms/${formId}`, body);
		return data;
	},

	deleteForm: async (formId: string): Promise<void> => {
		await http.delete(`/admin/dictionary/forms/${formId}`);
	},

	// Add lemma to existing entry
	addLemma: async (entryId: string, body: AddAdminLemmaDto): Promise<AdminDictEntryCard> => {
		const { data } = await http.post<AdminDictEntryCard>(`/admin/dictionary/entries/${entryId}/lemmas`, body);
		return data;
	},
};
