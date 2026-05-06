"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import {
	adminDictionaryApi,
	adminDictionaryKeys,
	useAdminDictionaryList,
	useAdminDictionaryStats,
} from "@/entities/dictionary";
import type {
	AdminDictListItem,
	AdminDictSort,
	AdminDictTab,
	CreateAdminEntryDto,
	AdminImportResult,
} from "@/entities/dictionary";
import type { CefrLevel } from "@/shared/types";

const LIMIT = 20;

const VALID_TABS: AdminDictTab[] = ["all", "no_senses", "no_examples", "no_forms"];
const VALID_SORTS: AdminDictSort[] = ["alpha", "frequency_desc", "newest", "oldest", "no_senses"];

const asTab = (v: string | null): AdminDictTab =>
	VALID_TABS.includes(v as AdminDictTab) ? (v as AdminDictTab) : "all";
const asSort = (v: string | null): AdminDictSort =>
	VALID_SORTS.includes(v as AdminDictSort) ? (v as AdminDictSort) : "alpha";
const asPage = (v: string | null): number => {
	const n = Number(v);
	return Number.isInteger(n) && n > 0 ? n : 1;
};

export const useAdminDictionaryPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const qc = useQueryClient();

	const tab = asTab(searchParams.get("tab"));
	const page = asPage(searchParams.get("page"));
	const sort = asSort(searchParams.get("sort"));
	const search = searchParams.get("q") ?? "";
	const pos = searchParams.get("pos") ?? "";
	const level = searchParams.get("level") ?? "";
	const language = searchParams.get("language") ?? "";

	const [localSearch, setLocalSearch] = useState(search);
	const debouncedSearch = useDebounce(localSearch, 350);

	const [createOpen, setCreateOpen] = useState(false);
	const [importOpen, setImportOpen] = useState(false);
	const [importResult, setImportResult] = useState<AdminImportResult | null>(null);
	const [deleteEntry, setDeleteEntry] = useState<AdminDictListItem | null>(null);
	const [addSenseEntry, setAddSenseEntry] = useState<AdminDictListItem | null>(null);
	const [addExampleEntry, setAddExampleEntry] = useState<AdminDictListItem | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const push = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [k, v] of Object.entries(updates)) {
				if (v === null || v === "" || v === "all" && k === "tab" || v === "1" && k === "page") {
					params.delete(k);
				} else {
					params.set(k, v);
				}
			}
			router.replace(`?${params.toString()}`, { scroll: false });
		},
		[router, searchParams],
	);

	const resetPage = useCallback(
		(updates: Record<string, string | null>) => {
			push({ ...updates, page: null });
			setSelectedIds(new Set());
		},
		[push],
	);

	const listQuery = useAdminDictionaryList({
		q: debouncedSearch || undefined,
		language: (language as "CHE" | "RU") || undefined,
		pos: pos || undefined,
		level: (level as CefrLevel) || undefined,
		sort,
		tab,
		page,
		limit: LIMIT,
	});

	const statsQuery = useAdminDictionaryStats();

	const invalidateRoot = useCallback(() => {
		void qc.invalidateQueries({ queryKey: adminDictionaryKeys.all });
	}, [qc]);

	const createMutation = useMutation({
		mutationFn: (dto: CreateAdminEntryDto) => adminDictionaryApi.create(dto),
		onSuccess: () => {
			invalidateRoot();
			setCreateOpen(false);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => adminDictionaryApi.remove(id),
		onSuccess: () => {
			invalidateRoot();
			setDeleteEntry(null);
			setSelectedIds(new Set());
		},
	});

	const bulkDeleteMutation = useMutation({
		mutationFn: (ids: string[]) => adminDictionaryApi.bulkDelete(ids),
		onSuccess: () => {
			invalidateRoot();
			setSelectedIds(new Set());
		},
	});

	const importMutation = useMutation({
		mutationFn: (file: File) => adminDictionaryApi.importEntries(file),
		onSuccess: (result) => {
			invalidateRoot();
			setImportResult(result);
		},
	});

	const addSenseMutation = useMutation({
		mutationFn: ({ lemmaId, definition }: { lemmaId: string; definition: string }) =>
			adminDictionaryApi.addSense(lemmaId, { definition }),
		onSuccess: () => invalidateRoot(),
	});

	const addExampleMutation = useMutation({
		mutationFn: ({ lemmaId, text }: { lemmaId: string; text: string }) =>
			adminDictionaryApi.addExampleToEntry(lemmaId, { text }),
		onSuccess: () => invalidateRoot(),
	});

	const handleTabChange = useCallback(
		(next: AdminDictTab) => resetPage({ tab: next }),
		[resetPage],
	);

	const handleSearchChange = useCallback(
		(v: string) => {
			setLocalSearch(v);
			resetPage({ q: v });
		},
		[resetPage],
	);

	const handlePosChange = useCallback((v: string) => resetPage({ pos: v }), [resetPage]);
	const handleLevelChange = useCallback((v: string) => resetPage({ level: v }), [resetPage]);
	const handleSortChange = useCallback((v: AdminDictSort) => push({ sort: v === "alpha" ? null : v }), [push]);
	const handleLanguageChange = useCallback((v: string) => resetPage({ language: v }), [resetPage]);

	const handleSetPage = useCallback(
		(p: number) => push({ page: p === 1 ? null : String(p) }),
		[push],
	);

	const handleSelectId = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const handleSelectAll = useCallback(() => {
		const items = listQuery.data?.items ?? [];
		setSelectedIds((prev) => {
			const allSelected = items.every((it) => prev.has(it.id));
			if (allSelected) return new Set();
			return new Set(items.map((it) => it.id));
		});
	}, [listQuery.data]);

	const handleClearSelection = useCallback(() => setSelectedIds(new Set()), []);

	const handleBulkDelete = useCallback(() => {
		if (selectedIds.size === 0) return;
		bulkDeleteMutation.mutate(Array.from(selectedIds));
	}, [selectedIds, bulkDeleteMutation]);

	const handleExport = useCallback((ids?: string[]) => {
		void adminDictionaryApi.export(ids).then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `dictionary-export-${Date.now()}.json`;
			a.click();
			URL.revokeObjectURL(url);
		});
	}, []);

	const handleBulkExport = useCallback(() => {
		handleExport(selectedIds.size > 0 ? Array.from(selectedIds) : undefined);
	}, [selectedIds, handleExport]);

	const handleImportOpen = useCallback(() => {
		setImportResult(null);
		setImportOpen(true);
	}, []);

	const handleImportClose = useCallback(() => {
		setImportOpen(false);
		setImportResult(null);
	}, []);

	const total = listQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));
	const tabCounts = listQuery.data?.tabCounts;

	return {
		tab,
		page,
		search: localSearch,
		pos,
		level,
		sort,
		language,
		createOpen,
		importOpen,
		importResult,
		deleteEntry,
		addSenseEntry,
		addExampleEntry,
		selectedIds,
		listQuery,
		statsQuery,
		total,
		totalPages,
		tabCounts,
		LIMIT,
		isCreating: createMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isBulkDeleting: bulkDeleteMutation.isPending,
		isImporting: importMutation.isPending,
		isAddingSense: addSenseMutation.isPending,
		isAddingExample: addExampleMutation.isPending,
		setCreateOpen,
		setDeleteEntry,
		setAddSenseEntry,
		setAddExampleEntry,
		setPage: handleSetPage,
		handleTabChange,
		handleSearchChange,
		handlePosChange,
		handleLevelChange,
		handleSortChange,
		handleLanguageChange,
		handleSelectId,
		handleSelectAll,
		handleClearSelection,
		handleBulkDelete,
		handleBulkExport,
		handleImportOpen,
		handleImportClose,
		handleImport: importMutation.mutate,
		handleCreate: createMutation.mutate,
		handleDeleteConfirm: () => { if (deleteEntry) deleteMutation.mutate(deleteEntry.id); },
		handleAddSenseConfirm: (definition: string) => {
			if (addSenseEntry) addSenseMutation.mutate({ lemmaId: addSenseEntry.id, definition });
		},
		handleAddExampleConfirm: (text: string) => {
			if (addExampleEntry) addExampleMutation.mutate({ lemmaId: addExampleEntry.id, text });
		},
	};
};
