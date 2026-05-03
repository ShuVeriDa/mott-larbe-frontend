import { http } from "@/shared/api";
import type { AdminDashboardResponse, DashboardQueryParams } from "./types";

export const adminDashboardApi = {
	getDashboard: (query: DashboardQueryParams = {}): Promise<AdminDashboardResponse> => {
		const params: Record<string, unknown> = {};
		if (query.period) params.period = query.period;
		if (query.dateFrom) params.dateFrom = query.dateFrom;
		if (query.dateTo) params.dateTo = query.dateTo;
		return http.get<AdminDashboardResponse>("/admin/dashboard", { params }).then((r) => r.data);
	},

	exportDashboard: (query: DashboardQueryParams = {}, format: "json" | "csv" = "csv"): Promise<string> => {
		const params: Record<string, unknown> = { format };
		if (query.period) params.period = query.period;
		if (query.dateFrom) params.dateFrom = query.dateFrom;
		if (query.dateTo) params.dateTo = query.dateTo;
		return http
			.get<string>("/admin/dashboard/export", { params, responseType: "text" })
			.then((r) => r.data);
	},
};
