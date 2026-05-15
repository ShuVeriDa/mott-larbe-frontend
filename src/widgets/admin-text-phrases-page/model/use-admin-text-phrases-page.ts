"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import {
	textPhraseApi,
	textPhraseKeys,
	type TextPhraseListItem,
	type TextPhraseOccurrence,
	type CreateTextPhraseDto,
	type PatchTextPhraseDto,
	type TextPhraseLanguage,
} from "@/entities/text-phrase";

const LIMIT = 50;

const asPage = (v: string | null): number => {
	const n = Number(v);
	return Number.isInteger(n) && n > 0 ? n : 1;
};

export const useAdminTextPhrasesPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const qc = useQueryClient();
	const { t } = useI18n();
	const { success, error: showError } = useToast();

	const selectedId = searchParams.get("id") ?? "";
	const page = asPage(searchParams.get("page"));
	const language = (searchParams.get("language") ?? "") as TextPhraseLanguage | "";
	const [localSearch, setLocalSearch] = useState(searchParams.get("q") ?? "");
	const debouncedSearch = useDebounce(localSearch, 300);

	const [createOpen, setCreateOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<TextPhraseListItem | null>(null);
	const [deleteOccurrenceTarget, setDeleteOccurrenceTarget] = useState<TextPhraseOccurrence | null>(null);
	const [editMode, setEditMode] = useState(false);
	const [editTranslation, setEditTranslation] = useState("");
	const [editNotes, setEditNotes] = useState("");

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

	const handleLanguageChange = (v: string) => {
		push({ language: v, page: null, id: null });
	};

	const handleSelectPhrase = (id: string) => {
		push({ id });
		setEditMode(false);
	};

	const handleSetPage = (p: number) => push({ page: p === 1 ? null : String(p) });

	const listQuery = useQuery({
		queryKey: textPhraseKeys.list({
			q: debouncedSearch || undefined,
			language: (language as TextPhraseLanguage) || undefined,
			page,
			limit: LIMIT,
		}),
		queryFn: () =>
			textPhraseApi.list({
				q: debouncedSearch || undefined,
				language: (language as TextPhraseLanguage) || undefined,
				page,
				limit: LIMIT,
			}),
		placeholderData: (prev) => prev,
		staleTime: 15_000,
	});

	const detailQuery = useQuery({
		queryKey: textPhraseKeys.detail(selectedId),
		queryFn: () => textPhraseApi.detail(selectedId),
		enabled: Boolean(selectedId),
		staleTime: 15_000,
	});

	const invalidateAll = () => {
		void qc.invalidateQueries({ queryKey: textPhraseKeys.all });
	};

	const createMutation = useMutation({
		mutationFn: (dto: CreateTextPhraseDto) => textPhraseApi.create(dto),
		onSuccess: (created) => {
			invalidateAll();
			setCreateOpen(false);
			push({ id: created.id });
			success(t("admin.textPhrases.toast.created"));
		},
		onError: () => showError(t("admin.textPhrases.toast.error")),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: PatchTextPhraseDto }) =>
			textPhraseApi.update(id, dto),
		onSuccess: () => {
			invalidateAll();
			setEditMode(false);
			success(t("admin.textPhrases.toast.updated"));
		},
		onError: () => showError(t("admin.textPhrases.toast.error")),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => textPhraseApi.remove(id),
		onSuccess: () => {
			invalidateAll();
			setDeleteTarget(null);
			push({ id: null });
			success(t("admin.textPhrases.toast.deleted"));
		},
		onError: () => showError(t("admin.textPhrases.toast.error")),
	});

	const deleteOccurrenceMutation = useMutation({
		mutationFn: (occurrenceId: string) => textPhraseApi.removeOccurrence(occurrenceId),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: textPhraseKeys.detail(selectedId) });
			setDeleteOccurrenceTarget(null);
			success(t("admin.textPhrases.toast.occurrenceDeleted"));
		},
		onError: () => showError(t("admin.textPhrases.toast.error")),
	});

	const handleStartEdit = () => {
		if (!detailQuery.data) return;
		setEditTranslation(detailQuery.data.translation);
		setEditNotes(detailQuery.data.notes ?? "");
		setEditMode(true);
	};

	const handleCancelEdit = () => setEditMode(false);

	const handleSaveEdit = () => {
		if (!selectedId) return;
		updateMutation.mutate({
			id: selectedId,
			dto: {
				translation: editTranslation.trim(),
				notes: editNotes.trim() || undefined,
			},
		});
	};

	const handleDeleteConfirm = () => {
		if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
	};

	const handleDeleteOccurrenceConfirm = () => {
		if (deleteOccurrenceTarget) deleteOccurrenceMutation.mutate(deleteOccurrenceTarget.id);
	};

	const total = listQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));

	return {
		selectedId,
		page,
		language,
		localSearch,
		createOpen,
		deleteTarget,
		deleteOccurrenceTarget,
		editMode,
		editTranslation,
		editNotes,
		listQuery,
		detailQuery,
		total,
		totalPages,
		LIMIT,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isDeletingOccurrence: deleteOccurrenceMutation.isPending,
		setCreateOpen,
		setDeleteTarget,
		setDeleteOccurrenceTarget,
		setEditTranslation,
		setEditNotes,
		handleSearchChange,
		handleLanguageChange,
		handleSelectPhrase,
		handleSetPage,
		handleStartEdit,
		handleCancelEdit,
		handleSaveEdit,
		handleCreate: createMutation.mutate,
		handleDeleteConfirm,
		handleDeleteOccurrenceConfirm,
	};
};
