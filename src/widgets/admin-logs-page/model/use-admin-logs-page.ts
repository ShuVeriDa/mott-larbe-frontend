"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	adminLogApi,
	adminLogKeys,
	useAdminLogDetail,
	useAdminLogServices,
	useAdminLogStats,
	useAdminLogs,
} from "@/entities/admin-log";
import type {
	AdminLogItem,
	AdminLogLevel,
	AdminLogRange,
	AdminLogTab,
	FetchAdminLogsQuery,
} from "@/entities/admin-log";

const LIMIT = 25;
const LIVE_INTERVAL_MS = 5_000;

export const useAdminLogsPage = () => {
	const queryClient = useQueryClient();

	const [tab, setTab] = useState<AdminLogTab>("all");
	const [search, setSearch] = useState("");
	const [service, setService] = useState("all");
	const [range, setRange] = useState<AdminLogRange>("24h");
	const [page, setPage] = useState(1);
	const [isLive, setIsLive] = useState(true);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [liveItems, setLiveItems] = useState<AdminLogItem[]>([]);
	const liveCursorRef = useRef<string | null>(null);
	const liveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const query: FetchAdminLogsQuery = {
		tab,
		q: search || undefined,
		service: service !== "all" ? service : undefined,
		range,
		page,
		limit: LIMIT,
	};

	const logsQuery = useAdminLogs(query);
	const statsQuery = useAdminLogStats({ range });
	const servicesQuery = useAdminLogServices();
	const detailQuery = useAdminLogDetail(selectedId);

	const stopLive = useCallback(() => {
		if (liveTimerRef.current) {
			clearInterval(liveTimerRef.current);
			liveTimerRef.current = null;
		}
	}, []);

	const startLive = useCallback(() => {
		stopLive();
		liveTimerRef.current = setInterval(async () => {
			try {
				const result = await adminLogApi.live({
					since: liveCursorRef.current ?? undefined,
					tab: tab !== "all" ? tab : undefined,
					service: service !== "all" ? service : undefined,
				});
				if (result.items.length > 0) {
					setLiveItems((prev) => {
						const existingIds = new Set(prev.map((i) => i.id));
						const newItems = result.items.filter((i) => !existingIds.has(i.id));
						return [...newItems, ...prev].slice(0, 100);
					});
					if (result.nextCursor) {
						liveCursorRef.current = result.nextCursor;
					}
					void queryClient.invalidateQueries({ queryKey: adminLogKeys.stats(range) });
				}
			} catch {
				// silently ignore live poll errors
			}
		}, LIVE_INTERVAL_MS);
	}, [stopLive, tab, service, range, queryClient]);

	useEffect(() => {
		if (isLive && page === 1) {
			startLive();
		} else {
			stopLive();
		}
		return stopLive;
	}, [isLive, page, startLive, stopLive]);

	const handleTabChange = useCallback((next: AdminLogTab) => {
		setTab(next);
		setPage(1);
		setLiveItems([]);
		liveCursorRef.current = null;
	}, []);

	const handleSearchChange = useCallback((v: string) => {
		setSearch(v);
		setPage(1);
		setLiveItems([]);
	}, []);

	const handleServiceChange = useCallback((v: string) => {
		setService(v);
		setPage(1);
		setLiveItems([]);
		liveCursorRef.current = null;
	}, []);

	const handleRangeChange = useCallback((v: AdminLogRange) => {
		setRange(v);
		setPage(1);
		setLiveItems([]);
		liveCursorRef.current = null;
	}, []);

	const toggleLive = useCallback(() => {
		setIsLive((v) => !v);
	}, []);

	const openDetail = useCallback((id: string) => {
		setSelectedId(id);
	}, []);

	const closeDetail = useCallback(() => {
		setSelectedId(null);
	}, []);

	const handleExport = useCallback(() => {
		const params = new URLSearchParams();
		if (query.tab && query.tab !== "all") params.set("tab", query.tab);
		if (query.q) params.set("q", query.q);
		if (query.service) params.set("service", query.service);
		params.set("range", range);
		params.set("format", "csv");
		const url = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555/api"}/admin/logs/export?${params}`;
		window.open(url, "_blank");
	}, [query, range]);

	const items = logsQuery.data?.items ?? [];
	const liveLevel = tab !== "all" ? (tab as AdminLogLevel) : undefined;
	const mergedItems =
		page === 1 && liveItems.length > 0
			? [
					...liveItems.filter(
						(i) =>
							(!liveLevel || i.level === liveLevel) &&
							(service === "all" || i.service === service),
					),
					...items.filter(
						(i) => !liveItems.some((li) => li.id === i.id),
					),
				].slice(0, LIMIT)
			: items;

	const total = logsQuery.data?.total ?? 0;
	const tabs = logsQuery.data?.tabs ?? statsQuery.data?.tabs;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));

	return {
		tab,
		search,
		service,
		range,
		page,
		isLive,
		selectedId,
		items: mergedItems,
		total,
		tabs,
		totalPages,
		logsQuery,
		statsQuery,
		servicesQuery,
		detailQuery,
		handleTabChange,
		handleSearchChange,
		handleServiceChange,
		handleRangeChange,
		setPage,
		toggleLive,
		openDetail,
		closeDetail,
		handleExport,
		LIMIT,
	};
};
