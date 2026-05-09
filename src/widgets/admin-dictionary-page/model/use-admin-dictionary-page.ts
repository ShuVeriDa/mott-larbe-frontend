"use client";
import { useState } from 'react';
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

	const push = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString());
		for (const [k, v] of Object.entries(updates)) {
			if (v === null || v === "" || v === "all" && k === "tab" || v === "1" && k === "page") {
				params.delete(k);
			} else {
				params.set(k, v);
			}
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const resetPage = (updates: Record<string, string | null>) => {
		push({ ...updates, page: null });
		setSelectedIds(new Set());
	};

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

	const invalidateRoot = () => {
		void qc.invalidateQueries({ queryKey: adminDictionaryKeys.all });
	};

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

	const handleTabChange = (next: AdminDictTab) => resetPage({ tab: next });

	const handleSearchChange = (v: string) => {
		setLocalSearch(v);
		resetPage({ q: v });
	};

	const handlePosChange = (v: string) => resetPage({ pos: v });
	const handleLevelChange = (v: string) => resetPage({ level: v });
	const handleSortChange = (v: AdminDictSort) => push({ sort: v === "alpha" ? null : v });
	const handleLanguageChange = (v: string) => resetPage({ language: v });

	const handleSetPage = (p: number) => push({ page: p === 1 ? null : String(p) });

	const handleSelectId = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const handleSelectAll = () => {
		const items = listQuery.data?.items ?? [];
		setSelectedIds((prev) => {
			const allSelected = items.every((it) => prev.has(it.id));
			if (allSelected) return new Set();
			return new Set(items.map((it) => it.id));
		});
	};

	const handleClearSelection = () => setSelectedIds(new Set());

	const handleBulkDelete = () => {
		if (selectedIds.size === 0) return;
		bulkDeleteMutation.mutate(Array.from(selectedIds));
	};

	const handleExport = (ids?: string[]) => {
		void adminDictionaryApi.export(ids).then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `dictionary-export-${Date.now()}.json`;
			a.click();
			URL.revokeObjectURL(url);
		});
	};

	const handleBulkExport = () => {
		handleExport(selectedIds.size > 0 ? Array.from(selectedIds) : undefined);
	};

	const handleImportOpen = () => {
		setImportResult(null);
		setImportOpen(true);
	};

	const handleImportClose = () => {
		setImportOpen(false);
		setImportResult(null);
	};

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
