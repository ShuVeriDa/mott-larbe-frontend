"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import {
	adminPhrasebookApi,
	adminPhrasebookKeys,
	type CreateAdminCategoryDto,
	type UpdateAdminCategoryDto,
	type CreateAdminPhraseDto,
	type UpdateAdminPhraseDto,
	type AdminPhrasebookCategory,
	type AdminPhrasebookPhrase,
} from "@/entities/phrasebook";
import type { AdminPhrasebookTab } from "./types";
import { PHRASES_LIMIT, VALID_TABS } from "../lib/constants";

const asTab = (v: string | null): AdminPhrasebookTab =>
	VALID_TABS.includes(v as AdminPhrasebookTab) ? (v as AdminPhrasebookTab) : "categories";

const asPage = (v: string | null): number => {
	const n = Number(v);
	return Number.isInteger(n) && n > 0 ? n : 1;
};

export const useAdminPhrasebookPage = () => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const qc = useQueryClient();

	const tab = asTab(searchParams.get("tab"));
	const page = asPage(searchParams.get("page"));
	const categoryId = searchParams.get("categoryId") ?? undefined;

	const [localSearch, setLocalSearch] = useState(searchParams.get("search") ?? "");
	const debouncedSearch = useDebounce(localSearch, 350);

	const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
	const [editCategory, setEditCategory] = useState<AdminPhrasebookCategory | null>(null);
	const [deleteCategory, setDeleteCategory] = useState<AdminPhrasebookCategory | null>(null);

	const [createPhraseOpen, setCreatePhraseOpen] = useState(false);
	const [editPhrase, setEditPhrase] = useState<AdminPhrasebookPhrase | null>(null);
	const [deletePhrase, setDeletePhrase] = useState<AdminPhrasebookPhrase | null>(null);

	const [deleteSuggestionId, setDeleteSuggestionId] = useState<string | null>(null);
	const [acceptSuggestion, setAcceptSuggestion] = useState<{ id: string; original: string; translation: string; lang: string } | null>(null);

	const push = (updates: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString());
		for (const [k, v] of Object.entries(updates)) {
			if (v === null || v === "") params.delete(k);
			else params.set(k, v);
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const handleTabChange = (next: AdminPhrasebookTab) => {
		push({ tab: next === "categories" ? null : next, page: null, search: null, categoryId: null });
		setLocalSearch("");
	};

	const handleSearchChange = (v: string) => {
		setLocalSearch(v);
		push({ search: v || null, page: null });
	};

	const handleCategoryFilter = (id: string | null) => {
		push({ categoryId: id, page: null });
	};

	const handlePageChange = (p: number) => {
		push({ page: p === 1 ? null : String(p) });
	};

	const invalidateAll = () => {
		void qc.invalidateQueries({ queryKey: adminPhrasebookKeys.all });
	};

	const categoriesQuery = useQuery({
		queryKey: adminPhrasebookKeys.categories(),
		queryFn: adminPhrasebookApi.getCategories,
		staleTime: 30_000,
	});

	const phrasesQuery = useQuery({
		queryKey: adminPhrasebookKeys.phrases({ categoryId, search: debouncedSearch || undefined, page, limit: PHRASES_LIMIT }),
		queryFn: () => adminPhrasebookApi.getPhrases({ categoryId, search: debouncedSearch || undefined, page, limit: PHRASES_LIMIT }),
		placeholderData: (prev) => prev,
		staleTime: 15_000,
		enabled: tab === "phrases",
	});

	const suggestionsQuery = useQuery({
		queryKey: adminPhrasebookKeys.suggestions(),
		queryFn: adminPhrasebookApi.getSuggestions,
		staleTime: 15_000,
		enabled: tab === "suggestions",
	});

	const createCategoryMutation = useMutation({
		mutationFn: (dto: CreateAdminCategoryDto) => adminPhrasebookApi.createCategory(dto),
		onSuccess: () => {
			invalidateAll();
			setCreateCategoryOpen(false);
			success(t("adminPhrasebook.categoryCreated"));
		},
		onError: () => toastError(t("adminPhrasebook.errorSave")),
	});

	const updateCategoryMutation = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateAdminCategoryDto }) =>
			adminPhrasebookApi.updateCategory(id, dto),
		onSuccess: () => {
			invalidateAll();
			setEditCategory(null);
			success(t("adminPhrasebook.categorySaved"));
		},
		onError: () => toastError(t("adminPhrasebook.errorSave")),
	});

	const deleteCategoryMutation = useMutation({
		mutationFn: (id: string) => adminPhrasebookApi.deleteCategory(id),
		onSuccess: () => {
			invalidateAll();
			setDeleteCategory(null);
			success(t("adminPhrasebook.categoryDeleted"));
		},
		onError: () => toastError(t("adminPhrasebook.errorDelete")),
	});

	const createPhraseMutation = useMutation({
		mutationFn: (dto: CreateAdminPhraseDto) => adminPhrasebookApi.createPhrase(dto),
		onSuccess: () => {
			invalidateAll();
			setCreatePhraseOpen(false);
			success(t("adminPhrasebook.phraseCreated"));
		},
		onError: () => toastError(t("adminPhrasebook.errorSave")),
	});

	const updatePhraseMutation = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateAdminPhraseDto }) =>
			adminPhrasebookApi.updatePhrase(id, dto),
		onSuccess: () => {
			invalidateAll();
			setEditPhrase(null);
			success(t("adminPhrasebook.phraseSaved"));
		},
		onError: () => toastError(t("adminPhrasebook.errorSave")),
	});

	const deletePhraseMutation = useMutation({
		mutationFn: (id: string) => adminPhrasebookApi.deletePhrase(id),
		onSuccess: () => {
			invalidateAll();
			setDeletePhrase(null);
			success(t("adminPhrasebook.phraseDeleted"));
		},
		onError: () => toastError(t("adminPhrasebook.errorDelete")),
	});

	const deleteSuggestionMutation = useMutation({
		mutationFn: (id: string) => adminPhrasebookApi.deleteSuggestion(id),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: adminPhrasebookKeys.suggestions() });
			setDeleteSuggestionId(null);
			success(t("adminPhrasebook.suggestionDeleted"));
		},
		onError: () => toastError(t("adminPhrasebook.errorDelete")),
	});

	const categories = categoriesQuery.data ?? [];
	const phrases = phrasesQuery.data?.items ?? [];
	const phrasesTotal = phrasesQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(phrasesTotal / PHRASES_LIMIT));
	const suggestions = suggestionsQuery.data?.items ?? [];

	return {
		tab,
		page,
		localSearch,
		debouncedSearch,
		categoryId,
		categories,
		phrases,
		phrasesTotal,
		totalPages,
		suggestions,
		categoriesLoading: categoriesQuery.isLoading,
		phrasesLoading: phrasesQuery.isLoading || phrasesQuery.isFetching,
		suggestionsLoading: suggestionsQuery.isLoading,
		createCategoryOpen,
		editCategory,
		deleteCategory,
		createPhraseOpen,
		editPhrase,
		deletePhrase,
		deleteSuggestionId,
		acceptSuggestion,
		isCreatingCategory: createCategoryMutation.isPending,
		isUpdatingCategory: updateCategoryMutation.isPending,
		isDeletingCategory: deleteCategoryMutation.isPending,
		isCreatingPhrase: createPhraseMutation.isPending,
		isUpdatingPhrase: updatePhraseMutation.isPending,
		isDeletingPhrase: deletePhraseMutation.isPending,
		isDeletingSuggestion: deleteSuggestionMutation.isPending,
		setCreateCategoryOpen,
		setEditCategory,
		setDeleteCategory,
		setCreatePhraseOpen,
		setEditPhrase,
		setDeletePhrase,
		setDeleteSuggestionId,
		setAcceptSuggestion,
		handleTabChange,
		handleSearchChange,
		handleCategoryFilter,
		handlePageChange,
		handleCreateCategory: createCategoryMutation.mutate,
		handleUpdateCategory: (id: string, dto: UpdateAdminCategoryDto) =>
			updateCategoryMutation.mutate({ id, dto }),
		handleDeleteCategory: () => deleteCategory && deleteCategoryMutation.mutate(deleteCategory.id),
		handleCreatePhrase: createPhraseMutation.mutate,
		handleUpdatePhrase: (id: string, dto: UpdateAdminPhraseDto) =>
			updatePhraseMutation.mutate({ id, dto }),
		handleDeletePhrase: () => deletePhrase && deletePhraseMutation.mutate(deletePhrase.id),
		handleDeleteSuggestion: () => deleteSuggestionId && deleteSuggestionMutation.mutate(deleteSuggestionId),
	};
};
