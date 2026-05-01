import { http } from "@/shared/api";
import type {
	AdminUsersListResponse,
	AdminUsersStats,
	FetchAdminUsersQuery,
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
};
