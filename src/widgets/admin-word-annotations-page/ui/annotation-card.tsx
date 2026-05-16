"use client";

import type { MorphFormListItem } from "@/features/word-annotation";
import {
	LemmaSearchSection,
	OccurrencesSection,
} from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { Link2, Trash2 } from "lucide-react";
import { useAnnotationCard } from "../model/use-annotation-card";

interface AnnotationCardProps {
	morphFormId: string | null;
	onDeleted: () => void;
	onRequestDelete: (item: MorphFormListItem) => void;
}

const AnnotationCardSkeleton = () => (
	<div className="m-4 rounded-[10px] border border-bd-1 bg-surf p-4 shadow-sm">
		<div className="mb-3 h-5 w-2/3 animate-pulse rounded bg-surf-3" />
		<div className="mb-1.5 h-3.5 w-1/2 animate-pulse rounded bg-surf-3" />
		<div className="h-3 w-1/3 animate-pulse rounded bg-surf-3" />
	</div>
);

export const AnnotationCard = ({
	morphFormId,
	onDeleted,
	onRequestDelete,
}: AnnotationCardProps) => {
	const { t } = useI18n();
	const {
		form,
		isLoadingDetail,
		translation,
		lemmaQuery,
		selectedLemma,
		deselected,
		results,
		isSearching,
		occurrences,
		isLoadingOccurrences,
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
	} = useAnnotationCard({ morphFormId, onDeleted, onRequestDelete });

	if (isLoadingDetail) return <AnnotationCardSkeleton />;

	if (!form) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
				<div className="flex size-14 items-center justify-center rounded-full bg-surf-2">
					<Link2 className="size-7 text-t-4" strokeWidth={1.5} />
				</div>
				<Typography tag="p" className="text-[13px] text-t-3">
					{t("admin.wordAnnotations.selectForm")}
				</Typography>
			</div>
		);
	}

	return (
		<div className="m-4 flex flex-col rounded-[10px] border border-bd-1 bg-surf shadow-sm">
			<div className="flex items-start justify-between gap-3 border-b border-bd-1 px-4 pt-4 pb-3">
				<div>
					<Typography
						tag="h2"
						className="font-display text-[18px] font-semibold text-t-1"
					>
						{form.normalized}
					</Typography>
					<div className="mt-1 flex items-center gap-2">
						<Typography tag="span" className="text-[12px] text-t-3">
							→ {form.lemma.baseForm}
						</Typography>
						{form.lemma.partOfSpeech && (
							<>
								<span className="text-bd-3">·</span>
								<Typography
									tag="span"
									className="text-[11px] uppercase tracking-wide text-t-4"
								>
									{form.lemma.partOfSpeech}
								</Typography>
							</>
						)}
					</div>
					<Typography tag="p" className="mt-1 text-[11.5px] text-t-3">
						{t("admin.wordAnnotations.tokenCountLabel")}:{" "}
						<strong className="text-t-2">{form.tokenCount}</strong>
					</Typography>
				</div>
				<Button
					variant="bare"
					size="bare"
					onClick={handleDelete}
					className="flex h-7 shrink-0 items-center justify-center rounded-[6px] border border-bd-2 px-2 text-t-3 transition-colors hover:border-red/30 hover:bg-red/5 hover:text-red"
				>
					<Trash2 className="size-3.5" />
				</Button>
			</div>

			<div className="border-b border-bd-1 px-4 py-3">
				<InputLabel htmlFor="card-annotation-translation">
					{t("admin.wordAnnotations.translationLabel")}
				</InputLabel>
				<Input
					id="card-annotation-translation"
					value={translation}
					onChange={handleTranslationChange}
					placeholder={t("admin.wordAnnotations.translationPlaceholder")}
				/>
			</div>

			<div className="border-b border-bd-1">
				<div className="px-4 pt-3 pb-1">
					<InputLabel>{t("admin.wordAnnotations.lemmaLabel")}</InputLabel>
				</div>
				<LemmaSearchSection
					query={lemmaQuery}
					isSearching={isSearching}
					results={results}
					selectedLemmaId={selectedLemma?.id ?? null}
					onQueryChange={handleLemmaQueryChange}
					onSelectLemma={handleSelectLemma}
					autoFocus={false}
				/>
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

			<div className="flex gap-2 border-t border-bd-1 px-4 py-3">
				<Button
					size="bare"
					disabled={!canSave || selectedCount === 0}
					onClick={handleSave}
					className="flex px-6 h-[36px] items-center justify-center rounded-base bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
				>
					{saveLabel}
				</Button>
			</div>
		</div>
	);
};
