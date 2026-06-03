"use client";

import { ChangeEvent, useState } from "react";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import {
	useTextSubmissions,
	useTextSubmissionStats,
	useReviewTextSubmission,
} from "@/features/text-submission";
import type { TextSubmission, TextSubmissionStatus } from "@/features/text-submission";

// Admin queue shows only submitted items — DRAFT is private until owner submits.
// This constant enforces the security requirement from the plan (Step 11).
const ADMIN_VISIBLE_STATUSES: TextSubmissionStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export const useAdminTextSubmissionsPage = () => {
	const { t } = useI18n();
	const { success, error } = useToast();

	const [statusFilter, setStatusFilter] = useState<TextSubmissionStatus | undefined>(undefined);
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [reviewComment, setReviewComment] = useState("");
	const [showDetail, setShowDetail] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);
	const [order, setOrder] = useState<"asc" | "desc">("desc");

	const debouncedQuery = useDebounce(query, 350);

	// When no explicit filter is set, restrict to ADMIN_VISIBLE_STATUSES so DRAFTs
	// never appear in the admin queue. When a specific status is chosen, honour it
	// (admin may want to filter by APPROVED/REJECTED explicitly).
	const effectiveStatus = statusFilter ?? undefined;
	const { data, isLoading, isFetching, isError } = useTextSubmissions({
		status: effectiveStatus && ADMIN_VISIBLE_STATUSES.includes(effectiveStatus)
			? effectiveStatus
			: effectiveStatus === "DRAFT"
				? ("PENDING" as TextSubmissionStatus) // DRAFT not allowed — silently fall back
				: effectiveStatus,
		q: debouncedQuery || undefined,
		limit: pageSize,
		offset: (page - 1) * pageSize,
		order,
	});

	const { data: stats } = useTextSubmissionStats();
	const { mutate: reviewMutate, isPending: isReviewing } = useReviewTextSubmission();

	const submissions = data?.data ?? [];
	const total = data?.meta.total ?? 0;
	const selectedSubmission: TextSubmission | null =
		submissions.find((s) => s.id === selectedId) ?? null;

	const resetPage = () => setPage(1);

	const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setStatusFilter(e.currentTarget.value ? (e.currentTarget.value as TextSubmissionStatus) : undefined);
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
		setShowDetail(false);
	};

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setPage(1);
		setSelectedId(null);
		setShowDetail(false);
	};

	const handleSelect = (id: string) => {
		setSelectedId(id);
		setReviewComment("");
		setShowDetail(true);
	};

	const handleBack = () => setShowDetail(false);

	const handleReviewCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setReviewComment(e.currentTarget.value);
	};

	const handleApprove = () => {
		if (!selectedId) return;
		reviewMutate(
			{ id: selectedId, dto: { decision: "approve", reviewComment: reviewComment || undefined } },
			{
				onSuccess: () => { success(t("adminTextSubmissions.successApprove")); setReviewComment(""); },
				onError: () => error(t("adminTextSubmissions.errorReview")),
			},
		);
	};

	const handleReject = () => {
		if (!selectedId) return;
		reviewMutate(
			{ id: selectedId, dto: { decision: "reject", reviewComment: reviewComment || undefined } },
			{
				onSuccess: () => { success(t("adminTextSubmissions.successReject")); setReviewComment(""); },
				onError: () => error(t("adminTextSubmissions.errorReview")),
			},
		);
	};

	return {
		submissions, stats, total, isLoading, isFetching, isError,
		statusFilter, query, order,
		page, pageSize,
		selectedId, selectedSubmission,
		reviewComment, isReviewing, showDetail,
		handleStatusFilterChange, handleQueryChange, handleOrderChange,
		handlePageChange, handlePageSizeChange,
		handleSelect, handleBack,
		handleReviewCommentChange, handleApprove, handleReject,
		t,
	};
};
