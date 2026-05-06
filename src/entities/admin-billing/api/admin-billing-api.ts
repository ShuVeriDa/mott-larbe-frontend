import { http } from "@/shared/api";
import type {
	AdminCoupon,
	AdminCouponsListResponse,
	AdminPlan,
	AdminSubscriptionsListResponse,
	BillingStats,
	CreateCouponDto,
	CreatePlanDto,
	FetchCouponsQuery,
	FetchPlansQuery,
	FetchSubscriptionsQuery,
	PlanRevenueItem,
	SubscriptionStats,
	UpdateCouponDto,
	UpdatePlanDto,
	UpdatePlanLimitsDto,
} from "./types";

export const adminBillingApi = {
	// ── Stats ─────────────────────────────────────────────────────────────────
	getStats: async (): Promise<BillingStats> => {
		const { data } = await http.get<BillingStats>("/admin/billing/stats");
		return data;
	},

	getRevenue: async (): Promise<PlanRevenueItem[]> => {
		const { data } = await http.get<PlanRevenueItem[]>("/admin/billing/revenue");
		return data;
	},

	// ── Plans ─────────────────────────────────────────────────────────────────
	getPlans: async (query: FetchPlansQuery = {}): Promise<AdminPlan[]> => {
		const params: Record<string, unknown> = {};
		if (query.onlyActive !== undefined) params.onlyActive = query.onlyActive;
		if (query.type) params.type = query.type;
		const { data } = await http.get<AdminPlan[]>("/admin/plans", { params });
		return data;
	},

	createPlan: async (dto: CreatePlanDto): Promise<AdminPlan> => {
		const { data } = await http.post<AdminPlan>("/admin/plans", dto);
		return data;
	},

	updatePlan: async (id: string, dto: UpdatePlanDto): Promise<AdminPlan> => {
		const { data } = await http.patch<AdminPlan>(`/admin/plans/${id}`, dto);
		return data;
	},

	deactivatePlan: async (id: string): Promise<AdminPlan> => {
		const { data } = await http.post<AdminPlan>(`/admin/plans/${id}/deactivate`);
		return data;
	},

	deletePlan: async (id: string): Promise<void> => {
		await http.delete(`/admin/plans/${id}`);
	},

	updatePlanLimits: async (id: string, dto: UpdatePlanLimitsDto): Promise<AdminPlan> => {
		const { data } = await http.patch<AdminPlan>(`/admin/plans/${id}/limits`, dto);
		return data;
	},

	// ── Subscriptions ─────────────────────────────────────────────────────────
	getSubscriptionStats: async (): Promise<SubscriptionStats> => {
		const { data } = await http.get<SubscriptionStats>("/admin/subscriptions/stats");
		return data;
	},

	getSubscriptions: async (
		query: FetchSubscriptionsQuery = {},
	): Promise<AdminSubscriptionsListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.status) params.status = query.status;
		if (query.provider) params.provider = query.provider;
		if (query.planType) params.planType = query.planType;
		if (query.search) params.search = query.search;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 10;
		const { data } =
			await http.get<AdminSubscriptionsListResponse>("/admin/subscriptions", {
				params,
			});
		return data;
	},

	// ── Coupons ───────────────────────────────────────────────────────────────
	getCoupons: async (
		query: FetchCouponsQuery = {},
	): Promise<AdminCouponsListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.status) params.status = query.status;
		if (query.search) params.search = query.search;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 20;
		const { data } = await http.get<AdminCouponsListResponse>("/admin/coupons", {
			params,
		});
		return data;
	},

	createCoupon: async (dto: CreateCouponDto): Promise<AdminCoupon> => {
		const { data } = await http.post<AdminCoupon>("/admin/coupons", dto);
		return data;
	},

	updateCoupon: async (id: string, dto: UpdateCouponDto): Promise<AdminCoupon> => {
		const { data } = await http.patch<AdminCoupon>(`/admin/coupons/${id}`, dto);
		return data;
	},

	deleteCoupon: async (id: string): Promise<void> => {
		await http.delete(`/admin/coupons/${id}`);
	},
};

// re-export types so other modules can import from one place
export type { AdminCoupon, SubscriptionStats, UpdatePlanLimitsDto } from "./types";
