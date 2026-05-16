import { http } from "@/shared/api";
import type {
	AnnotateTokenDto,
	AnnotateTokenResponse,
	AnnotatedFormOnPage,
	BatchAnnotateDto,
	BatchAnnotateResponse,
	CreateMorphFormDto,
	CreateMorphFormResponse,
	LemmaSearchResult,
	MorphFormDetail,
	MorphFormListResponse,
	PatchMorphFormDto,
	TokenOccurrence,
} from "./types";

export const annotationApi = {
	searchLemmas: async (
		q: string,
		language = "CHE",
	): Promise<LemmaSearchResult[]> => {
		const { data } = await http.get<LemmaSearchResult[]>(
			"/admin/lemmas/search",
			{ params: { q, language } },
		);
		return data;
	},

	annotateToken: async (
		tokenId: string,
		dto: AnnotateTokenDto,
	): Promise<AnnotateTokenResponse> => {
		const { data } = await http.post<AnnotateTokenResponse>(
			`/admin/tokens/${tokenId}/annotate`,
			dto,
		);
		return data;
	},

	createMorphForm: async (
		dto: CreateMorphFormDto,
	): Promise<CreateMorphFormResponse> => {
		const { data } = await http.post<CreateMorphFormResponse>(
			"/admin/morph-forms",
			dto,
		);
		return data;
	},

	getTokenOccurrences: async (
		normalized: string,
		textId: string,
	): Promise<TokenOccurrence[]> => {
		const { data } = await http.get<TokenOccurrence[]>(
			"/admin/token-occurrences",
			{ params: { normalized, textId } },
		);
		return data;
	},

	batchAnnotate: async (dto: BatchAnnotateDto): Promise<BatchAnnotateResponse> => {
		const { data } = await http.post<BatchAnnotateResponse>(
			"/admin/tokens/batch-annotate",
			dto,
		);
		return data;
	},

	getAnnotatedFormsByPage: async (
		textId: string,
		pageNumber: number,
	): Promise<AnnotatedFormOnPage[]> => {
		const { data } = await http.get<AnnotatedFormOnPage[]>("/admin/annotated-forms", {
			params: { textId, pageNumber },
		});
		return data;
	},

	listMorphForms: async (params: {
		q?: string;
		page?: number;
		limit?: number;
	}): Promise<MorphFormListResponse> => {
		const { data } = await http.get<MorphFormListResponse>("/admin/morph-forms", {
			params,
		});
		return data;
	},

	getMorphForm: async (id: string): Promise<MorphFormDetail> => {
		const { data } = await http.get<MorphFormDetail>(`/admin/morph-forms/${id}`);
		return data;
	},

	updateMorphForm: async (id: string, dto: PatchMorphFormDto): Promise<MorphFormDetail> => {
		const { data } = await http.patch<MorphFormDetail>(`/admin/morph-forms/${id}`, dto);
		return data;
	},

	deleteMorphForm: async (id: string): Promise<{ success: boolean }> => {
		const { data } = await http.delete<{ success: boolean }>(`/admin/morph-forms/${id}`);
		return data;
	},
};
