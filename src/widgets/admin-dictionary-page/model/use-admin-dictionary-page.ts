"use client";

import { useCallback, useState } from "react";
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
} from "@/entities/dictionary";
import type { CefrLevel } from "@/shared/types";

const LIMIT = 20;

export const useAdminDictionaryPage = () => {
	const qc = useQueryClient();

	const [tab, setTab] = useState<AdminDictTab>("all");
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [pos, setPos] = useState("");
	const [level, setLevel] = useState("");
	const [sort, setSort] = useState<AdminDictSort>("alpha");
	const [language, setLanguage] = useState("");

	const [createOpen, setCreateOpen] = useState(false);
	const [deleteEntry, setDeleteEntry] = useState<AdminDictListItem | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const debouncedSearch = useDebounce(search, 350);

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
		void qc.invalidateQueries({ queryKey: adminDictionaryKeys.root });
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

	const handleTabChange = useCallback((next: AdminDictTab) => {
		setTab(next);
		setPage(1);
		setSelectedIds(new Set());
	}, []);

	const handleSearchChange = useCallback((v: string) => {
		setSearch(v);
		setPage(1);
	}, []);

	const handlePosChange = useCallback((v: string) => {
		setPos(v);
		setPage(1);
	}, []);

	const handleLevelChange = useCallback((v: string) => {
		setLevel(v);
		setPage(1);
	}, []);

	const handleSortChange = useCallback((v: AdminDictSort) => {
		setSort(v);
		setPage(1);
	}, []);

	const handleLanguageChange = useCallback((v: string) => {
		setLanguage(v);
		setPage(1);
	}, []);

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
			a.download = "dictionary-export.json";
			a.click();
			URL.revokeObjectURL(url);
		});
	}, []);

	const handleBulkExport = useCallback(() => {
		handleExport(selectedIds.size > 0 ? Array.from(selectedIds) : undefined);
	}, [selectedIds, handleExport]);

	const total = listQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));
	const tabCounts = listQuery.data?.tabCounts;

	return {
		tab,
		page,
		search,
		pos,
		level,
		sort,
		language,
		createOpen,
		deleteEntry,
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
		setCreateOpen,
		setDeleteEntry,
		setPage,
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
		handleCreate: createMutation.mutate,
		handleDeleteConfirm: () => { if (deleteEntry) deleteMutation.mutate(deleteEntry.id); },
	};
};
