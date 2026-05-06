import { http } from "@/shared/api";
import type {
	AdminPaymentDetail,
	AdminPaymentListItem,
	AdminPaymentProviderItem,
	AdminPaymentChartItem,
	AdminPaymentStats,
	AdminPaymentsListResponse,
	FetchPaymentChartQuery,
	FetchPaymentsQuery,
	RefundPaymentDto,
} from "./types";

export const adminPaymentApi = {
	getStats: async (): Promise<AdminPaymentStats> => {
		const { data } = await http.get<AdminPaymentStats>("/admin/payments/stats");
		return data;
	},

	getChart: async (
		query: FetchPaymentChartQuery = {},
	): Promise<AdminPaymentChartItem[]> => {
		const params: Record<string, unknown> = {};
		if (query.dateFrom) params.dateFrom = query.dateFrom;
		if (query.dateTo) params.dateTo = query.dateTo;
		const { data } = await http.get<AdminPaymentChartItem[]>(
			"/admin/payments/chart",
			{ params },
		);
		return data;
	},

	getByProvider: async (): Promise<AdminPaymentProviderItem[]> => {
		const { data } = await http.get<AdminPaymentProviderItem[]>(
			"/admin/payments/by-provider",
		);
		return data;
	},

	list: async (
		query: FetchPaymentsQuery = {},
	): Promise<AdminPaymentsListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.status) params.status = query.status;
		if (query.provider) params.provider = query.provider;
		if (query.planId) params.planId = query.planId;
		if (query.search) params.search = query.search;
		if (query.dateFrom) params.dateFrom = query.dateFrom;
		if (query.dateTo) params.dateTo = query.dateTo;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 25;
		const { data } = await http.get<AdminPaymentsListResponse>(
			"/admin/payments",
			{ params },
		);
		return data;
	},

	getById: async (id: string): Promise<AdminPaymentDetail> => {
		const { data } = await http.get<AdminPaymentDetail>(
			`/admin/payments/${id}`,
		);
		return data;
	},

	refund: async (
		id: string,
		dto: RefundPaymentDto,
	): Promise<AdminPaymentListItem> => {
		const { data } = await http.post<AdminPaymentListItem>(
			`/admin/payments/${id}/refund`,
			dto,
		);
		return data;
	},

	sendReceipt: async (id: string, email?: string): Promise<void> => {
		await http.post(
			`/admin/payments/${id}/send-receipt`,
			email ? { email } : {},
		);
	},

	exportCsv: async (query: FetchPaymentsQuery = {}): Promise<Blob> => {
		const { data } = await http.get<Blob>("/admin/payments/export.csv", {
			params: query,
			responseType: "blob",
		});
		return data;
	},
};
