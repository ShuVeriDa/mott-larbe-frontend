"use client";

import { ChangeEvent, useState } from "react";
import { useMySuggestions, useSuggestion } from "@/features/suggestions";
import { useMyTextSubmissions, useOwnedTextSubmission } from "@/features/text-submission";
import { useRouter, useSearchParams } from "next/navigation";
import type { SuggestionStatus } from "@/features/suggestions";
import type { TextSubmissionStatus } from "@/features/text-submission";

export type SuggestionsTab = "word-edits" | "text-submissions";

export const useSuggestionsPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [tab, setTab] = useState<SuggestionsTab>(() =>
		searchParams.get("submission") ? "text-submissions" : "word-edits",
	);

	// --- word-edits ---
	const [statusFilter, setStatusFilter] = useState<SuggestionStatus | undefined>(undefined);
	const [wordPage, setWordPage] = useState(1);
	const [wordPageSize, setWordPageSize] = useState(25);
	const [wordOrder, setWordOrder] = useState<"asc" | "desc">("desc");

	const { data: wordData, isLoading: wordLoading, isError: wordError } = useMySuggestions({
		status: statusFilter,
		order: wordOrder,
		limit: wordPageSize,
		offset: (wordPage - 1) * wordPageSize,
	});

	const wordSelectedId = searchParams.get("suggestion");
	const suggestions = wordData?.data ?? [];
	const wordTotal = wordData?.meta.total ?? 0;
	const wordFromList = suggestions.find((s) => s.id === wordSelectedId) ?? null;
	const wordDetailQuery = useSuggestion(wordSelectedId ?? "");
	const selectedSuggestion = wordFromList ?? wordDetailQuery.data ?? null;

	// --- text-submissions ---
	const [tsStatusFilter, setTsStatusFilter] = useState<TextSubmissionStatus | undefined>(undefined);
	const tsSelectedId = searchParams.get("submission");
	const [tsPage, setTsPage] = useState(1);
	const [tsPageSize, setTsPageSize] = useState(25);
	const [tsOrder, setTsOrder] = useState<"asc" | "desc">("desc");

	const { data: tsData, isLoading: tsLoading, isError: tsError } = useMyTextSubmissions({
		limit: tsPageSize,
		offset: (tsPage - 1) * tsPageSize,
	});

	const allTextSubmissions = tsData?.data ?? [];
	const textSubmissions = tsStatusFilter
		? allTextSubmissions.filter((s) => s.status === tsStatusFilter)
		: allTextSubmissions;
	const tsTotal = tsData?.meta.total ?? 0;
	const tsFromList = textSubmissions.find((s) => s.id === tsSelectedId) ?? null;
	const tsDetailQuery = useOwnedTextSubmission(tsSelectedId ?? "");
	const selectedTextSubmission = tsFromList ?? tsDetailQuery.data ?? null;

	const [showDetail, setShowDetail] = useState(() => !!(searchParams.get("suggestion") || searchParams.get("submission")));

	const setWordSelected = (id: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (id) { params.set("suggestion", id); } else { params.delete("suggestion"); }
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const setTsSelected = (id: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (id) { params.set("submission", id); } else { params.delete("submission"); }
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	// --- word-edits handlers ---
	const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setStatusFilter(e.currentTarget.value ? (e.currentTarget.value as SuggestionStatus) : undefined);
		setWordPage(1);
	};

	const handleWordOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setWordOrder(e.currentTarget.value as "asc" | "desc");
		setWordPage(1);
	};

	const handleWordPageChange = (p: number) => {
		setWordPage(p);
	};

	const handleWordPageSizeChange = (size: number) => {
		setWordPageSize(size);
		setWordPage(1);
	};

	const handleSelectSuggestion = (id: string) => {
		setWordSelected(id);
		setShowDetail(true);
	};

	// --- text-submissions handlers ---
	const handleTsStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setTsStatusFilter(e.currentTarget.value ? (e.currentTarget.value as TextSubmissionStatus) : undefined);
		setTsPage(1);
	};

	const handleTsOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setTsOrder(e.currentTarget.value as "asc" | "desc");
		setTsPage(1);
	};

	const handleTsPageChange = (p: number) => {
		setTsPage(p);
	};

	const handleTsPageSizeChange = (size: number) => {
		setTsPageSize(size);
		setTsPage(1);
	};

	const handleSelectTextSubmission = (id: string) => {
		setTsSelected(id);
		setShowDetail(true);
	};

	const handleBack = () => {
		if (tab === "word-edits") setWordSelected(null);
		else setTsSelected(null);
		setShowDetail(false);
	};

	const handleTabChange = (t: SuggestionsTab) => {
		setTab(t);
		setShowDetail(false);
	};

	return {
		tab, handleTabChange,
		// word-edits
		suggestions, wordTotal, wordLoading, wordError,
		statusFilter, wordOrder, wordPage, wordPageSize,
		wordSelectedId, selectedSuggestion,
		handleStatusFilterChange, handleWordOrderChange,
		handleWordPageChange, handleWordPageSizeChange,
		handleSelectSuggestion,
		// text-submissions
		textSubmissions, tsTotal, tsLoading, tsError,
		tsStatusFilter, tsOrder, tsPage, tsPageSize,
		tsSelectedId, selectedTextSubmission,
		handleTsStatusFilterChange, handleTsOrderChange,
		handleTsPageChange, handleTsPageSizeChange,
		handleSelectTextSubmission,
		// shared
		showDetail, handleBack,
	};
};
