"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	useAdminUnknownWords,
	useAdminUnknownWordStats,
	useAdminUnknownWordMutations,
	useAdminTextsDropdown,
	adminUnknownWordApi,
} from "@/entities/admin-unknown-word";
import type {
	AddToDictionaryPayload,
	FetchUnknownWordsQuery,
	UnknownWordItem,
	UnknownWordsSortOrder,
	UnknownWordsTab,
} from "@/entities/admin-unknown-word";

export type AddModalState = {
	open: boolean;
	wordId: string;
	word: string;
	normalized: string;
	seenCount: number;
	snippet: string | null;
	initialAction: "new" | "link";
} | null;

export type ContextsModalState = {
	wordId: string;
	word: string;
} | null;

const DEFAULT_SORT: UnknownWordsSortOrder = "frequency_desc";
const DEFAULT_TAB: UnknownWordsTab = "all";

export const useAdminUnknownWordsPage = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlTab = (searchParams.get("tab") as UnknownWordsTab) ?? DEFAULT_TAB;
	const urlSearch = searchParams.get("q") ?? "";
	const urlSort =
		(searchParams.get("sort") as UnknownWordsSortOrder) ?? DEFAULT_SORT;
	const urlTextId = searchParams.get("textId") ?? undefined;
	const urlPage = Math.max(1, Number(searchParams.get("page") ?? "1"));

	const [searchInput, setSearchInput] = useState(urlSearch);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		setSearchInput(urlSearch);
	}, [urlSearch]);

	const updateParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (!value) {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[router, pathname, searchParams],
	);

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [addModal, setAddModal] = useState<AddModalState>(null);
	const [clearModalOpen, setClearModalOpen] = useState(false);
	const [contextsModal, setContextsModal] = useState<ContextsModalState>(null);

	const query: FetchUnknownWordsQuery = {
		...(urlSearch ? { q: urlSearch } : {}),
		...(urlTextId ? { textId: urlTextId } : {}),
		tab: urlTab,
		sort: urlSort,
		page: urlPage,
		limit: 20,
	};

	const { data, isLoading } = useAdminUnknownWords(query);
	const { data: stats, isLoading: statsLoading } = useAdminUnknownWordStats();
	const { data: textsData } = useAdminTextsDropdown();
	const mutations = useAdminUnknownWordMutations();

	const handleTabChange = useCallback(
		(next: UnknownWordsTab) => {
			updateParams({
				tab: next === DEFAULT_TAB ? undefined : next,
				page: undefined,
			});
			setSelectedIds(new Set());
		},
		[updateParams],
	);

	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchInput(value);
			clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				const params = new URLSearchParams(window.location.search);
				if (value) {
					params.set("q", value);
				} else {
					params.delete("q");
				}
				params.delete("page");
				router.replace(`${pathname}?${params.toString()}`, { scroll: false });
			}, 300);
			setSelectedIds(new Set());
		},
		[router, pathname],
	);

	const handleSortChange = useCallback(
		(value: UnknownWordsSortOrder) => {
			updateParams({
				sort: value === DEFAULT_SORT ? undefined : value,
				page: undefined,
			});
		},
		[updateParams],
	);

	const handleTextChange = useCallback(
		(value: string | undefined) => {
			updateParams({ textId: value, page: undefined });
			setSelectedIds(new Set());
		},
		[updateParams],
	);

	const handlePageChange = useCallback(
		(next: number) => {
			updateParams({ page: next === 1 ? undefined : String(next) });
		},
		[updateParams],
	);

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
			return allSelected ? new Set() : new Set(allIds);
		});
	}, [data?.items]);

	const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

	const openAddModal = useCallback(
		(word: UnknownWordItem, initialAction: "new" | "link" = "new") => {
			setAddModal({
				open: true,
				wordId: word.id,
				word: word.word,
				normalized: word.normalized,
				seenCount: word.seenCount,
				snippet: word.firstContext?.snippet ?? null,
				initialAction,
			});
		},
		[],
	);

	const closeAddModal = useCallback(() => setAddModal(null), []);

	const openContextsModal = useCallback((word: UnknownWordItem) => {
		setContextsModal({ wordId: word.id, word: word.word });
	}, []);

	const closeContextsModal = useCallback(() => setContextsModal(null), []);

	const handleAddToDictionary = useCallback(
		(payload: AddToDictionaryPayload) => {
			if (!addModal) return;
			mutations.addToDictionary.mutate(
				{ id: addModal.wordId, payload },
				{ onSuccess: closeAddModal },
			);
		},
		[addModal, mutations.addToDictionary, closeAddModal],
	);

	const handleLinkToLemma = useCallback(
		(lemmaId: string) => {
			if (!addModal) return;
			mutations.linkToLemma.mutate(
				{ id: addModal.wordId, payload: { lemmaId } },
				{ onSuccess: closeAddModal },
			);
		},
		[addModal, mutations.linkToLemma, closeAddModal],
	);

	const handleExport = useCallback(async () => {
		try {
			const blob = await adminUnknownWordApi.exportCsv(query);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `unknown-words-${Date.now()}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			// silently ignore
		}
	}, [query]);

	const handleClearAll = useCallback(() => {
		mutations.clearAll.mutate(undefined, {
			onSuccess: () => {
				setClearModalOpen(false);
				clearSelection();
			},
		});
	}, [mutations.clearAll, clearSelection]);

	const allSelected =
		!!data?.items?.length &&
		data.items.every((w) => selectedIds.has(w.id));

	return {
		tab: urlTab,
		search: searchInput,
		sort: urlSort,
		textId: urlTextId,
		page: urlPage,
		selectedIds,
		allSelected,
		someSelected: selectedIds.size > 0,
		data,
		stats,
		textsData,
		isLoading,
		statsLoading,
		mutations,
		addModal,
		clearModalOpen,
		contextsModal,
		handleTabChange,
		handleSearchChange,
		handleSortChange,
		handleTextChange,
		handlePageChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		openAddModal,
		closeAddModal,
		openContextsModal,
		closeContextsModal,
		handleAddToDictionary,
		handleLinkToLemma,
		handleExport,
		handleClearAll,
		setClearModalOpen,
	};
};
