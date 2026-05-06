import { http } from "@/shared/api";
import type {
	AdminSubscriptionDetail,
	AdminSubscriptionListItem,
	AdminSubscriptionsResponse,
	AdminSubscriptionsStats,
	CancelSubscriptionDto,
	CreateManualSubscriptionDto,
	ExtendSubscriptionDto,
	FetchSubscriptionsQuery,
} from "./types";

export const adminSubscriptionApi = {
	list: async (
		query: FetchSubscriptionsQuery = {},
	): Promise<AdminSubscriptionsResponse> => {
		const params: Record<string, unknown> = {};
		if (query.search) params.search = query.search;
		if (query.status) params.status = query.status;
		if (query.provider) params.provider = query.provider;
		if (query.planType) params.planType = query.planType;
		if (query.sort) params.sort = query.sort;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 25;

		const { data } = await http.get<AdminSubscriptionsResponse>(
			"/admin/subscriptions",
			{ params },
		);
		return data;
	},

	stats: async (): Promise<AdminSubscriptionsStats> => {
		const { data } = await http.get<AdminSubscriptionsStats>(
			"/admin/subscriptions/stats",
		);
		return data;
	},

	getById: async (id: string): Promise<AdminSubscriptionDetail> => {
		const { data } = await http.get<AdminSubscriptionDetail>(
			`/admin/subscriptions/${id}`,
		);
		return data;
	},

	create: async (
		dto: CreateManualSubscriptionDto,
	): Promise<AdminSubscriptionListItem> => {
		const { data } = await http.post<AdminSubscriptionListItem>(
			"/admin/subscriptions",
			dto,
		);
		return data;
	},

	cancel: async (id: string, dto?: CancelSubscriptionDto): Promise<void> => {
		await http.post(`/admin/subscriptions/${id}/cancel`, dto ?? {});
	},

	extend: async (id: string, dto: ExtendSubscriptionDto): Promise<void> => {
		await http.post(`/admin/subscriptions/${id}/extend`, dto);
	},

	exportCsv: async (query: FetchSubscriptionsQuery = {}): Promise<Blob> => {
		const { data } = await http.get<Blob>("/admin/subscriptions/export", {
			params: { ...query, format: "csv" },
			responseType: "blob",
		});
		return data;
	},
};
