"use client";

import { ChangeEvent, useState } from "react";
import { useSuggestions, useSuggestionStats, useReviewSuggestion } from "@/features/suggestions";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import type { SuggestionStatus, SuggestionType } from "@/features/suggestions";

export const useAdminSuggestionsPage = () => {
	const { t } = useI18n();
	const { success, error } = useToast();

	const [statusFilter, setStatusFilter] = useState<SuggestionStatus | undefined>(undefined);
	const [typeFilter, setTypeFilter] = useState<SuggestionType | undefined>(undefined);
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [reviewComment, setReviewComment] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);
	const [order, setOrder] = useState<"asc" | "desc">("desc");

	const debouncedQuery = useDebounce(query, 350);

	const { data, isLoading, isFetching, isError } = useSuggestions({
		status: statusFilter,
		type: typeFilter,
		q: debouncedQuery || undefined,
		limit: pageSize,
		offset: (page - 1) * pageSize,
		order,
	});

	const { data: stats } = useSuggestionStats();
	const { mutate: reviewMutate, isPending: isReviewing } = useReviewSuggestion();

	const suggestions = data?.data ?? [];
	const total = data?.meta.total ?? 0;
	const selectedSuggestion = suggestions.find((s) => s.id === selectedId) ?? null;

	const resetPage = () => setPage(1);

	const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setStatusFilter(e.currentTarget.value ? (e.currentTarget.value as SuggestionStatus) : undefined);
		resetPage();
	};

	const handleTypeFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setTypeFilter(e.currentTarget.value ? (e.currentTarget.value as SuggestionType) : undefined);
		resetPage();
	};

	const handleQueryChange = (v: string) => {
		setQuery(v);
		resetPage();
	};

	const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setOrder(e.currentTarget.value as "asc" | "desc");
		resetPage();
	};

	const handlePageChange = (p: number) => {
		setPage(p);
		setSelectedId(null);
	};

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setPage(1);
		setSelectedId(null);
	};

	const handleSelect = (id: string) => {
		setSelectedId(id);
		setReviewComment("");
	};

	const handleReviewCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setReviewComment(e.currentTarget.value);
	};

	const handleApprove = () => {
		if (!selectedId) return;
		reviewMutate(
			{ id: selectedId, dto: { decision: "approve", comment: reviewComment || undefined } },
			{
				onSuccess: () => { success(t("adminSuggestions.successApprove")); setReviewComment(""); },
				onError: () => error(t("adminSuggestions.errorReview")),
			},
		);
	};

	const handleReject = () => {
		if (!selectedId) return;
		reviewMutate(
			{ id: selectedId, dto: { decision: "reject", comment: reviewComment || undefined } },
			{
				onSuccess: () => { success(t("adminSuggestions.successReject")); setReviewComment(""); },
				onError: () => error(t("adminSuggestions.errorReview")),
			},
		);
	};

	return {
		suggestions, stats, total, isLoading, isFetching, isError,
		statusFilter, typeFilter, query, order,
		page, pageSize,
		selectedId, selectedSuggestion,
		reviewComment, isReviewing,
		handleStatusFilterChange, handleTypeFilterChange,
		handleQueryChange, handleOrderChange,
		handlePageChange, handlePageSizeChange,
		handleSelect, handleReviewCommentChange,
		handleApprove, handleReject,
	};
};
