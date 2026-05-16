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
import { useEffect, useState } from "react";
import type { AnnotatedFormOnPage } from "../api/types";
import { useDeleteMorphForm } from "../model/use-annotated-forms-by-page";
import { useTokenOccurrences } from "../model/use-token-occurrences";
import { useUnannotateTokens } from "../model/use-unannotate-tokens";
import { OccurrencesSection } from "./occurrences-section";

interface BatchDeleteAnnotationDialogProps {
	form: AnnotatedFormOnPage;
	textId: string;
	pageNumber: number;
	/** Pre-select this token when occurrences load (e.g. the token the user clicked on) */
	initialTokenId?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const BatchDeleteAnnotationDialog = ({
	form,
	textId,
	pageNumber,
	initialTokenId,
	open,
	onOpenChange,
}: BatchDeleteAnnotationDialogProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const { data: occurrences = [], isLoading: isLoadingOccurrences } =
		useTokenOccurrences(form.normalized, textId);

	const { mutate: deleteMorphForm, isPending: isDeletingAll } = useDeleteMorphForm(textId, pageNumber);
	const { mutate: unannotateTokens, isPending: isUnannotating } = useUnannotateTokens(textId);

	const isPending = isDeletingAll || isUnannotating;

	// Once occurrences load, pre-select annotated tokens.
	// If a specific initialTokenId is provided (user clicked that word), select only it.
	useEffect(() => {
		if (isLoadingOccurrences || occurrences.length === 0) return;

		if (initialTokenId && occurrences.some(o => o.tokenId === initialTokenId)) {
			setSelected(new Set([initialTokenId]));
		} else {
			// Default: check all currently annotated tokens
			setSelected(new Set(occurrences.filter(o => o.isAnnotated).map(o => o.tokenId)));
		}
	}, [isLoadingOccurrences, occurrences, initialTokenId]);

	const selectedIds = occurrences.filter(o => selected.has(o.tokenId)).map(o => o.tokenId);
	const selectedCount = selectedIds.length;
	const allChecked = occurrences.length > 0 && selectedCount === occurrences.length;
	const someChecked = selectedCount > 0 && selectedCount < occurrences.length;
	const deselected = new Set(occurrences.filter(o => !selected.has(o.tokenId)).map(o => o.tokenId));

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) setSelected(new Set());
		onOpenChange(nextOpen);
	};

	const handleToggleOccurrence = (tokenId: string) => {
		setSelected(prev => {
			const next = new Set(prev);
			if (next.has(tokenId)) next.delete(tokenId);
			else next.add(tokenId);
			return next;
		});
	};

	const handleToggleAll = () => {
		if (allChecked || someChecked) {
			setSelected(new Set());
		} else {
			setSelected(new Set(occurrences.map(o => o.tokenId)));
		}
	};

	const handleConfirm = () => {
		if (selectedCount === 0) return;

		if (allChecked && form.hasMorphForm) {
			deleteMorphForm(form.morphFormId, {
				onSuccess: () => {
					success(t("admin.texts.editPage.wordAnnotation.deleteSuccess"));
					handleOpenChange(false);
				},
				onError: () => toastError(t("admin.texts.editPage.wordAnnotation.error")),
			});
		} else {
			unannotateTokens(
				{ tokenIds: selectedIds },
				{
					onSuccess: () => {
						success(
							t("admin.texts.editPage.wordAnnotation.unannotateSuccess", {
								count: String(selectedCount),
							}),
						);
						handleOpenChange(false);
					},
					onError: () => toastError(t("admin.texts.editPage.wordAnnotation.error")),
				},
			);
		}
	};

	const handleCancel = () => handleOpenChange(false);

	const confirmLabel = allChecked
		? t("admin.texts.editPage.wordAnnotation.deleteAll")
		: t("admin.texts.editPage.wordAnnotation.deleteSelected", {
				count: String(selectedCount),
			});

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent aria-describedby={undefined} className="max-w-lg gap-0 p-0">
				<DialogHeader className="px-5 pt-5 pb-4">
					<DialogTitle>
						{t("admin.texts.editPage.wordAnnotation.deleteDialogTitle", {
							word: form.normalized,
						})}
					</DialogTitle>
				</DialogHeader>

				<div className="border-t border-hairline border-bd-1 px-5 py-3">
					<span className="text-[12.5px] text-t-2">
						{t("admin.texts.editPage.wordAnnotation.deleteDialogHint")}
					</span>
				</div>

				<OccurrencesSection
					occurrences={occurrences}
					isLoadingOccurrences={isLoadingOccurrences}
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
						disabled={selectedCount === 0 || isPending}
						onClick={handleConfirm}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base bg-red text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
					>
						{isPending ? "…" : confirmLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
