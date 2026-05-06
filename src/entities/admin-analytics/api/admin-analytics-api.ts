import { http } from "@/shared/api";
import type {
	AdminAnalyticsResponse,
	AnalyticsExportResponse,
	DifficultTextsResponse,
	FetchAdminAnalyticsQuery,
	PopularTextsResponse,
} from "./types";

export const adminAnalyticsApi = {
	overview: (query?: FetchAdminAnalyticsQuery) =>
		http
			.get<AdminAnalyticsResponse>("/admin/analytics", { params: query })
			.then((r) => r.data),

	difficultTexts: (query?: FetchAdminAnalyticsQuery) =>
		http
			.get<DifficultTextsResponse>("/admin/analytics/difficult-texts", {
				params: query,
			})
			.then((r) => r.data),

	popularTexts: (query?: FetchAdminAnalyticsQuery) =>
		http
			.get<PopularTextsResponse>("/admin/analytics/popular-texts", {
				params: query,
			})
			.then((r) => r.data),

	export: async (
		query?: FetchAdminAnalyticsQuery & { format?: "json" | "csv" },
	): Promise<void> => {
		const { data } = await http.get<AnalyticsExportResponse>(
			"/admin/analytics/export",
			{ params: query },
		);
		const mimeType =
			data.format === "csv" ? "text/csv;charset=utf-8;" : "application/json";
		const blob = new Blob([data.content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = data.fileName;
		anchor.click();
		URL.revokeObjectURL(url);
	},
};
