import { http } from "@/shared/api";
import type {
	CreateTextPhraseDto,
	PatchTextPhraseDto,
	TextPhraseDetail,
	TextPhraseListQuery,
	TextPhraseListResponse,
	TextPhraseListItem,
} from "./types";

const buildParams = (q: TextPhraseListQuery): Record<string, string | number> => {
	const p: Record<string, string | number> = {};
	if (q.q) p.q = q.q;
	if (q.language) p.language = q.language;
	if (q.page) p.page = q.page;
	if (q.limit) p.limit = q.limit;
	return p;
};

export const textPhraseApi = {
	list: async (query: TextPhraseListQuery = {}): Promise<TextPhraseListResponse> => {
		const { data } = await http.get<TextPhraseListResponse>("/admin/text-phrases", {
			params: buildParams(query),
		});
		return data;
	},

	detail: async (id: string): Promise<TextPhraseDetail> => {
		const { data } = await http.get<TextPhraseDetail>(`/admin/text-phrases/${id}`);
		return data;
	},

	create: async (body: CreateTextPhraseDto): Promise<TextPhraseListItem> => {
		const { data } = await http.post<TextPhraseListItem>("/admin/text-phrases", body);
		return data;
	},

	update: async (id: string, body: PatchTextPhraseDto): Promise<TextPhraseListItem> => {
		const { data } = await http.patch<TextPhraseListItem>(`/admin/text-phrases/${id}`, body);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/admin/text-phrases/${id}`);
	},

	removeOccurrence: async (occurrenceId: string): Promise<void> => {
		await http.delete(`/admin/text-phrases/occurrences/${occurrenceId}`);
	},
};
