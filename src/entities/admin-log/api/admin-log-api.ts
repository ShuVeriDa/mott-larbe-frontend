import { http } from "@/shared/api";
import type {
	AdminLogDetail,
	AdminLogsLiveResponse,
	AdminLogsListResponse,
	AdminLogsStats,
	FetchAdminLogsQuery,
} from "./types";

export const adminLogApi = {
	list: (query?: FetchAdminLogsQuery) =>
		http
			.get<AdminLogsListResponse>("/admin/logs", { params: query })
			.then((r) => r.data),

	stats: (query?: Pick<FetchAdminLogsQuery, "range" | "dateFrom" | "dateTo">) =>
		http
			.get<AdminLogsStats>("/admin/logs/stats", { params: query })
			.then((r) => r.data),

	live: (
		query?: { since?: string; liveLimit?: number } & Pick<
			FetchAdminLogsQuery,
			"tab" | "service"
		>,
	) =>
		http
			.get<AdminLogsLiveResponse>("/admin/logs/live", { params: query })
			.then((r) => r.data),

	getById: (id: string) =>
		http
			.get<AdminLogDetail>(`/admin/logs/${id}`)
			.then((r) => r.data),

	services: () =>
		http
			.get<{ services: string[] }>("/admin/logs/services")
			.then((r) => r.data),
};
