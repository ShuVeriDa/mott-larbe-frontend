"use client";

import { ComponentProps } from "react";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { InputLabel } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import type { MorphFormDetail, MorphFormListItem } from "@/features/word-annotation";

const AnnotationCardSkeleton = () => (
	<div className="p-4">
		<div className="mb-4 border-b border-bd-1 pb-4">
			<div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-surf-3" />
			<div className="mb-1.5 h-3.5 w-1/2 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-1/3 animate-pulse rounded bg-surf-3" />
		</div>
	</div>
);

interface AnnotationCardProps {
	form: MorphFormDetail | undefined;
	isLoading: boolean;
	editMode: boolean;
	editTranslation: string;
	isSaving: boolean;
	onStartEdit: () => void;
	onCancelEdit: () => void;
	onSaveEdit: () => void;
	onTranslationChange: (v: string) => void;
	onDelete: (item: MorphFormListItem) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const AnnotationCard = ({
	form,
	isLoading,
	editMode,
	editTranslation,
	isSaving,
	onStartEdit,
	onCancelEdit,
	onSaveEdit,
	onTranslationChange,
	onDelete,
	t,
}: AnnotationCardProps) => {
	if (isLoading) return <AnnotationCardSkeleton />;

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

	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		onTranslationChange(e.currentTarget.value);
	const handleKeyDown: NonNullable<ComponentProps<"input">["onKeyDown"]> = e => {
		if (e.key === "Enter") onSaveEdit();
		if (e.key === "Escape") onCancelEdit();
	};
	const handleDelete = () => onDelete(form);

	return (
		<div className="m-4 flex flex-col rounded-[10px] border border-bd-1 bg-surf shadow-sm">
			<div className="border-b border-bd-1 p-4">
				<div className="mb-3 flex items-start justify-between gap-3">
					<div>
						<Typography tag="h2" className="font-display text-[18px] font-semibold text-t-1">
							{form.normalized}
						</Typography>
						<div className="mt-1 flex items-center gap-2">
							<Typography tag="span" className="text-[12px] text-t-3">
								→ {form.lemma.baseForm}
							</Typography>
							{form.lemma.partOfSpeech && (
								<>
									<span className="text-bd-3">·</span>
									<Typography tag="span" className="text-[11px] text-t-4 uppercase tracking-wide">
										{form.lemma.partOfSpeech}
									</Typography>
								</>
							)}
						</div>
					</div>
					{!editMode && (
						<div className="flex shrink-0 items-center gap-1">
							<Button
								variant="bare"
								size="bare"
								onClick={onStartEdit}
								className="flex h-7 items-center gap-1 rounded-[6px] border border-bd-2 px-2.5 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
							>
								<Pencil className="size-3" />
								{t("admin.wordAnnotations.edit")}
							</Button>
							<Button
								variant="bare"
								size="bare"
								onClick={handleDelete}
								className="flex h-7 items-center justify-center rounded-[6px] border border-bd-2 px-2 text-t-3 transition-colors hover:border-red/30 hover:bg-red/5 hover:text-red"
							>
								<Trash2 className="size-3.5" />
							</Button>
						</div>
					)}
				</div>

				<div className="flex items-center gap-4 text-[12px] text-t-3">
					<span>
						{t("admin.wordAnnotations.tokenCountLabel")}: <strong className="text-t-2">{form.tokenCount}</strong>
					</span>
				</div>
			</div>

			<div className="p-4">
				{editMode ? (
					<div className="flex flex-col gap-3">
						<div>
							<InputLabel htmlFor="annotation-translation">
								{t("admin.wordAnnotations.translationLabel")}
							</InputLabel>
							<Input
								id="annotation-translation"
								value={editTranslation}
								onChange={handleTranslationChange}
								onKeyDown={handleKeyDown}
								placeholder={t("admin.wordAnnotations.translationPlaceholder")}
								autoFocus
							/>
						</div>
						<div className="flex gap-2">
							<Button
								onClick={onSaveEdit}
								disabled={isSaving}
								className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
							>
								{isSaving ? t("admin.wordAnnotations.saving") : t("admin.wordAnnotations.save")}
							</Button>
							<Button
								onClick={onCancelEdit}
								className="h-[34px] rounded-lg border-hairline border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
							>
								{t("admin.wordAnnotations.cancel")}
							</Button>
						</div>
					</div>
				) : (
					<div>
						<Typography tag="p" className="mb-1 text-[11.5px] font-medium uppercase tracking-wide text-t-3">
							{t("admin.wordAnnotations.translationLabel")}
						</Typography>
						<Typography tag="p" className="text-[13px] text-t-2">
							{form.translation ?? "—"}
						</Typography>
					</div>
				)}
			</div>
		</div>
	);
};
