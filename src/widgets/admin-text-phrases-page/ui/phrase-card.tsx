"use client";

import { Typography } from "@/shared/ui/typography";
import type { TextPhraseDetail, TextPhraseListItem, TextPhraseOccurrence } from "@/entities/text-phrase";
import { PhraseCardHeaderView, PhraseCardHeaderEdit } from "./phrase-card-header";
import { PhraseCardOccurrences } from "./phrase-card-occurrences";

const PhraseCardSkeleton = () => (
	<div className="p-4">
		<div className="mb-4 border-b border-bd-1 pb-4">
			<div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-surf-3" />
			<div className="mb-1.5 h-3.5 w-1/2 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-1/3 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="flex flex-col gap-2">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className="h-[52px] animate-pulse rounded-[8px] bg-surf-3" />
			))}
		</div>
	</div>
);

interface PhraseCardProps {
	phrase: TextPhraseDetail | undefined;
	isLoading: boolean;
	editMode: boolean;
	editTranslation: string;
	editNotes: string;
	isSaving: boolean;
	lang: string;
	onStartEdit: () => void;
	onCancelEdit: () => void;
	onSaveEdit: () => void;
	onTranslationChange: (v: string) => void;
	onNotesChange: (v: string) => void;
	onDelete: (item: TextPhraseListItem) => void;
	onDeleteOccurrence: (occ: TextPhraseOccurrence) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhraseCard = ({
	phrase,
	isLoading,
	editMode,
	editTranslation,
	editNotes,
	isSaving,
	lang,
	onStartEdit,
	onCancelEdit,
	onSaveEdit,
	onTranslationChange,
	onNotesChange,
	onDelete,
	onDeleteOccurrence,
	t,
}: PhraseCardProps) => {
	if (isLoading) return <PhraseCardSkeleton />;

	if (!phrase) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
				<div className="flex size-14 items-center justify-center rounded-full bg-surf-2">
					<svg
						className="size-7 text-t-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M3 5h12M3 8h9M3 11h6M13 13l9 9M13 22H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" />
					</svg>
				</div>
				<Typography tag="p" className="text-[13px] text-t-3">
					{t("admin.textPhrases.selectPhrase")}
				</Typography>
			</div>
		);
	}

	return (
		<div className="m-4 flex flex-col rounded-[10px] border border-bd-1 bg-surf shadow-sm">
			{editMode ? (
				<PhraseCardHeaderEdit
					phrase={phrase}
					translation={editTranslation}
					notes={editNotes}
					isSaving={isSaving}
					onTranslationChange={onTranslationChange}
					onNotesChange={onNotesChange}
					onSave={onSaveEdit}
					onCancel={onCancelEdit}
					t={t}
				/>
			) : (
				<PhraseCardHeaderView
					phrase={phrase}
					onStartEdit={onStartEdit}
					onDelete={onDelete}
					t={t}
				/>
			)}
			<PhraseCardOccurrences
				occurrences={phrase.occurrences}
				lang={lang}
				onDeleteOccurrence={onDeleteOccurrence}
				t={t}
			/>
		</div>
	);
};
