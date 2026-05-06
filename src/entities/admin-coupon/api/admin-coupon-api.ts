import { http } from "@/shared/api";
import type {
	AdminCouponDetail,
	AdminCouponStats,
	AdminCouponsListResponse,
	CreateCouponDto,
	FetchCouponsQuery,
	UpdateCouponDto,
} from "./types";

export const adminCouponApi = {
	getStats: async (): Promise<AdminCouponStats> => {
		const { data } = await http.get<AdminCouponStats>("/admin/coupons/stats");
		return data;
	},

	getList: async (query: FetchCouponsQuery = {}): Promise<AdminCouponsListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.type) params.type = query.type;
		if (query.status) params.status = query.status;
		if (query.plan) params.plan = query.plan;
		if (query.search) params.search = query.search;
		if (query.sortBy) params.sortBy = query.sortBy;
		if (query.sortOrder) params.sortOrder = query.sortOrder;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 25;
		const { data } = await http.get<AdminCouponsListResponse>("/admin/coupons", { params });
		return data;
	},

	getById: async (id: string): Promise<AdminCouponDetail> => {
		const { data } = await http.get<AdminCouponDetail>(`/admin/coupons/${id}`);
		return data;
	},

	create: async (dto: CreateCouponDto): Promise<AdminCouponDetail> => {
		const { data } = await http.post<AdminCouponDetail>("/admin/coupons", dto);
		return data;
	},

	update: async (id: string, dto: UpdateCouponDto): Promise<AdminCouponDetail> => {
		const { data } = await http.patch<AdminCouponDetail>(`/admin/coupons/${id}`, dto);
		return data;
	},

	deactivate: async (id: string): Promise<AdminCouponDetail> => {
		const { data } = await http.post<AdminCouponDetail>(`/admin/coupons/${id}/deactivate`);
		return data;
	},

	activate: async (id: string): Promise<AdminCouponDetail> => {
		const { data } = await http.post<AdminCouponDetail>(`/admin/coupons/${id}/activate`);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/admin/coupons/${id}`);
	},

	exportCsv: async (query: Omit<FetchCouponsQuery, "page" | "limit"> = {}): Promise<Blob> => {
		const params: Record<string, unknown> = {};
		if (query.type) params.type = query.type;
		if (query.status) params.status = query.status;
		if (query.plan) params.plan = query.plan;
		if (query.search) params.search = query.search;
		if (query.sortBy) params.sortBy = query.sortBy;
		if (query.sortOrder) params.sortOrder = query.sortOrder;
		const { data } = await http.get<Blob>("/admin/coupons/export", {
			params,
			responseType: "blob",
		});
		return data;
	},
};
