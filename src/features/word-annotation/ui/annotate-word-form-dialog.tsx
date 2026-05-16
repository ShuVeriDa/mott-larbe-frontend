"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { useAnnotateWordFormDialog } from "../model/use-annotate-word-form-dialog";
import { LemmaSearchSection } from "./lemma-search-section";
import { OccurrencesSection } from "./occurrences-section";
import { WordFormRow } from "./word-form-row";

interface AnnotateWordFormDialogProps {
	wordForm: string;
	textId?: string;
	initialSelectedTokenId?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const AnnotateWordFormDialog = ({
	wordForm,
	textId,
	initialSelectedTokenId,
	open,
	onOpenChange,
}: AnnotateWordFormDialogProps) => {
	const { t } = useI18n();
	const {
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
		handleFormTranslationChange,
		handleQueryChange,
		handleSelectLemma,
		handleToggleOccurrence,
		handleToggleAll,
		handleSave,
	} = useAnnotateWordFormDialog({ initialWordForm: wordForm, textId, initialSelectedTokenId, onOpenChange });

	const handleCancel = () => handleOpenChange(false);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent aria-describedby={undefined} className="max-w-lg gap-0 p-0">
				<DialogHeader className="px-5 pt-5 pb-4">
					<DialogTitle>
						{t("admin.texts.editPage.wordAnnotation.dialogTitle")}
					</DialogTitle>
				</DialogHeader>

				<WordFormRow
					wordForm={wordForm}
					formTranslation={formTranslation}
					onFormTranslationChange={handleFormTranslationChange}
				/>

				<LemmaSearchSection
					query={query}
					isSearching={isSearching}
					results={results}
					selectedLemmaId={selectedLemma?.id ?? null}
					onQueryChange={handleQueryChange}
					onSelectLemma={handleSelectLemma}
				/>

				{textId && wordForm.trim().length >= 1 && (
					<OccurrencesSection
						occurrences={occurrences}
						isLoadingOccurrences={isLoadingOccurrences}
						deselected={deselected}
						allChecked={allChecked}
						someChecked={someChecked}
						onToggleOccurrence={handleToggleOccurrence}
						onToggleAll={handleToggleAll}
					/>
				)}

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
						disabled={!canSave}
						onClick={handleSave}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
					>
						{isPending
							? t("reader.annotate.saving")
							: selectedCount > 0
								? t("admin.texts.editPage.wordAnnotation.saveTokens", {
										count: String(selectedCount),
									})
								: t("admin.texts.editPage.wordAnnotation.save")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
