import type { FetchAdminLogsQuery } from "./types";

export const adminLogKeys = {
	root: ["admin", "logs"] as const,
	list: (query?: FetchAdminLogsQuery) =>
		[...adminLogKeys.root, "list", query] as const,
	stats: (
		query?: Pick<
			FetchAdminLogsQuery,
			"range" | "dateFrom" | "dateTo" | "tab" | "q" | "service"
		>,
	) => [...adminLogKeys.root, "stats", query] as const,
	detail: (id: string) =>
		[...adminLogKeys.root, "detail", id] as const,
	services: () =>
		[...adminLogKeys.root, "services"] as const,
};
