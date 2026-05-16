"use client";

import { LemmaResultItem } from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { FieldInput, MetaSection } from "@/shared/ui/admin-text-meta-fields";
import { Button } from "@/shared/ui/button";
import { SearchIcon } from "lucide-react";
import { useWordAnnotationSection } from "../model/use-word-annotation-section";

export const WordAnnotationSection = () => {
	const { t } = useI18n();
	const {
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
	} = useWordAnnotationSection();

	const showResults = lemmaQuery.trim().length >= 2;

	return (
		<MetaSection title={t("admin.texts.editPage.sections.wordAnnotation")}>
			<div className="mb-2">
				<FieldInput
					value={wordForm}
					onChange={handleWordFormChange}
					placeholder={t(
						"admin.texts.editPage.wordAnnotation.wordFormPlaceholder",
					)}
				/>
			</div>

			<div className="mb-2">
				<FieldInput
					value={formTranslation}
					onChange={handleFormTranslationChange}
					placeholder={t(
						"admin.texts.editPage.wordAnnotation.formTranslationPlaceholder",
					)}
				/>
			</div>

			<div className="relative mb-2">
				<SearchIcon className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-t-3" />
				<FieldInput
					value={lemmaQuery}
					onChange={handleLemmaQueryChange}
					placeholder={t(
						"admin.texts.editPage.wordAnnotation.lemmaSearchPlaceholder",
					)}
					style={{ paddingLeft: "26px" }}
				/>
			</div>

			{showResults && (
				<div className="mb-2 max-h-[160px] overflow-y-auto rounded-base border border-hairline border-bd-1">
					{isSearching ? (
						<div className="flex items-center justify-center py-4">
							<div className="size-4 animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
						</div>
					) : results.length > 0 ? (
						<div className="p-1">
							{results.map(lemma => (
								<LemmaResultItem
									key={lemma.id}
									lemma={lemma}
									selected={selectedLemma?.id === lemma.id}
									onSelect={() => handleSelectLemma(lemma)}
								/>
							))}
						</div>
					) : (
						<div className="py-4 text-center text-[11px] text-t-3">
							{t("admin.texts.editPage.wordAnnotation.noResults")}
						</div>
					)}
				</div>
			)}

			<Button
				disabled={!canSave}
				onClick={handleSave}
				className="flex w-full items-center justify-center rounded-base bg-acc px-3 py-[7px] text-[11.5px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
			>
				{isPending
					? t("admin.texts.editPage.wordAnnotation.saving")
					: t("admin.texts.editPage.wordAnnotation.save")}
			</Button>
		</MetaSection>
	);
};
