"use client";
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
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
import { API_URL } from "@/shared/config";

const LIMIT = 25;
const LIVE_INTERVAL_MS = 5_000;
const SEARCH_DEBOUNCE_MS = 300;

export const useAdminLogsPage = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [tab, setTab] = useState<AdminLogTab>("all");
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [service, setService] = useState("all");
	const [range, setRange] = useState<AdminLogRange>("24h");
	const [page, setPage] = useState(1);
	const [isLive, setIsLive] = useState(true);
	const [liveItems, setLiveItems] = useState<AdminLogItem[]>([]);

	const selectedId = searchParams.get("detail");

	const setSelectedId = (id: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (id) {
			params.set("detail", id);
		} else {
			params.delete("detail");
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const liveCursorRef = useRef<string | null>(null);
	const liveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	// Always-fresh ref so the live interval closure can read current filter state
	const liveFilterRef = useRef({ tab, service, range, debouncedSearch });
	liveFilterRef.current = { tab, service, range, debouncedSearch };

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
			setPage(1);
			setLiveItems([]);
		}, SEARCH_DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [search]);

	const query: FetchAdminLogsQuery = {
		tab,
		q: debouncedSearch || undefined,
		service: service !== "all" ? service : undefined,
		range,
		page,
		limit: LIMIT,
	};

	const statsFilter = {
		range,
		tab: tab !== "all" ? tab : undefined,
		q: debouncedSearch || undefined,
		service: service !== "all" ? service : undefined,
	} as const;

	const logsQuery = useAdminLogs(query);
	const statsQuery = useAdminLogStats(statsFilter);
	const servicesQuery = useAdminLogServices();
	const detailQuery = useAdminLogDetail(selectedId);

	const stopLive = () => {
		if (liveTimerRef.current) {
			clearInterval(liveTimerRef.current);
			liveTimerRef.current = null;
		}
	};

	const startLive = () => {
		stopLive();
		liveTimerRef.current = setInterval(async () => {
			const { tab: t, service: s, range: r, debouncedSearch: q } = liveFilterRef.current;
			try {
				const result = await adminLogApi.live({
					since: liveCursorRef.current ?? undefined,
					tab: t !== "all" ? t : undefined,
					service: s !== "all" ? s : undefined,
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
					void queryClient.invalidateQueries({
						queryKey: adminLogKeys.stats({
							range: r,
							tab: t !== "all" ? t : undefined,
							q: q || undefined,
							service: s !== "all" ? s : undefined,
						}),
					});
				}
			} catch {
				// silently ignore live poll errors
			}
		}, LIVE_INTERVAL_MS);
	};

	useEffect(() => {
		if (isLive && page === 1) {
			startLive();
		} else {
			stopLive();
		}
		return stopLive;
	}, [isLive, page, startLive, stopLive]);

	const handleTabChange = (next: AdminLogTab) => {
		setTab(next);
		setPage(1);
		setLiveItems([]);
		liveCursorRef.current = null;
	};

	const handleSearchChange = (v: string) => {
		setSearch(v);
	};

	const handleServiceChange = (v: string) => {
		setService(v);
		setPage(1);
		setLiveItems([]);
		liveCursorRef.current = null;
	};

	const handleRangeChange = (v: AdminLogRange) => {
		setRange(v);
		setPage(1);
		setLiveItems([]);
		liveCursorRef.current = null;
	};

	const toggleLive = () => {
		setIsLive((v) => {
			if (v) {
				// pausing: discard accumulated live items; cursor kept to resume from same position
				setLiveItems([]);
			}
			return !v;
		});
	};

	const openDetail = (id: string) => setSelectedId(id);
	const closeDetail = () => setSelectedId(null);

	const handleExport = () => {
		const params = new URLSearchParams();
		if (query.tab && query.tab !== "all") params.set("tab", query.tab);
		if (query.q) params.set("q", query.q);
		if (query.service) params.set("service", query.service);
		params.set("range", range);
		params.set("format", "csv");
		const url = `${API_URL}/admin/logs/export?${params}`;
		window.open(url, "_blank");
	};

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
					...items.filter((i) => !liveItems.some((li) => li.id === i.id)),
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
