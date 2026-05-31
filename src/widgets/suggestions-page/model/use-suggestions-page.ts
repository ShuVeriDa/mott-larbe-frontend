"use client";

import { ChangeEvent, useState } from "react";
import { useMySuggestions } from "@/features/suggestions";
import { useMyTextSubmissions } from "@/features/text-submission";
import type { SuggestionStatus } from "@/features/suggestions";
import type { TextSubmissionStatus } from "@/features/text-submission";

export type SuggestionsTab = "word-edits" | "text-submissions";

export const useSuggestionsPage = () => {
	const [tab, setTab] = useState<SuggestionsTab>("word-edits");

	// --- word-edits ---
	const [statusFilter, setStatusFilter] = useState<SuggestionStatus | undefined>(undefined);
	const [wordSelectedId, setWordSelectedId] = useState<string | null>(null);
	const [wordPage, setWordPage] = useState(1);
	const [wordPageSize, setWordPageSize] = useState(25);
	const [wordOrder, setWordOrder] = useState<"asc" | "desc">("desc");

	const { data: wordData, isLoading: wordLoading, isError: wordError } = useMySuggestions({
		status: statusFilter,
		order: wordOrder,
		limit: wordPageSize,
		offset: (wordPage - 1) * wordPageSize,
	});

	const suggestions = wordData?.data ?? [];
	const wordTotal = wordData?.meta.total ?? 0;
	const selectedSuggestion = suggestions.find((s) => s.id === wordSelectedId) ?? null;

	// --- text-submissions ---
	const [tsStatusFilter, setTsStatusFilter] = useState<TextSubmissionStatus | undefined>(undefined);
	const [tsSelectedId, setTsSelectedId] = useState<string | null>(null);
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
	const selectedTextSubmission = textSubmissions.find((s) => s.id === tsSelectedId) ?? null;

	const [showDetail, setShowDetail] = useState(false);

	// --- word-edits handlers ---
	const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setStatusFilter(e.currentTarget.value ? (e.currentTarget.value as SuggestionStatus) : undefined);
		setWordPage(1);
		setWordSelectedId(null);
	};

	const handleWordOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setWordOrder(e.currentTarget.value as "asc" | "desc");
		setWordPage(1);
	};

	const handleWordPageChange = (p: number) => {
		setWordPage(p);
		setWordSelectedId(null);
		setShowDetail(false);
	};

	const handleWordPageSizeChange = (size: number) => {
		setWordPageSize(size);
		setWordPage(1);
		setWordSelectedId(null);
	};

	const handleSelectSuggestion = (id: string) => {
		setWordSelectedId(id);
		setShowDetail(true);
	};

	// --- text-submissions handlers ---
	const handleTsStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setTsStatusFilter(e.currentTarget.value ? (e.currentTarget.value as TextSubmissionStatus) : undefined);
		setTsPage(1);
		setTsSelectedId(null);
	};

	const handleTsOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setTsOrder(e.currentTarget.value as "asc" | "desc");
		setTsPage(1);
	};

	const handleTsPageChange = (p: number) => {
		setTsPage(p);
		setTsSelectedId(null);
		setShowDetail(false);
	};

	const handleTsPageSizeChange = (size: number) => {
		setTsPageSize(size);
		setTsPage(1);
		setTsSelectedId(null);
	};

	const handleSelectTextSubmission = (id: string) => {
		setTsSelectedId(id);
		setShowDetail(true);
	};

	const handleBack = () => setShowDetail(false);

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
