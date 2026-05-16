"use client";

import {
	annotationApi,
	annotationKeys,
	useBatchAnnotate,
	useLemmaSearch,
	useMorphFormOccurrences,
	useUnannotateTokens,
} from "@/features/word-annotation";
import type { LemmaSearchResult, MorphFormDetail, MorphFormListItem, PatchMorphFormDto } from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

interface UseAnnotationCardProps {
	morphFormId: string | null;
	onDeleted: () => void;
	onRequestDelete: (item: MorphFormListItem) => void;
}

export const useAnnotationCard = ({ morphFormId, onDeleted, onRequestDelete }: UseAnnotationCardProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const qc = useQueryClient();

	const [translation, setTranslation] = useState("");
	const [lemmaQuery, setLemmaQuery] = useState("");
	const [selectedLemma, setSelectedLemma] = useState<LemmaSearchResult | null>(null);
	const [deselected, setDeselected] = useState<Set<string>>(new Set());

	const detailQuery = useQuery({
		queryKey: annotationKeys.morphForms.detail(morphFormId ?? ""),
		queryFn: () => annotationApi.getMorphForm(morphFormId!),
		enabled: Boolean(morphFormId),
		staleTime: 15_000,
	});

	const form = detailQuery.data;

	const { data: results = [], isLoading: isSearching } = useLemmaSearch(lemmaQuery);
	const { data: occurrences = [], isLoading: isLoadingOccurrences } = useMorphFormOccurrences(morphFormId ?? undefined);

	const { mutate: batchAnnotate, isPending: isBatchAnnotating } = useBatchAnnotate();
	const { mutate: unannotateTokens, isPending: isUnannotating } = useUnannotateTokens();

	const updateMutation = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: PatchMorphFormDto }) =>
			annotationApi.updateMorphForm(id, dto),
		onSuccess: () => {
			invalidateAll();
			success(t("admin.wordAnnotations.toast.updated"));
		},
		onError: () => toastError(t("admin.wordAnnotations.toast.error")),
	});

	const invalidateAll = () => {
		void qc.invalidateQueries({ queryKey: annotationKeys.morphForms.all });
	};

	// Reset state when selected form changes
	useEffect(() => {
		if (!form) return;
		setTranslation(form.translation ?? "");
		setLemmaQuery(form.lemma.baseForm);
		setSelectedLemma({
			id: form.lemma.id,
			baseForm: form.lemma.baseForm,
			normalized: form.lemma.normalized,
			partOfSpeech: form.lemma.partOfSpeech,
			translation: form.translation,
		});
		setDeselected(new Set());
	}, [form?.id]);

	const lemmaChanged = selectedLemma ? selectedLemma.id !== form?.lemma.id : false;
	const selectedIds = occurrences.filter(o => !deselected.has(o.tokenId)).map(o => o.tokenId);
	const selectedCount = selectedIds.length;
	const allChecked = occurrences.length > 0 && selectedCount === occurrences.length;
	const someChecked = selectedCount > 0 && selectedCount < occurrences.length;
	const isPending = isBatchAnnotating || isUnannotating || updateMutation.isPending;
	const canSave = selectedCount > 0 && !isPending;

	const handleTranslationChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTranslation(e.currentTarget.value);
	};

	const handleLemmaQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
		setLemmaQuery(e.currentTarget.value);
	};

	const handleSelectLemma = (lemma: LemmaSearchResult) => {
		setSelectedLemma(lemma);
		setLemmaQuery(lemma.baseForm);
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

	const handleDelete = () => {
		if (!form) return;
		onRequestDelete(form);
	};

	const handleSave = () => {
		if (!form || !selectedLemma) return;
		const trimmedTranslation = translation.trim() || undefined;
		const onErr = () => toastError(t("admin.wordAnnotations.toast.error"));

		if (lemmaChanged) {
			// Lemma changed: unannotate all current tokens → re-annotate selected with new lemma
			const allTokenIds = occurrences.map(o => o.tokenId);
			unannotateTokens(
				{ tokenIds: allTokenIds },
				{
					onSuccess: () =>
						batchAnnotate(
							{
								tokenIds: selectedIds,
								normalized: form.normalized,
								lemmaId: selectedLemma.id,
								translation: trimmedTranslation,
							},
							{
								onSuccess: () => {
									success(t("admin.wordAnnotations.toast.updated"));
									invalidateAll();
									onDeleted();
								},
								onError: onErr,
							},
						),
					onError: onErr,
				},
			);
		} else {
			const deselectedIds = occurrences.filter(o => deselected.has(o.tokenId)).map(o => o.tokenId);

			if (deselectedIds.length > 0 && selectedCount === 0) {
				// All deselected → request full delete via modal
				handleDelete();
			} else if (deselectedIds.length > 0) {
				unannotateTokens(
					{ tokenIds: deselectedIds },
					{
						onSuccess: () =>
							updateMutation.mutate({ id: form.id, dto: { translation: trimmedTranslation } }),
						onError: onErr,
					},
				);
			} else {
				updateMutation.mutate(
					{ id: form.id, dto: { translation: trimmedTranslation } },
					{ onError: onErr },
				);
			}
		}
	};

	const saveLabel = isPending
		? "…"
		: lemmaChanged
			? t("admin.wordAnnotations.saveTokens", { count: String(selectedCount) })
			: t("admin.wordAnnotations.save");

	return {
		form,
		isLoadingDetail: detailQuery.isLoading && Boolean(morphFormId),
		translation,
		lemmaQuery,
		selectedLemma,
		deselected,
		results,
		isSearching,
		occurrences,
		isLoadingOccurrences,
		lemmaChanged,
		selectedCount,
		allChecked,
		someChecked,
		isPending,
		canSave,
		saveLabel,
		handleTranslationChange,
		handleLemmaQueryChange,
		handleSelectLemma,
		handleToggleOccurrence,
		handleToggleAll,
		handleDelete,
		handleSave,
	};
};
