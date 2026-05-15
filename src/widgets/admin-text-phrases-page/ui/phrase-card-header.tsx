"use client";

import { ComponentProps } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseDetail, TextPhraseListItem } from "@/entities/text-phrase";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

interface PhraseCardHeaderViewProps {
	phrase: TextPhraseDetail;
	onStartEdit: () => void;
	onDelete: (item: TextPhraseListItem) => void;
	t: (key: string) => string;
}

export const PhraseCardHeaderView = ({
	phrase,
	onStartEdit,
	onDelete,
	t,
}: PhraseCardHeaderViewProps) => {
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDelete({
			id: phrase.id,
			original: phrase.original,
			normalized: phrase.normalized,
			translation: phrase.translation,
			language: phrase.language,
			notes: phrase.notes,
			createdAt: phrase.createdAt,
			updatedAt: phrase.updatedAt,
			_count: { occurrences: phrase.occurrences.length },
		});

	return (
		<div className="border-b border-bd-1 p-4">
			<div className="mb-1 flex items-start gap-2">
				<Typography tag="h2" className="flex-1 font-display text-[18px] font-semibold text-t-1 leading-snug">
					{phrase.original}
				</Typography>
				<Badge variant="acc" className="mt-0.5 shrink-0">
					{phrase.language}
				</Badge>
				<Button
					variant="ghost"
					size="default"
					onClick={onStartEdit}
					className="shrink-0"
					title={t("admin.textPhrases.edit")}
				>
					<Pencil className="size-3" />
					{t("admin.textPhrases.edit")}
				</Button>
				<Button
					variant="bare"
					size="bare"
					onClick={handleDelete}
					className="flex size-[30px] shrink-0 items-center justify-center rounded-base border border-bd-2 text-t-3 transition-colors hover:border-red/30 hover:bg-red-bg hover:text-red-t"
					title={t("admin.textPhrases.delete")}
				>
					<Trash2 className="size-[13px]" />
				</Button>
			</div>
			<Typography tag="p" className="text-[14px] text-t-2">
				{phrase.translation}
			</Typography>
			{phrase.notes && (
				<Typography tag="p" className="mt-1 text-[12px] italic text-t-3">
					{phrase.notes}
				</Typography>
			)}
			<Typography tag="p" className="mt-2 text-[11px] text-t-4">
				{t("admin.textPhrases.addedAt").replace("{date}", formatDate(phrase.createdAt))}
			</Typography>
		</div>
	);
};

interface PhraseCardHeaderEditProps {
	phrase: TextPhraseDetail;
	translation: string;
	notes: string;
	isSaving: boolean;
	onTranslationChange: (v: string) => void;
	onNotesChange: (v: string) => void;
	onSave: () => void;
	onCancel: () => void;
	t: (key: string) => string;
}

export const PhraseCardHeaderEdit = ({
	phrase,
	translation,
	notes,
	isSaving,
	onTranslationChange,
	onNotesChange,
	onSave,
	onCancel,
	t,
}: PhraseCardHeaderEditProps) => {
	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
		onTranslationChange(e.currentTarget.value);
	const handleNotesChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
		onNotesChange(e.currentTarget.value);

	return (
		<div className="border-b border-bd-1 p-4">
			<div className="mb-3 flex items-center gap-2">
				<Badge variant="acc" className="shrink-0">{phrase.language}</Badge>
				<Typography tag="p" className="text-[11px] text-t-3">
					{t("admin.textPhrases.editingMode")}
				</Typography>
			</div>

			<div className="mb-3">
				<InputLabel>{t("admin.textPhrases.originalLabel")}</InputLabel>
				<div className="relative">
					<Input
						value={phrase.original}
						disabled
						className="bg-surf-3 cursor-not-allowed pr-24"
					/>
					<Typography
						tag="span"
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10.5px] text-t-4"
					>
						{t("admin.textPhrases.originalReadonly")}
					</Typography>
				</div>
			</div>

			<div className="mb-3">
				<InputLabel>{t("admin.textPhrases.translationLabel")} *</InputLabel>
				<Input
					value={translation}
					onChange={handleTranslationChange}
					autoFocus
				/>
			</div>

			<div className="mb-4">
				<InputLabel>{t("admin.textPhrases.notesLabel")}</InputLabel>
				<Input
					value={notes}
					onChange={handleNotesChange}
					placeholder={t("admin.textPhrases.notesPlaceholder")}
				/>
			</div>

			<div className="flex gap-2">
				<Button
					variant="action"
					size="default"
					onClick={onSave}
					disabled={isSaving || !translation.trim()}
				>
					{isSaving ? t("admin.textPhrases.saving") : t("admin.textPhrases.save")}
				</Button>
				<Button variant="ghost" size="default" onClick={onCancel} disabled={isSaving}>
					{t("admin.textPhrases.cancel")}
				</Button>
			</div>
		</div>
	);
};
