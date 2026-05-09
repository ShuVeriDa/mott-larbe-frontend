"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	useTokenizationDistribution,
	useTokenizationMutations,
	useTokenizationQueue,
	useTokenizationSettings,
	useTokenizationStats,
	useTokenizationTexts,
	useUpdateTokenizationSettings,
} from "@/entities/token";
import type {
	CefrLevel,
	FetchTokenizationTextsQuery,
	RunScope,
	TokenizationTab,
	TokenSort,
	TokenStatus,
	UpdateTokenizationSettingsDto,
} from "@/entities/token";
import { useDebounce } from "@/shared/lib/debounce";

export const useAdminTokenizationPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	// URL-backed filters (source of truth for queries and shareable links)
	const tab = (searchParams.get("tab") as TokenizationTab) ?? "all";
	const level = (searchParams.get("level") as CefrLevel | "") ?? "";
	const status = (searchParams.get("status") as TokenStatus | "") ?? "";
	const sort = (searchParams.get("sort") as TokenSort) ?? "errors";
	const page = Number(searchParams.get("page") ?? "1");

	// Local state for the search input — debounced before being written to URL
	const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
	const debouncedSearch = useDebounce(searchInput, 300);
	const lastWrittenSearch = useRef(searchParams.get("search") ?? "");

	// Local-only UI state
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [runModalOpen, setRunModalOpen] = useState(false);
	const [detailTextId, setDetailTextId] = useState<string | null>(null);
	const [confirmResetOpen, setConfirmResetOpen] = useState(false);

	const setParams = useCallback(
		(updates: Record<string, string>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (
					!value ||
					(key === "tab" && value === "all") ||
					(key === "sort" && value === "errors") ||
					(key === "page" && value === "1")
				) {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}
			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname);
		},
		[searchParams, router, pathname],
	);

	// Write debounced search to URL; skip if value hasn't changed vs what we last wrote
	useEffect(() => {
		if (debouncedSearch === lastWrittenSearch.current) return;
		lastWrittenSearch.current = debouncedSearch;
		setParams({ search: debouncedSearch, page: "1" });
	}, [debouncedSearch, setParams]);

	// Sync input when URL search changes externally (browser back/forward)
	useEffect(() => {
		const urlSearch = searchParams.get("search") ?? "";
		if (urlSearch !== lastWrittenSearch.current) {
			lastWrittenSearch.current = urlSearch;
			setSearchInput(urlSearch);
		}
	}, [searchParams]);

	const query: FetchTokenizationTextsQuery = useMemo(
		() => ({
			tab,
			...(searchParams.get("search") ? { search: searchParams.get("search")! } : {}),
			...(level ? { level } : {}),
			...(status ? { status } : {}),
			sort,
			page,
			limit: 20,
		}),
		[tab, searchParams, level, status, sort, page],
	);

	const { data, isLoading, isFetching } = useTokenizationTexts(query);
	const { data: stats } = useTokenizationStats();
	const { data: distribution } = useTokenizationDistribution();
	const { data: settings } = useTokenizationSettings();
	const { data: queue } = useTokenizationQueue();
	const mutations = useTokenizationMutations();
	const updateSettings = useUpdateTokenizationSettings();

	const handleTabChange = (next: TokenizationTab) => {
		setSelectedIds(new Set());
		setParams({ tab: next, page: "1" });
	};

	const handleSearchChange = (value: string) => {
		setSearchInput(value);
	};

	const handleLevelChange = (value: string) => {
		setParams({ level: value, page: "1" });
	};

	const handleStatusChange = (value: string) => {
		setParams({ status: value, page: "1" });
	};

	const handleSortChange = (value: string) => {
		setParams({ sort: value, page: "1" });
	};

	const handlePageChange = (next: number) => {
		setParams({ page: String(next) });
	};

	const toggleSelectId = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const toggleSelectAll = () => {
		if (!data?.data) return;
		setSelectedIds((prev) => {
			const allIds = data.data.map((item) => item.id);
			const allSelected = allIds.every((id) => prev.has(id));
			return allSelected ? new Set() : new Set(allIds);
		});
	};

	const clearSelection = () => setSelectedIds(new Set());

	const handleRun = async (scope: RunScope) => {
		await mutations.run.mutateAsync({ scope });
		setRunModalOpen(false);
	};

	const handleBulkRun = async () => {
		await mutations.bulkRun.mutateAsync(Array.from(selectedIds));
		clearSelection();
	};

	const handleBulkReset = async () => {
		await mutations.bulkReset.mutateAsync(Array.from(selectedIds));
		clearSelection();
		setConfirmResetOpen(false);
	};

	const handleSettingToggle = (key: keyof UpdateTokenizationSettingsDto) => {
		if (!settings) return;
		updateSettings.mutate({ [key]: !settings[key] });
	};

	const allSelected =
		!!data?.data?.length && data.data.every((item) => selectedIds.has(item.id));
	const someSelected = selectedIds.size > 0;

	return {
		tab,
		searchInput,
		level,
		status,
		sort,
		page,
		selectedIds,
		allSelected,
		someSelected,
		data,
		stats,
		distribution,
		settings,
		queue,
		isLoading,
		isFetching,
		mutations,
		runModalOpen,
		setRunModalOpen,
		detailTextId,
		setDetailTextId,
		confirmResetOpen,
		setConfirmResetOpen,
		handleTabChange,
		handleSearchChange,
		handleLevelChange,
		handleStatusChange,
		handleSortChange,
		handlePageChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		handleRun,
		handleBulkRun,
		handleBulkReset,
		handleSettingToggle,
	};
};
