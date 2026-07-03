"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/shared/lib/debounce";
import {
	getCorrectFormPlainText,
	spellingOccurrencesQueryOptions,
	spellingOccurrenceTextsQueryOptions,
	useFixOccurrences,
} from "@/entities/spelling-dictionary";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_LIMIT = 20;
const VALID_LIMITS = [20, 50, 100];
const VALID_MATCH_TYPES: SpellingMatchType[] = ["substring", "whole_word", "prefix", "suffix"];

interface UseAdminSpellingDictionaryDetailPageParams {
	entryId: string;
	initialPage: number;
	initialTextIds: string[];
}

export const useAdminSpellingDictionaryDetailPage = ({
	entryId,
	initialPage,
	initialTextIds,
}: UseAdminSpellingDictionaryDetailPageParams) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const page = searchParams.has("page")
		? Math.max(1, Number(searchParams.get("page") ?? "1"))
		: initialPage;
	const textIds = searchParams.has("textIds")
		? (searchParams.get("textIds")?.split(",").filter(Boolean) ?? [])
		: initialTextIds;
	const rawLimit = Number(searchParams.get("limit"));
	const limit = searchParams.has("limit") && VALID_LIMITS.includes(rawLimit)
		? rawLimit
		: DEFAULT_LIMIT;
	const rawMatchType = searchParams.get("matchType");
	const matchTypeFilter = VALID_MATCH_TYPES.includes(rawMatchType as SpellingMatchType)
		? (rawMatchType as SpellingMatchType)
		: undefined;

	const [selectedTokenIds, setSelectedTokenIds] = useState<Set<string>>(new Set());
	const [textFilterSearch, setTextFilterSearch] = useState("");
	const debouncedTextFilterSearch = useDebounce(textFilterSearch, 300);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [fixErrorCount, setFixErrorCount] = useState(0);

	const updateUrl = (updates: {
		page?: number;
		textIds?: string[];
		limit?: number;
		matchType?: SpellingMatchType | null;
	}) => {
		const params = new URLSearchParams(searchParams.toString());
		const nextPage = updates.page ?? page;
		const nextTextIds = updates.textIds ?? textIds;
		const nextLimit = updates.limit ?? limit;
		const nextMatchType = updates.matchType === undefined ? matchTypeFilter : updates.matchType;

		if (nextPage <= 1) params.delete("page");
		else params.set("page", String(nextPage));

		if (nextTextIds.length === 0) params.delete("textIds");
		else params.set("textIds", nextTextIds.join(","));

		if (nextLimit === DEFAULT_LIMIT) params.delete("limit");
		else params.set("limit", String(nextLimit));

		if (!nextMatchType) params.delete("matchType");
		else params.set("matchType", nextMatchType);

		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const occurrencesQuery = useQuery(
		spellingOccurrencesQueryOptions(entryId, { page, limit, textIds, matchType: matchTypeFilter }),
	);
	const occurrenceTextsQuery = useQuery(
		spellingOccurrenceTextsQueryOptions(entryId, { search: debouncedTextFilterSearch || undefined }),
	);
	const fixMutation = useFixOccurrences();

	const items = occurrencesQuery.data?.items ?? [];
	const total = occurrencesQuery.data?.total ?? 0;
	const canBulkFix = occurrencesQuery.data?.canBulkFix ?? false;
	const entry = occurrencesQuery.data?.entry;
	const appliedMatchType = occurrencesQuery.data?.appliedMatchType ?? entry?.matchType;
	const textOptions = occurrenceTextsQuery.data ?? [];

	const allSelected = items.length > 0 && items.every((item) => selectedTokenIds.has(item.tokenId));
	const someSelected = items.some((item) => selectedTokenIds.has(item.tokenId));

	const handlePageChange = (next: number) => {
		setSelectedTokenIds(new Set());
		updateUrl({ page: next });
	};

	const handleLimitChange = (next: number) => {
		setSelectedTokenIds(new Set());
		updateUrl({ limit: next, page: 1 });
	};

	const handleMatchTypeFilterChange = (next: SpellingMatchType | null) => {
		setSelectedTokenIds(new Set());
		updateUrl({ matchType: next, page: 1 });
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
		if (!entry) return;
		const plainCorrectForm = getCorrectFormPlainText(entry.correctForm);
		const updates = items
			.filter((item) => selectedTokenIds.has(item.tokenId))
			.map((item) => ({ tokenId: item.tokenId, original: plainCorrectForm }));
		const result = await fixMutation.mutateAsync(updates);
		setFixErrorCount(result.errors.length);
		setSelectedTokenIds(new Set());
		setConfirmOpen(false);
	};

	const handleFixOne = async (tokenId: string) => {
		if (!entry) return;
		const plainCorrectForm = getCorrectFormPlainText(entry.correctForm);
		const result = await fixMutation.mutateAsync([{ tokenId, original: plainCorrectForm }]);
		setFixErrorCount(result.errors.length);
		setSelectedTokenIds((prev) => {
			const next = new Set(prev);
			next.delete(tokenId);
			return next;
		});
	};

	return {
		entry,
		items,
		total,
		page,
		limit,
		canBulkFix,
		matchTypeFilter,
		appliedMatchType,
		textIds,
		textOptions,
		textFilterSearch,
		selectedTokenIds,
		allSelected,
		someSelected,
		confirmOpen,
		fixErrorCount,
		isLoading: occurrencesQuery.isPending,
		isError: occurrencesQuery.isError,
		isTextOptionsLoading: occurrenceTextsQuery.isPending,
		isFixing: fixMutation.isPending,
		handlePageChange,
		handleLimitChange,
		handleMatchTypeFilterChange,
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
