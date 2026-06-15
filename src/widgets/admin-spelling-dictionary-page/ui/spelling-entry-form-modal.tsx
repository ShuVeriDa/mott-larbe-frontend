"use client";

import { useEffect, type ComponentProps } from "react";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminSpellingEntry, CreateSpellingEntryPayload } from "@/entities/spelling-dictionary";

interface SpellingEntryFormModalProps {
	open: boolean;
	editEntry: AdminSpellingEntry | null;
	isSubmitting: boolean;
	onSubmit: (payload: CreateSpellingEntryPayload) => void;
	onClose: () => void;
}

export const SpellingEntryFormModal = ({
	open,
	editEntry,
	isSubmitting,
	onSubmit,
	onClose,
}: SpellingEntryFormModalProps) => {
	const { t } = useI18n();
	const [wrongForm, setWrongForm] = useState("");
	const [correctForm, setCorrectForm] = useState("");
	const [comment, setComment] = useState("");

	useEffect(() => {
		if (!open) return;
		setWrongForm(editEntry?.wrongForm ?? "");
		setCorrectForm(editEntry?.correctForm ?? "");
		setComment(editEntry?.comment ?? "");
	}, [open, editEntry]);

	const handleWrongFormChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setWrongForm(e.currentTarget.value);

	const handleCorrectFormChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setCorrectForm(e.currentTarget.value);

	const handleCommentChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setComment(e.currentTarget.value);

	const handleSubmit: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		if (!wrongForm.trim() || !correctForm.trim()) return;
		onSubmit({
			wrongForm: wrongForm.trim(),
			correctForm: correctForm.trim(),
			comment: comment.trim() || undefined,
		});
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={editEntry
				? t("admin.spellingDictionary.modal.editTitle")
				: t("admin.spellingDictionary.modal.createTitle")}
			className="max-w-[420px]"
		>
			<div className="space-y-3.5">
				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.spellingDictionary.modal.wrongFormLabel")} <span className="text-red-t">*</span>
					</Typography>
					<Input
						value={wrongForm}
						onChange={handleWrongFormChange}
						placeholder={t("admin.spellingDictionary.modal.wrongFormPlaceholder")}
						autoFocus
					/>
					<Typography tag="p" className="mt-1 text-[11px] text-t-3">
						{t("admin.spellingDictionary.modal.wrongFormHint")}
					</Typography>
				</div>

				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.spellingDictionary.modal.correctFormLabel")} <span className="text-red-t">*</span>
					</Typography>
					<Input
						value={correctForm}
						onChange={handleCorrectFormChange}
						placeholder={t("admin.spellingDictionary.modal.correctFormPlaceholder")}
					/>
					<Typography tag="p" className="mt-1 text-[11px] text-t-3">
						{t("admin.spellingDictionary.modal.correctFormHint")}
					</Typography>
				</div>

				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.spellingDictionary.modal.commentLabel")}
					</Typography>
					<Input
						value={comment}
						onChange={handleCommentChange}
						placeholder={t("admin.spellingDictionary.modal.commentPlaceholder")}
					/>
				</div>
			</div>

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isSubmitting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.spellingDictionary.modal.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={handleSubmit}
					disabled={isSubmitting || !wrongForm.trim() || !correctForm.trim()}
					className="h-[34px] flex-1 rounded-lg text-[13px]"
				>
					{isSubmitting
						? t("admin.spellingDictionary.modal.saving")
						: t("admin.spellingDictionary.modal.save")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
