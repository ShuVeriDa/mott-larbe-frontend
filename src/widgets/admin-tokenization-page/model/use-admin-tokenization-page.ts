"use client";

import { useCallback, useState } from "react";
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
	UpdateTokenizationSettingsDto,
} from "@/entities/token";

export const useAdminTokenizationPage = () => {
	const [tab, setTab] = useState<TokenizationTab>("all");
	const [search, setSearch] = useState("");
	const [level, setLevel] = useState<CefrLevel | "">("");
	const [sort, setSort] = useState<TokenSort>("errors");
	const [page, setPage] = useState(1);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [runModalOpen, setRunModalOpen] = useState(false);
	const [detailTextId, setDetailTextId] = useState<string | null>(null);

	const query: FetchTokenizationTextsQuery = {
		tab,
		...(search ? { search } : {}),
		...(level ? { level } : {}),
		sort,
		page,
		limit: 20,
	};

	const { data, isLoading, isFetching } = useTokenizationTexts(query);
	const { data: stats } = useTokenizationStats();
	const { data: distribution } = useTokenizationDistribution();
	const { data: settings } = useTokenizationSettings();
	const { data: queue } = useTokenizationQueue();
	const mutations = useTokenizationMutations();
	const updateSettings = useUpdateTokenizationSettings();

	const handleTabChange = useCallback((next: TokenizationTab) => {
		setTab(next);
		setPage(1);
		setSelectedIds(new Set());
	}, []);

	const handleSearchChange = useCallback((value: string) => {
		setSearch(value);
		setPage(1);
	}, []);

	const handleLevelChange = useCallback((value: string) => {
		setLevel(value as CefrLevel | "");
		setPage(1);
	}, []);

	const handleSortChange = useCallback((value: string) => {
		setSort(value as TokenSort);
		setPage(1);
	}, []);

	const toggleSelectId = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const toggleSelectAll = useCallback(() => {
		if (!data?.data) return;
		setSelectedIds((prev) => {
			const allIds = data.data.map((item) => item.id);
			const allSelected = allIds.every((id) => prev.has(id));
			if (allSelected) return new Set();
			return new Set(allIds);
		});
	}, [data?.data]);

	const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

	const handleRun = useCallback(
		async (scope: RunScope) => {
			await mutations.run.mutateAsync({ scope });
			setRunModalOpen(false);
		},
		[mutations.run],
	);

	const handleBulkRun = useCallback(async () => {
		await mutations.bulkRun.mutateAsync(Array.from(selectedIds));
		clearSelection();
	}, [mutations.bulkRun, selectedIds, clearSelection]);

	const handleBulkReset = useCallback(async () => {
		await mutations.bulkReset.mutateAsync(Array.from(selectedIds));
		clearSelection();
	}, [mutations.bulkReset, selectedIds, clearSelection]);

	const handleSettingToggle = useCallback(
		(key: keyof UpdateTokenizationSettingsDto) => {
			if (!settings) return;
			updateSettings.mutate({ [key]: !settings[key] });
		},
		[settings, updateSettings],
	);

	const allSelected =
		!!data?.data?.length && data.data.every((item) => selectedIds.has(item.id));
	const someSelected = selectedIds.size > 0;

	return {
		tab,
		search,
		level,
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
		handleTabChange,
		handleSearchChange,
		handleLevelChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		handleRun,
		handleBulkRun,
		handleBulkReset,
		handleSettingToggle,
		setPage,
	};
};
