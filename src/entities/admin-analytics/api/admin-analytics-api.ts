import { http } from "@/shared/api";
import type {
	AdminAnalyticsResponse,
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

	export: (query?: FetchAdminAnalyticsQuery & { format?: "json" | "csv" }) => {
		const params = new URLSearchParams();
		if (query?.range) params.set("range", query.range);
		if (query?.dateFrom) params.set("dateFrom", query.dateFrom);
		if (query?.dateTo) params.set("dateTo", query.dateTo);
		params.set("format", query?.format ?? "csv");
		const base =
			process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555/api";
		window.open(`${base}/admin/analytics/export?${params}`, "_blank");
	},
};
