"use client";

import { ChangeEvent, useState } from "react";
import { useSuggestions, useSuggestionStats, useReviewSuggestion } from "@/features/suggestions";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import type { Suggestion, SuggestionStatus } from "@/features/suggestions";

export const useAdminSuggestionsPage = () => {
	const { t } = useI18n();
	const { success, error } = useToast();

	const [statusFilter, setStatusFilter] = useState<SuggestionStatus | undefined>(undefined);
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [reviewComment, setReviewComment] = useState("");

	const debouncedQuery = useDebounce(query, 350);

	const { data, isLoading, isError } = useSuggestions({
		status: statusFilter,
		q: debouncedQuery || undefined,
		limit: 50,
		offset: 0,
	});

	const { data: stats } = useSuggestionStats();
	const { mutate: reviewMutate, isPending: isReviewing } = useReviewSuggestion();

	const suggestions = data?.data ?? [];
	const selectedSuggestion = suggestions.find(s => s.id === selectedId) ?? null;

	const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const val = e.currentTarget.value;
		setStatusFilter(val ? (val as SuggestionStatus) : undefined);
	};

	const handleQueryChange = (v: string) => {
		setQuery(v);
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
				onSuccess: () => {
					success(t("adminSuggestions.successApprove"));
					setReviewComment("");
				},
				onError: () => error(t("adminSuggestions.errorReview")),
			},
		);
	};

	const handleReject = () => {
		if (!selectedId) return;
		reviewMutate(
			{ id: selectedId, dto: { decision: "reject", comment: reviewComment || undefined } },
			{
				onSuccess: () => {
					success(t("adminSuggestions.successReject"));
					setReviewComment("");
				},
				onError: () => error(t("adminSuggestions.errorReview")),
			},
		);
	};

	return {
		suggestions,
		stats,
		isLoading,
		isError,
		statusFilter,
		query,
		selectedId,
		selectedSuggestion,
		reviewComment,
		isReviewing,
		handleStatusFilterChange,
		handleQueryChange,
		handleSelect,
		handleReviewCommentChange,
		handleApprove,
		handleReject,
	};
};
