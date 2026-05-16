"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { annotationApi, annotationKeys } from "@/features/word-annotation";
import type { MorphFormListItem, PatchMorphFormDto } from "@/features/word-annotation";

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
	const [editMode, setEditMode] = useState(false);
	const [editTranslation, setEditTranslation] = useState("");

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

	const handleSelectForm = (id: string) => {
		push({ id });
		setEditMode(false);
	};

	const handleSetPage = (p: number) => push({ page: p === 1 ? null : String(p) });

	const listQuery = useQuery({
		queryKey: annotationKeys.morphForms.list({ q: debouncedSearch || undefined, page, limit: LIMIT }),
		queryFn: () => annotationApi.listMorphForms({ q: debouncedSearch || undefined, page, limit: LIMIT }),
		placeholderData: prev => prev,
		staleTime: 15_000,
	});

	const detailQuery = useQuery({
		queryKey: annotationKeys.morphForms.detail(selectedId),
		queryFn: () => annotationApi.getMorphForm(selectedId),
		enabled: Boolean(selectedId),
		staleTime: 15_000,
	});

	const invalidateAll = () => {
		void qc.invalidateQueries({ queryKey: annotationKeys.morphForms.all });
	};

	const updateMutation = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: PatchMorphFormDto }) =>
			annotationApi.updateMorphForm(id, dto),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: annotationKeys.morphForms.detail(selectedId) });
			invalidateAll();
			setEditMode(false);
			success(t("admin.wordAnnotations.toast.updated"));
		},
		onError: () => showError(t("admin.wordAnnotations.toast.error")),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => annotationApi.deleteMorphForm(id),
		onSuccess: () => {
			invalidateAll();
			setDeleteTarget(null);
			push({ id: null });
			success(t("admin.wordAnnotations.toast.deleted"));
		},
		onError: () => showError(t("admin.wordAnnotations.toast.error")),
	});

	const handleStartEdit = () => {
		if (!detailQuery.data) return;
		setEditTranslation(detailQuery.data.translation ?? "");
		setEditMode(true);
	};

	const handleCancelEdit = () => setEditMode(false);

	const handleSaveEdit = () => {
		if (!selectedId) return;
		updateMutation.mutate({
			id: selectedId,
			dto: { translation: editTranslation.trim() || undefined },
		});
	};

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
		editMode,
		editTranslation,
		listQuery,
		detailQuery,
		total,
		totalPages,
		LIMIT,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		setDeleteTarget,
		setEditTranslation,
		handleSearchChange,
		handleSelectForm,
		handleSetPage,
		handleStartEdit,
		handleCancelEdit,
		handleSaveEdit,
		handleDeleteConfirm,
	};
};
