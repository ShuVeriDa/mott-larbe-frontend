"use client";

import type { LemmaSearchResult } from "@/features/word-annotation";
import { useCreateMorphForm, useLemmaSearch } from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import type { ChangeEvent } from "react";
import { useState } from "react";

export const useWordAnnotationSection = () => {
	const { t } = useI18n();
	const { success, error } = useToast();

	const [wordForm, setWordForm] = useState("");
	const [formTranslation, setFormTranslation] = useState("");
	const [lemmaQuery, setLemmaQuery] = useState("");
	const [selectedLemma, setSelectedLemma] = useState<LemmaSearchResult | null>(
		null,
	);

	const { data: results = [], isLoading: isSearching } =
		useLemmaSearch(lemmaQuery);
	const { mutate: createMorphForm, isPending } = useCreateMorphForm();

	const resetForm = () => {
		setWordForm("");
		setFormTranslation("");
		setLemmaQuery("");
		setSelectedLemma(null);
	};

	const handleWordFormChange = (e: ChangeEvent<HTMLInputElement>) => {
		setWordForm(e.currentTarget.value);
	};

	const handleFormTranslationChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormTranslation(e.currentTarget.value);
	};

	const handleLemmaQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
		setLemmaQuery(e.currentTarget.value);
		setSelectedLemma(null);
	};

	const handleSelectLemma = (lemma: LemmaSearchResult) => {
		setSelectedLemma(lemma);
	};

	const handleSave = () => {
		const normalized = wordForm.trim().toLowerCase();
		if (!normalized || !selectedLemma) return;
		const translation = formTranslation.trim() || undefined;
		createMorphForm(
			{ normalized, lemmaId: selectedLemma.id, translation },
			{
				onSuccess: () => {
					success(
						t("admin.texts.editPage.wordAnnotation.success", {
							word: wordForm.trim(),
						}),
					);
					resetForm();
				},
				onError: () => error(t("admin.texts.editPage.wordAnnotation.error")),
			},
		);
	};

	const canSave =
		wordForm.trim().length >= 1 && selectedLemma !== null && !isPending;

	return {
		wordForm,
		formTranslation,
		lemmaQuery,
		selectedLemma,
		results,
		isSearching,
		isPending,
		canSave,
		handleWordFormChange,
		handleFormTranslationChange,
		handleLemmaQueryChange,
		handleSelectLemma,
		handleSave,
	};
};
