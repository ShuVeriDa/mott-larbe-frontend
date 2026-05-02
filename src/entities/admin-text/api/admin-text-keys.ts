import type { FetchAdminTextsQuery, ProcessingStatus } from "./types";

export const adminTextKeys = {
	root: ["admin", "texts"] as const,
	list: (query: FetchAdminTextsQuery) =>
		["admin", "texts", "list", query] as const,
	stats: () => ["admin", "texts", "stats"] as const,
	detail: (id: string) => ["admin", "texts", id] as const,
	versions: (textId: string, status?: ProcessingStatus) =>
		["admin", "texts", textId, "versions", { status }] as const,
	versionDetail: (textId: string, versionId: string) =>
		["admin", "texts", textId, "versions", versionId] as const,
};
