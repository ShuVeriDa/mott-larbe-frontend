import { http } from "@/shared/api";
import type {
	AdminUserDetail,
	AdminUsersListResponse,
	AdminUsersStats,
	FetchAdminUsersQuery,
	FetchUserEventsQuery,
	UserEventsSummary,
	UserEventsResponse,
	UserFeatureFlagItem,
	UserRoleItem,
	UserSessionItem,
	UserSubscriptionResponse,
	RoleName,
} from "./types";

export const adminUserApi = {
	list: async (
		query: FetchAdminUsersQuery = {},
	): Promise<AdminUsersListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.q) params.q = query.q;
		if (query.role) params.role = query.role;
		if (query.plan) params.plan = query.plan;
		if (query.tab && query.tab !== "all") params.tab = query.tab;
		if (query.sort) params.sort = query.sort;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 25;

		const { data } = await http.get<AdminUsersListResponse>("/admin/users", {
			params,
		});
		return data;
	},

	stats: async (): Promise<AdminUsersStats> => {
		const { data } = await http.get<AdminUsersStats>("/admin/users/stats");
		return data;
	},

	block: async (id: string): Promise<void> => {
		await http.post(`/admin/users/${id}/block`);
	},

	unblock: async (id: string): Promise<void> => {
		await http.post(`/admin/users/${id}/unblock`);
	},

	freeze: async (id: string): Promise<void> => {
		await http.post(`/admin/users/${id}/freeze`);
	},

	unfreeze: async (id: string): Promise<void> => {
		await http.post(`/admin/users/${id}/unfreeze`);
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/admin/users/${id}`);
	},

	bulkFreeze: async (ids: string[]): Promise<void> => {
		await http.post("/admin/users/bulk/freeze", { ids });
	},

	bulkBlock: async (ids: string[]): Promise<void> => {
		await http.post("/admin/users/bulk/block", { ids });
	},

	bulkResetRoles: async (ids: string[]): Promise<void> => {
		await http.post("/admin/users/bulk/reset-roles", { ids });
	},

	exportCsv: async (query: FetchAdminUsersQuery = {}): Promise<Blob> => {
		const { data } = await http.get<Blob>("/admin/users/export", {
			params: { ...query, format: "csv" },
			responseType: "blob",
		});
		return data;
	},

	getById: async (id: string): Promise<AdminUserDetail> => {
		const { data } = await http.get<AdminUserDetail>(`/admin/users/${id}`);
		return data;
	},

	// ── Roles ────────────────────────────────────────────────────────────────
	getRoles: async (id: string): Promise<UserRoleItem[]> => {
		const { data } = await http.get<UserRoleItem[]>(`/admin/users/${id}/roles`);
		return data;
	},

	assignRole: async (id: string, roleName: RoleName): Promise<UserRoleItem> => {
		const { data } = await http.post<UserRoleItem>(`/admin/users/${id}/roles`, { roleName });
		return data;
	},

	revokeRole: async (id: string, roleId: string): Promise<void> => {
		await http.delete(`/admin/users/${id}/roles/${roleId}`);
	},

	// ── Events ───────────────────────────────────────────────────────────────
	getEvents: async (id: string, query: FetchUserEventsQuery = {}): Promise<UserEventsResponse> => {
		const params: Record<string, unknown> = {};
		if (query.type) params.type = query.type;
		if (query.period && query.period !== "all") params.period = query.period;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 25;
		const { data } = await http.get<UserEventsResponse>(`/admin/users/${id}/events`, { params });
		return data;
	},

	getEventsSummary: async (id: string): Promise<UserEventsSummary> => {
		const { data } = await http.get<UserEventsSummary>(`/admin/users/${id}/events/summary`);
		return data;
	},

	// ── Subscription ─────────────────────────────────────────────────────────
	getSubscription: async (id: string): Promise<UserSubscriptionResponse> => {
		const { data } = await http.get<UserSubscriptionResponse>(`/admin/users/${id}/subscription`);
		return data;
	},

	cancelSubscription: async (id: string, subId: string): Promise<void> => {
		await http.post(`/admin/users/${id}/subscriptions/${subId}/cancel`);
	},

	extendSubscription: async (id: string, subId: string, days: number): Promise<void> => {
		await http.post(`/admin/users/${id}/subscriptions/${subId}/extend`, { days });
	},

	// ── Sessions ─────────────────────────────────────────────────────────────
	getSessions: async (id: string): Promise<UserSessionItem[]> => {
		const { data } = await http.get<UserSessionItem[]>(`/admin/users/${id}/sessions`);
		return data;
	},

	logoutAll: async (id: string): Promise<void> => {
		await http.post(`/admin/users/${id}/logout-all`);
	},

	// ── Feature Flags ─────────────────────────────────────────────────────────
	getFeatureFlags: async (id: string): Promise<UserFeatureFlagItem[]> => {
		const { data } = await http.get<UserFeatureFlagItem[]>(`/admin/users/${id}/feature-flags`);
		return data;
	},

	setFeatureFlag: async (id: string, flagId: string, value: boolean): Promise<void> => {
		await http.put(`/admin/users/${id}/feature-flags/${flagId}`, { value });
	},

	deleteFeatureFlag: async (id: string, flagId: string): Promise<void> => {
		await http.delete(`/admin/users/${id}/feature-flags/${flagId}`);
	},

	// ── Coupon ───────────────────────────────────────────────────────────────
	applyCoupon: async (id: string, code: string): Promise<void> => {
		await http.post(`/admin/users/${id}/apply-coupon`, { code });
	},
};
