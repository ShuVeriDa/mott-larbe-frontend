import { http } from "@/shared/api";
import type {
	FetchTokenizationTextsQuery,
	ProblematicTokensResponse,
	RunTokenizationDto,
	TokenizationDistribution,
	TokenizationQueue,
	TokenizationSettings,
	TokenizationStats,
	TokenizationTextDetail,
	TokenizationTextListResponse,
	UpdateTokenizationSettingsDto,
} from "./types";

export const tokenizationApi = {
	stats: async (): Promise<TokenizationStats> => {
		const { data } = await http.get<TokenizationStats>("/admin/tokenization/stats");
		return data;
	},

	distribution: async (): Promise<TokenizationDistribution> => {
		const { data } = await http.get<TokenizationDistribution>("/admin/tokenization/distribution");
		return data;
	},

	settings: async (): Promise<TokenizationSettings> => {
		const { data } = await http.get<TokenizationSettings>("/admin/tokenization/settings");
		return data;
	},

	updateSettings: async (dto: UpdateTokenizationSettingsDto): Promise<TokenizationSettings> => {
		const { data } = await http.patch<TokenizationSettings>("/admin/tokenization/settings", dto);
		return data;
	},

	list: async (query: FetchTokenizationTextsQuery = {}): Promise<TokenizationTextListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.tab && query.tab !== "all") params.tab = query.tab;
		if (query.search) params.search = query.search;
		if (query.level) params.level = query.level;
		if (query.sort) params.sort = query.sort;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 20;

		const { data } = await http.get<TokenizationTextListResponse>("/admin/tokenization/texts", { params });
		return data;
	},

	textDetail: async (textId: string): Promise<TokenizationTextDetail> => {
		const { data } = await http.get<TokenizationTextDetail>(`/admin/tokenization/texts/${textId}`);
		return data;
	},

	textTokens: async (
		textId: string,
		params: { status?: string; page?: number; limit?: number } = {},
	): Promise<ProblematicTokensResponse> => {
		const { data } = await http.get<ProblematicTokensResponse>(
			`/admin/tokenization/texts/${textId}/tokens`,
			{ params },
		);
		return data;
	},

	queue: async (): Promise<TokenizationQueue> => {
		const { data } = await http.get<TokenizationQueue>("/admin/tokenization/queue");
		return data;
	},

	run: async (dto: RunTokenizationDto): Promise<{ started: number; textIds: string[] }> => {
		const { data } = await http.post<{ started: number; textIds: string[] }>(
			"/admin/tokenization/run",
			dto,
		);
		return data;
	},

	runText: async (textId: string): Promise<{ textId: string; started: boolean }> => {
		const { data } = await http.post<{ textId: string; started: boolean }>(
			`/admin/tokenization/texts/${textId}/run`,
		);
		return data;
	},

	cancelText: async (textId: string): Promise<{ textId: string; cancelled: boolean }> => {
		const { data } = await http.delete<{ textId: string; cancelled: boolean }>(
			`/admin/tokenization/texts/${textId}/run`,
		);
		return data;
	},

	resetText: async (textId: string): Promise<{ textId: string; reset: boolean }> => {
		const { data } = await http.delete<{ textId: string; reset: boolean }>(
			`/admin/tokenization/texts/${textId}/tokens`,
		);
		return data;
	},

	bulkRun: async (textIds: string[]): Promise<{ started: number; textIds: string[] }> => {
		const { data } = await http.post<{ started: number; textIds: string[] }>(
			"/admin/tokenization/bulk/run",
			{ textIds },
		);
		return data;
	},

	bulkReset: async (textIds: string[]): Promise<{ reset: number }> => {
		const { data } = await http.post<{ reset: number }>(
			"/admin/tokenization/bulk/reset",
			{ textIds },
		);
		return data;
	},
};
