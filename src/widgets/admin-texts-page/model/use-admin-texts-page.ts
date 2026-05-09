"use client";
import { useState } from 'react';
import { useAdminTexts, useAdminTextStats, useAdminTextMutations } from "@/entities/admin-text";
import type { AdminTextsTab, FetchAdminTextsQuery, TextLevel, TextSortBy } from "@/entities/admin-text";

export const useAdminTextsPage = () => {
	const [tab, setTab] = useState<AdminTextsTab>("all");
	const [search, setSearch] = useState("");
	const [level, setLevel] = useState<TextLevel | "">("");
	const [tagId, setTagId] = useState("");
	const [sortBy, setSortBy] = useState<TextSortBy>("createdAt");
	const [page, setPage] = useState(1);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [importOpen, setImportOpen] = useState(false);

	const query: FetchAdminTextsQuery = {
		...(search ? { search } : {}),
		...(level ? { level } : {}),
		...(tagId ? { tagId } : {}),
		...(tab !== "all" ? { status: tab } : {}),
		sortBy,
		sortOrder: "desc",
		page,
		limit: 20,
	};

	const { data, isLoading, isFetching } = useAdminTexts(query);
	const { data: stats, isLoading: statsLoading } = useAdminTextStats();
	const mutations = useAdminTextMutations();

	const handleTabChange = (next: AdminTextsTab) => {
		setTab(next);
		setPage(1);
		setSelectedIds(new Set());
	};

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
		setSelectedIds(new Set());
	};

	const handleLevelChange = (value: string) => {
		setLevel(value as TextLevel | "");
		setPage(1);
	};

	const handleTagChange = (value: string) => {
		setTagId(value);
		setPage(1);
	};

	const handleSortChange = (value: TextSortBy) => {
		setSortBy(value);
		setPage(1);
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
		if (!data?.items) return;
		setSelectedIds((prev) => {
			const allIds = data.items.map((t) => t.id);
			const allSelected = allIds.every((id) => prev.has(id));
			if (allSelected) return new Set();
			return new Set(allIds);
		});
	};

	const clearSelection = () => setSelectedIds(new Set());

	const allSelected =
		!!data?.items?.length && data.items.every((t) => selectedIds.has(t.id));
	const someSelected = selectedIds.size > 0;

	return {
		tab,
		search,
		level,
		tagId,
		sortBy,
		page,
		selectedIds,
		allSelected,
		someSelected,
		importOpen,
		data,
		stats,
		isLoading,
		isFetching,
		statsLoading,
		mutations,
		handleTabChange,
		handleSearchChange,
		handleLevelChange,
		handleTagChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		setPage,
		setImportOpen,
	};
};
