"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { InputLabel } from "@/shared/ui/input";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import type { AnnotatedFormOnPage, LemmaSearchResult } from "../api/types";
import { useDeleteMorphForm, useUpdateMorphForm } from "../model/use-annotated-forms-by-page";
import { useBatchAnnotate } from "../model/use-batch-annotate";
import { useLemmaSearch } from "../model/use-lemma-search";
import { useUnannotateTokens } from "../model/use-unannotate-tokens";
import { LemmaSearchSection } from "./lemma-search-section";
import { OccurrencesSection } from "./occurrences-section";

interface EditAnnotationDialogProps {
	form: AnnotatedFormOnPage;
	textId: string;
	pageNumber: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const makeInitialLemma = (form: AnnotatedFormOnPage): LemmaSearchResult => ({
	id: form.lemmaId,
	baseForm: form.lemmaBaseForm,
	normalized: form.lemmaBaseForm.toLowerCase(),
	partOfSpeech: null,
	translation: form.translation,
});

export const EditAnnotationDialog = ({
	form,
	textId,
	pageNumber,
	open,
	onOpenChange,
}: EditAnnotationDialogProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();

	const [translation, setTranslation] = useState(form.translation ?? "");
	const [lemmaQuery, setLemmaQuery] = useState(form.lemmaBaseForm);
	const [selectedLemma, setSelectedLemma] = useState<LemmaSearchResult>(makeInitialLemma(form));
	// deselected = tokenIds the user has unchecked (starts empty = all checked)
	const [deselected, setDeselected] = useState<Set<string>>(new Set());
	// initiallyUnannotated = tokenIds that were NOT annotated when dialog opened (needed to detect newly selected)
	const [initiallyUnannotated, setInitiallyUnannotated] = useState<Set<string>>(new Set());

	const { data: results = [], isLoading: isSearching } = useLemmaSearch(lemmaQuery);

	const { mutate: updateMorphForm, isPending: isUpdating } = useUpdateMorphForm(textId, pageNumber);
	const { mutate: batchAnnotate, isPending: isBatchAnnotating } = useBatchAnnotate(textId);
	const { mutate: deleteMorphForm, isPending: isDeleting } = useDeleteMorphForm(textId, pageNumber);
	const { mutate: unannotateTokens, isPending: isUnannotating } = useUnannotateTokens(textId);

	const isPending = isUpdating || isBatchAnnotating || isDeleting || isUnannotating;
	const lemmaChanged = selectedLemma.id !== form.lemmaId;

	// allOccurrences is the single source of truth — lemma-specific isAnnotated, with before/after context
	const occurrences = form.allOccurrences;
	const selectedIds = occurrences.filter(o => !deselected.has(o.tokenId)).map(o => o.tokenId);
	const selectedCount = selectedIds.length;
	const allChecked = occurrences.length > 0 && selectedCount === occurrences.length;
	const someChecked = selectedCount > 0 && selectedCount < occurrences.length;

	const canSave = selectedCount > 0;

	// Reset state when dialog opens: initialize deselected from form.allOccurrences which has
	// lemma-specific isAnnotated across all pages (only tokens tied to THIS lemma are checked).
	useEffect(() => {
		if (open) {
			setTranslation(form.translation ?? "");
			setLemmaQuery(form.lemmaBaseForm);
			setSelectedLemma(makeInitialLemma(form));
			const unannotated = new Set(form.allOccurrences.filter(o => !o.isAnnotated).map(o => o.tokenId));
			setDeselected(unannotated);
			setInitiallyUnannotated(new Set(unannotated));
		}
	}, [open, form]);

	const handleOpenChange = (nextOpen: boolean) => {
		onOpenChange(nextOpen);
	};

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

	const handleSave = () => {
		const trimmedTranslation = translation.trim() || undefined;
		const onDone = () => {
			success(t("admin.texts.editPage.wordAnnotation.updateSuccess"));
			handleOpenChange(false);
		};
		const onErr = () => toastError(t("admin.texts.editPage.wordAnnotation.error"));

		if (lemmaChanged) {
			// Lemma changed: unannotate all current tokens, then re-annotate selected with new lemma
			const allTokenIds = occurrences.map(o => o.tokenId);
			unannotateTokens(
				{ tokenIds: allTokenIds },
				{
					onSuccess: () => {
						if (form.hasMorphForm) {
							deleteMorphForm(form.morphFormId, {
								onSuccess: () =>
									batchAnnotate(
										{
											tokenIds: selectedIds,
											normalized: form.normalized,
											lemmaId: selectedLemma.id,
											translation: trimmedTranslation,
										},
										{ onSuccess: onDone, onError: onErr },
									),
								onError: onErr,
							});
						} else {
							batchAnnotate(
								{
									tokenIds: selectedIds,
									normalized: form.normalized,
									lemmaId: selectedLemma.id,
									translation: trimmedTranslation,
								},
								{ onSuccess: onDone, onError: onErr },
							);
						}
					},
					onError: onErr,
				},
			);
		} else {
			// Same lemma: handle token selection changes + translation
			const deselectedIds = occurrences
				.filter(o => deselected.has(o.tokenId))
				.map(o => o.tokenId);
			// Tokens that were unannotated on open but are now checked = newly selected
			const newlySelectedIds = occurrences
				.filter(o => initiallyUnannotated.has(o.tokenId) && !deselected.has(o.tokenId))
				.map(o => o.tokenId);

			const doAnnotateNew = (afterDone: () => void) => {
				if (newlySelectedIds.length > 0) {
					batchAnnotate(
						{
							tokenIds: newlySelectedIds,
							normalized: form.normalized,
							lemmaId: selectedLemma.id,
							translation: trimmedTranslation,
						},
						{ onSuccess: afterDone, onError: onErr },
					);
				} else {
					afterDone();
				}
			};

			const doUpdateTranslation = (afterDone: () => void) => {
				if (form.hasMorphForm) {
					updateMorphForm(
						{ id: form.morphFormId, translation: trimmedTranslation },
						{ onSuccess: afterDone, onError: onErr },
					);
				} else {
					afterDone();
				}
			};

			if (deselectedIds.length > 0 && selectedCount === 0) {
				// All tokens deselected = remove all annotations
				if (form.hasMorphForm) {
					deleteMorphForm(form.morphFormId, { onSuccess: onDone, onError: onErr });
				} else {
					unannotateTokens({ tokenIds: deselectedIds }, { onSuccess: onDone, onError: onErr });
				}
			} else if (deselectedIds.length > 0) {
				// Some tokens deselected: unannotate them, then annotate new ones, then update translation
				unannotateTokens(
					{ tokenIds: deselectedIds },
					{
						onSuccess: () => doAnnotateNew(() => doUpdateTranslation(onDone)),
						onError: onErr,
					},
				);
			} else if (newlySelectedIds.length > 0) {
				// Only additions: annotate new tokens, then update translation
				doAnnotateNew(() => doUpdateTranslation(onDone));
			} else {
				// No token changes, just update translation
				doUpdateTranslation(onDone);
			}
		}
	};

	const handleCancel = () => handleOpenChange(false);

	const saveLabel = isPending
		? "…"
		: lemmaChanged
			? t("admin.texts.editPage.wordAnnotation.saveTokens", { count: String(selectedCount) })
			: t("admin.texts.editPage.wordAnnotation.save");

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent aria-describedby={undefined} className="max-w-lg gap-0 p-0">
				<DialogHeader className="px-5 pt-5 pb-4">
					<DialogTitle>{t("admin.texts.editPage.wordAnnotation.editTitle")}</DialogTitle>
				</DialogHeader>

				<div className="space-y-3 border-t border-hairline border-bd-1 px-5 py-4">
					<div>
						<InputLabel>{t("admin.texts.editPage.wordAnnotation.wordFormLabel")}</InputLabel>
						<div className="rounded-base border-hairline border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 select-none">
							{form.normalized}
						</div>
					</div>
					<div>
						<InputLabel htmlFor="edit-annotation-translation">
							{t("admin.texts.editPage.wordAnnotation.formTranslationPlaceholder")}
						</InputLabel>
						<Input
							id="edit-annotation-translation"
							value={translation}
							onChange={handleTranslationChange}
							placeholder={t("admin.texts.editPage.wordAnnotation.formTranslationPlaceholder")}
						/>
					</div>
				</div>

				<div className="border-t border-hairline border-bd-1">
					<div className="px-5 pt-3 pb-1">
						<InputLabel>{t("admin.texts.editPage.wordAnnotation.lemmaLabel")}</InputLabel>
					</div>
					<LemmaSearchSection
						query={lemmaQuery}
						isSearching={isSearching}
						results={results}
						selectedLemmaId={selectedLemma.id}
						onQueryChange={handleLemmaQueryChange}
						onSelectLemma={handleSelectLemma}
						autoFocus={false}
					/>
				</div>

				<OccurrencesSection
					occurrences={occurrences}
					isLoadingOccurrences={false}
					deselected={deselected}
					allChecked={allChecked}
					someChecked={someChecked}
					onToggleOccurrence={handleToggleOccurrence}
					onToggleAll={handleToggleAll}
				/>

				<div className="flex gap-2 border-t border-hairline border-bd-1 px-5 py-4">
					<Button
						size="bare"
						onClick={handleCancel}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base border border-hairline border-bd-2 bg-surf-2 text-[13px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-3"
					>
						{t("reader.annotate.cancel")}
					</Button>
					<Button
						size="bare"
						disabled={!canSave || isPending}
						onClick={handleSave}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
					>
						{saveLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
