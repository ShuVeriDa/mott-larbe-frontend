"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import {
	findReplaceOccurrencesQueryOptions,
	findReplaceTextsQueryOptions,
	useFixOccurrences,
} from "@/entities/spelling-dictionary";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";

const DEFAULT_LIMIT = 20;
const VALID_LIMITS = [20, 50, 100];

interface UseAdminSpellingFindReplacePageParams {
	initialWrongForm: string;
	initialMatchType: SpellingMatchType;
	initialCorrectForm: string;
	initialPage: number;
	initialTextIds: string[];
}

export const useAdminSpellingFindReplacePage = ({
	initialWrongForm,
	initialMatchType,
	initialCorrectForm,
	initialPage,
	initialTextIds,
}: UseAdminSpellingFindReplacePageParams) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const VALID_MATCH_TYPES: SpellingMatchType[] = ["substring", "whole_word", "prefix", "suffix"];

	const wrongForm = searchParams.has("wrongForm") ? (searchParams.get("wrongForm") ?? "") : initialWrongForm;
	const rawMatchType = searchParams.get("matchType");
	const matchType = searchParams.has("matchType")
		? (VALID_MATCH_TYPES.includes(rawMatchType as SpellingMatchType)
			? (rawMatchType as SpellingMatchType)
			: "substring")
		: initialMatchType;
	const correctForm = searchParams.has("correctForm") ? (searchParams.get("correctForm") ?? "") : initialCorrectForm;
	const page = searchParams.has("page") ? Math.max(1, Number(searchParams.get("page") ?? "1")) : initialPage;
	const textIds = searchParams.has("textIds")
		? (searchParams.get("textIds")?.split(",").filter(Boolean) ?? [])
		: initialTextIds;
	const rawLimit = Number(searchParams.get("limit"));
	const limit = searchParams.has("limit") && VALID_LIMITS.includes(rawLimit)
		? rawLimit
		: DEFAULT_LIMIT;

	const [wrongFormInput, setWrongFormInput] = useState(wrongForm);
	const [correctFormInput, setCorrectFormInput] = useState(correctForm);
	const debouncedWrongForm = useDebounce(wrongFormInput, 300);

	const [selectedTokenIds, setSelectedTokenIds] = useState<Set<string>>(new Set());
	const [textFilterSearch, setTextFilterSearch] = useState("");
	const debouncedTextFilterSearch = useDebounce(textFilterSearch, 300);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [fixErrorCount, setFixErrorCount] = useState(0);

	const updateUrl = (updates: {
		wrongForm?: string;
		matchType?: SpellingMatchType;
		correctForm?: string;
		page?: number;
		textIds?: string[];
		limit?: number;
	}) => {
		const params = new URLSearchParams(searchParams.toString());
		const next = {
			wrongForm: updates.wrongForm ?? wrongForm,
			matchType: updates.matchType ?? matchType,
			correctForm: updates.correctForm ?? correctForm,
			page: updates.page ?? page,
			textIds: updates.textIds ?? textIds,
			limit: updates.limit ?? limit,
		};

		if (!next.wrongForm) params.delete("wrongForm");
		else params.set("wrongForm", next.wrongForm);

		params.set("matchType", next.matchType);

		if (!next.correctForm) params.delete("correctForm");
		else params.set("correctForm", next.correctForm);

		if (next.page <= 1) params.delete("page");
		else params.set("page", String(next.page));

		if (next.textIds.length === 0) params.delete("textIds");
		else params.set("textIds", next.textIds.join(","));

		if (next.limit === DEFAULT_LIMIT) params.delete("limit");
		else params.set("limit", String(next.limit));

		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const occurrencesQuery = useQuery(
		findReplaceOccurrencesQueryOptions({
			wrongForm: debouncedWrongForm,
			matchType,
			page,
			limit,
			textIds,
		}),
	);
	const occurrenceTextsQuery = useQuery(
		findReplaceTextsQueryOptions({
			wrongForm: debouncedWrongForm,
			matchType,
			search: debouncedTextFilterSearch || undefined,
		}),
	);
	const fixMutation = useFixOccurrences();

	const items = occurrencesQuery.data?.items ?? [];
	const total = occurrencesQuery.data?.total ?? 0;
	const textOptions = occurrenceTextsQuery.data ?? [];

	const allSelected = items.length > 0 && items.every((item) => selectedTokenIds.has(item.tokenId));
	const someSelected = items.some((item) => selectedTokenIds.has(item.tokenId));

	const handleWrongFormChange = (value: string) => {
		setWrongFormInput(value);
		setSelectedTokenIds(new Set());
		updateUrl({ wrongForm: value, page: 1 });
	};

	const handleMatchTypeChange = (value: SpellingMatchType) => {
		setSelectedTokenIds(new Set());
		updateUrl({ matchType: value, page: 1 });
	};

	const handleCorrectFormChange = (value: string) => {
		setCorrectFormInput(value);
		updateUrl({ correctForm: value });
	};

	const handlePageChange = (next: number) => {
		setSelectedTokenIds(new Set());
		updateUrl({ page: next });
	};

	const handleLimitChange = (next: number) => {
		setSelectedTokenIds(new Set());
		updateUrl({ limit: next, page: 1 });
	};

	const handleTextFilterChange = (next: string[]) => {
		setSelectedTokenIds(new Set());
		updateUrl({ page: 1, textIds: next });
	};

	const handleTextFilterSearchChange = (value: string) => setTextFilterSearch(value);

	const handleToggleSelect = (tokenId: string) => {
		setSelectedTokenIds((prev) => {
			const next = new Set(prev);
			if (next.has(tokenId)) next.delete(tokenId);
			else next.add(tokenId);
			return next;
		});
	};

	const handleSelectAll = () => {
		setSelectedTokenIds((prev) => {
			if (allSelected) return new Set();
			const next = new Set(prev);
			items.forEach((item) => next.add(item.tokenId));
			return next;
		});
	};

	const handleOpenConfirm = () => setConfirmOpen(true);
	const handleCloseConfirm = () => setConfirmOpen(false);

	const handleFixSelected = async () => {
		if (!correctForm) return;
		const updates = items
			.filter((item) => selectedTokenIds.has(item.tokenId))
			.map((item) => ({ tokenId: item.tokenId, original: correctForm }));
		const result = await fixMutation.mutateAsync(updates);
		setFixErrorCount(result.errors.length);
		setSelectedTokenIds(new Set());
		setConfirmOpen(false);
	};

	const handleFixOne = async (tokenId: string) => {
		if (!correctForm) return;
		const result = await fixMutation.mutateAsync([{ tokenId, original: correctForm }]);
		setFixErrorCount(result.errors.length);
		setSelectedTokenIds((prev) => {
			const next = new Set(prev);
			next.delete(tokenId);
			return next;
		});
	};

	return {
		wrongFormInput,
		correctFormInput,
		matchType,
		items,
		total,
		page,
		limit,
		textIds,
		textOptions,
		textFilterSearch,
		selectedTokenIds,
		allSelected,
		someSelected,
		confirmOpen,
		fixErrorCount,
		canBulkFix: Boolean(correctForm),
		hasSearch: debouncedWrongForm.trim().length > 0,
		isLoading: occurrencesQuery.isPending,
		isError: occurrencesQuery.isError,
		isTextOptionsLoading: occurrenceTextsQuery.isPending,
		isFixing: fixMutation.isPending,
		handleWrongFormChange,
		handleMatchTypeChange,
		handleCorrectFormChange,
		handlePageChange,
		handleLimitChange,
		handleTextFilterChange,
		handleTextFilterSearchChange,
		handleToggleSelect,
		handleSelectAll,
		handleOpenConfirm,
		handleCloseConfirm,
		handleFixSelected,
		handleFixOne,
	};
};
