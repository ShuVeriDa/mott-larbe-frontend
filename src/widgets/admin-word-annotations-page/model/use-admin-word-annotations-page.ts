"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { annotationApi, annotationKeys } from "@/features/word-annotation";
import type { MorphFormListItem } from "@/features/word-annotation";

const LIMIT = 50;

const asPage = (v: string | null): number => {
	const n = Number(v);
	return Number.isInteger(n) && n > 0 ? n : 1;
};

export const useAdminWordAnnotationsPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const qc = useQueryClient();
	const { t } = useI18n();
	const { success, error: showError } = useToast();

	const selectedId = searchParams.get("id") ?? "";
	const page = asPage(searchParams.get("page"));
	const [localSearch, setLocalSearch] = useState(searchParams.get("q") ?? "");
	const debouncedSearch = useDebounce(localSearch, 300);

	const [deleteTarget, setDeleteTarget] = useState<MorphFormListItem | null>(null);

	const push = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString());
		for (const [k, v] of Object.entries(updates)) {
			if (v === null || v === "" || (v === "1" && k === "page")) {
				params.delete(k);
			} else {
				params.set(k, v);
			}
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const handleSearchChange = (v: string) => {
		setLocalSearch(v);
		push({ q: v, page: null, id: null });
	};

	const handleSelectForm = (id: string) => push({ id });

	const handleSetPage = (p: number) => push({ page: p === 1 ? null : String(p) });

	const handleClearSelected = () => push({ id: null });

	const listQuery = useQuery({
		queryKey: annotationKeys.morphForms.list({ q: debouncedSearch || undefined, page, limit: LIMIT }),
		queryFn: () => annotationApi.listMorphForms({ q: debouncedSearch || undefined, page, limit: LIMIT }),
		placeholderData: prev => prev,
		staleTime: 15_000,
	});

	const syncMutation = useMutation({
		mutationFn: () => annotationApi.syncMorphForms(),
		onSuccess: (data) => {
			void qc.invalidateQueries({ queryKey: annotationKeys.morphForms.all });
			success(t("admin.wordAnnotations.toast.synced", { count: data.synced }));
		},
		onError: () => showError(t("admin.wordAnnotations.toast.error")),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => annotationApi.deleteMorphForm(id),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: annotationKeys.morphForms.all });
			setDeleteTarget(null);
			push({ id: null });
			success(t("admin.wordAnnotations.toast.deleted"));
		},
		onError: () => showError(t("admin.wordAnnotations.toast.error")),
	});

	const handleDeleteConfirm = () => {
		if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
	};

	const total = listQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));

	return {
		selectedId,
		page,
		localSearch,
		deleteTarget,
		listQuery,
		total,
		totalPages,
		LIMIT,
		isDeleting: deleteMutation.isPending,
		isSyncing: syncMutation.isPending,
		setDeleteTarget,
		handleSearchChange,
		handleSelectForm,
		handleSetPage,
		handleClearSelected,
		handleDeleteConfirm,
		handleSync: () => syncMutation.mutate(),
	};
};
