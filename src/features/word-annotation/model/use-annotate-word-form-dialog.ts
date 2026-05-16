"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import type { LemmaSearchResult } from "../api";
import { useBatchAnnotate } from "./use-batch-annotate";
import { useLemmaSearch } from "./use-lemma-search";
import { useTokenOccurrences } from "./use-token-occurrences";

interface UseAnnotateWordFormDialogProps {
	initialWordForm: string;
	textId?: string;
	initialSelectedTokenId?: string;
	onOpenChange: (open: boolean) => void;
}

export const useAnnotateWordFormDialog = ({
	initialWordForm,
	textId,
	initialSelectedTokenId,
	onOpenChange,
}: UseAnnotateWordFormDialogProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();

	const [formTranslation, setFormTranslation] = useState("");
	const [query, setQuery] = useState("");
	const [selectedLemma, setSelectedLemma] = useState<LemmaSearchResult | null>(null);
	const [deselected, setDeselected] = useState<Set<string>>(new Set());

	const normalized = initialWordForm.trim().toLowerCase();

	const { data: results = [], isLoading: isSearching } = useLemmaSearch(query);
	const { data: occurrences = [], isLoading: isLoadingOccurrences } =
		useTokenOccurrences(normalized, textId);
	const { mutate: batchAnnotate, isPending } = useBatchAnnotate(textId);

	// When opened for a specific token, pre-deselect all others
	useEffect(() => {
		if (!initialSelectedTokenId || occurrences.length === 0) return;
		setDeselected(new Set(occurrences.filter(o => o.tokenId !== initialSelectedTokenId).map(o => o.tokenId)));
	}, [initialSelectedTokenId, occurrences]);

	const selectedIds = occurrences.filter(o => !deselected.has(o.tokenId)).map(o => o.tokenId);
	const selectedCount = selectedIds.length;
	const allChecked = occurrences.length > 0 && selectedCount === occurrences.length;
	const someChecked = selectedCount > 0 && selectedCount < occurrences.length;
	const canSave = normalized.length >= 1 && selectedLemma !== null && selectedCount > 0 && !isPending;

	const resetState = () => {
		setFormTranslation("");
		setQuery("");
		setSelectedLemma(null);
		setDeselected(new Set());
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) resetState();
		onOpenChange(nextOpen);
	};

	const handleClose = () => handleOpenChange(false);

	const handleFormTranslationChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormTranslation(e.currentTarget.value);
	};

	const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.currentTarget.value);
		setSelectedLemma(null);
	};

	const handleSelectLemma = (lemma: LemmaSearchResult) => {
		setSelectedLemma(lemma);
	};

	const handleToggleOccurrence = (tokenId: string) => {
		setDeselected(prev => {
			const next = new Set(prev);
			if (next.has(tokenId)) next.delete(tokenId);
			else next.add(tokenId);
			return next;
		});
	};

	const handleToggleAll = () => {
		if (allChecked || someChecked) {
			setDeselected(new Set(occurrences.map(o => o.tokenId)));
		} else {
			setDeselected(new Set());
		}
	};

	const handleSave = () => {
		if (!normalized || !selectedLemma || selectedCount === 0) return;
		const translation = formTranslation.trim() || undefined;
		batchAnnotate(
			{ tokenIds: selectedIds, normalized, lemmaId: selectedLemma.id, translation },
			{
				onSuccess: data => {
					success(
						t("admin.texts.editPage.wordAnnotation.successBatch", {
							count: String(data.updatedTokens),
							lemma: data.lemmaBaseForm,
						}),
					);
					resetState();
					onOpenChange(false);
				},
				onError: () => error(t("admin.texts.editPage.wordAnnotation.error")),
			},
		);
	};

	return {
		wordForm: initialWordForm,
		formTranslation,
		query,
		selectedLemma,
		deselected,
		results,
		isSearching,
		occurrences,
		isLoadingOccurrences,
		isPending,
		selectedCount,
		allChecked,
		someChecked,
		canSave,
		handleOpenChange,
		handleClose,
		handleFormTranslationChange,
		handleQueryChange,
		handleSelectLemma,
		handleToggleOccurrence,
		handleToggleAll,
		handleSave,
	};
};
