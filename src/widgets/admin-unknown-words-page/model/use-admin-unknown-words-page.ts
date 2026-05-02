"use client";

import { useCallback, useState } from "react";
import {
	useUnknownWords,
	useUnknownWordStats,
	useUnknownWordMutations,
	unknownWordApi,
} from "@/entities/unknown-word";
import type {
	FetchUnknownWordsQuery,
	UnknownWordsSortOrder,
	UnknownWordsTab,
	AddToDictionaryPayload,
} from "@/entities/unknown-word";

export type AddModalState = {
	open: boolean;
	wordId: string;
	word: string;
	normalized: string;
	seenCount: number;
	snippet: string | null;
} | null;

export const useAdminUnknownWordsPage = () => {
	const [tab, setTab] = useState<UnknownWordsTab>("all");
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState<UnknownWordsSortOrder>("frequency_desc");
	const [page, setPage] = useState(1);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [addModal, setAddModal] = useState<AddModalState>(null);
	const [clearModalOpen, setClearModalOpen] = useState(false);

	const query: FetchUnknownWordsQuery = {
		...(search ? { q: search } : {}),
		tab,
		sort,
		page,
		limit: 20,
	};

	const { data, isLoading } = useUnknownWords(query);
	const { data: stats, isLoading: statsLoading } = useUnknownWordStats();
	const mutations = useUnknownWordMutations();

	const handleTabChange = useCallback((next: UnknownWordsTab) => {
		setTab(next);
		setPage(1);
		setSelectedIds(new Set());
	}, []);

	const handleSearchChange = useCallback((value: string) => {
		setSearch(value);
		setPage(1);
		setSelectedIds(new Set());
	}, []);

	const handleSortChange = useCallback((value: UnknownWordsSortOrder) => {
		setSort(value);
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
		if (!data?.items) return;
		setSelectedIds((prev) => {
			const allIds = data.items.map((w) => w.id);
			const allSelected = allIds.every((id) => prev.has(id));
			if (allSelected) return new Set();
			return new Set(allIds);
		});
	}, [data?.items]);

	const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

	const openAddModal = useCallback(
		(wordId: string, word: string, normalized: string, seenCount: number, snippet: string | null) => {
			setAddModal({ open: true, wordId, word, normalized, seenCount, snippet });
		},
		[],
	);

	const closeAddModal = useCallback(() => setAddModal(null), []);

	const handleAddToDictionary = useCallback(
		(payload: AddToDictionaryPayload) => {
			if (!addModal) return;
			mutations.addToDictionary.mutate(
				{ id: addModal.wordId, payload },
				{ onSuccess: () => setAddModal(null) },
			);
		},
		[addModal, mutations.addToDictionary],
	);

	const handleExport = useCallback(async () => {
		try {
			const blob = await unknownWordApi.export("csv");
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "unknown-words.csv";
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			// silently ignore
		}
	}, []);

	const handleClearAll = useCallback(() => {
		mutations.clearAll.mutate(undefined, {
			onSuccess: () => {
				setClearModalOpen(false);
				clearSelection();
			},
		});
	}, [mutations.clearAll, clearSelection]);

	const allSelected =
		!!data?.items?.length && data.items.every((w) => selectedIds.has(w.id));
	const someSelected = selectedIds.size > 0;

	return {
		tab,
		search,
		sort,
		page,
		selectedIds,
		allSelected,
		someSelected,
		data,
		stats,
		isLoading,
		statsLoading,
		mutations,
		addModal,
		clearModalOpen,
		handleTabChange,
		handleSearchChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		setPage,
		openAddModal,
		closeAddModal,
		handleAddToDictionary,
		handleExport,
		handleClearAll,
		setClearModalOpen,
	};
};
