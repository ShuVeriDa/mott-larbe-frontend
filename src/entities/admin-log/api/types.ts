export type AdminLogLevel = "debug" | "info" | "warn" | "error" | "critical";
export type AdminLogTab = "all" | "debug" | "info" | "warn" | "error" | "critical";
export type AdminLogRange = "15m" | "1h" | "24h" | "7d" | "30d" | "all";

export interface TrendValue {
	direction: "up" | "down" | "neutral";
	value: number;
	unit: string;
}

export interface AdminLogItem {
	id: string;
	timestamp: string;
	level: AdminLogLevel;
	service: string;
	message: string;
	tracePreview: string | null;
	durationMs: number | null;
	traceId: string;
}

export interface AdminLogDetail {
	id: string;
	title: string;
	level: AdminLogLevel;
	levelLabel: string;
	timestamp: string;
	service: string;
	message: string;
	durationMs: number | null;
	traceId: string;
	user: { id: string } | null;
	host: string | null;
	stack: string | null;
	context: Record<string, unknown>;
}

export interface AdminLogsListResponse {
	items: AdminLogItem[];
	total: number;
	page: number;
	limit: number;
	skip: number;
	tabs: Record<AdminLogTab, number>;
}

export interface AdminLogsTabs {
	all: number;
	debug: number;
	info: number;
	warn: number;
	error: number;
	critical: number;
}

export interface AdminLogsStats {
	totalEvents24h: { value: number; trend: TrendValue };
	errors24h: { value: number; trend: TrendValue };
	warnings24h: { value: number; trend: TrendValue };
	avgResponseMs: { value: number; trend: TrendValue };
	errorRatePct: { value: number; trend: TrendValue };
	tabs: AdminLogsTabs;
}

export interface AdminLogsLiveResponse {
	items: AdminLogItem[];
	nextCursor: string | null;
}

export interface FetchAdminLogsQuery {
	q?: string;
	service?: string;
	level?: AdminLogLevel;
	tab?: AdminLogTab;
	range?: AdminLogRange;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	limit?: number;
	order?: "desc" | "asc";
	userId?: string;
	durationMin?: number;
	durationMax?: number;
}
