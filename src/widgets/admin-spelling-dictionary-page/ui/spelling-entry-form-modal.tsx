"use client";

import { useRef, type ComponentProps } from "react";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { CorrectFormEditor } from "@/shared/ui/correct-form-editor";
import type { AdminSpellingEntry, CreateSpellingEntryPayload, CorrectFormNode } from "@/entities/spelling-dictionary";
import { parseCorrectForm, serializeCorrectForm } from "@/entities/spelling-dictionary";

interface SpellingEntryFormModalProps {
	open: boolean;
	editEntry: AdminSpellingEntry | null;
	isSubmitting: boolean;
	onSubmit: (payload: CreateSpellingEntryPayload) => void;
	onClose: () => void;
}

interface SpellingEntryFormProps {
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

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={editEntry
				? t("admin.spellingDictionary.modal.editTitle")
				: t("admin.spellingDictionary.modal.createTitle")}
			className="max-w-[420px]"
		>
			{open && (
				<SpellingEntryForm
					key={editEntry?.id ?? "new"}
					editEntry={editEntry}
					isSubmitting={isSubmitting}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			)}
		</Modal>
	);
};

const SpellingEntryForm = ({
	editEntry,
	isSubmitting,
	onSubmit,
	onClose,
}: SpellingEntryFormProps) => {
	const { t } = useI18n();
	const [wrongForm, setWrongForm] = useState(editEntry?.wrongForm ?? "");
	const [correctFormNodes, setCorrectFormNodes] = useState<CorrectFormNode[]>(
		() => parseCorrectForm(editEntry?.correctForm ?? ""),
	);
	const [comment, setComment] = useState(editEntry?.comment ?? "");
	const wrongFormRef = useRef<HTMLInputElement>(null);

	const handleWrongFormChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setWrongForm(e.currentTarget.value);

	const handleCommentChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setComment(e.currentTarget.value);

	const handleSubmit: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		const correctFormStr = serializeCorrectForm(correctFormNodes);
		if (!wrongForm.trim() || !correctFormStr.trim()) return;
		onSubmit({
			wrongForm: wrongForm.trim(),
			correctForm: correctFormStr,
			comment: comment.trim() || undefined,
		});
	};

	const correctFormText = correctFormNodes.map(n => n.text).join("").trim();

	return (
		<>
			<div className="space-y-3.5">
				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.spellingDictionary.modal.wrongFormLabel")} <span className="text-red-t">*</span>
					</Typography>
					<Input
						ref={wrongFormRef}
						value={wrongForm}
						onChange={handleWrongFormChange}
						placeholder={t("admin.spellingDictionary.modal.wrongFormPlaceholder")}
						autoFocus
						disabled={isSubmitting}
					/>
					<Typography tag="p" className="mt-1 text-[11px] text-t-3">
						{t("admin.spellingDictionary.modal.wrongFormHint")}
					</Typography>
				</div>

				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.spellingDictionary.modal.correctFormLabel")} <span className="text-red-t">*</span>
					</Typography>
					<CorrectFormEditor
						value={correctFormNodes}
						onChange={setCorrectFormNodes}
						placeholder={t("admin.spellingDictionary.modal.correctFormPlaceholder")}
						disabled={isSubmitting}
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
						disabled={isSubmitting}
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
					disabled={isSubmitting || !wrongForm.trim() || !correctFormText}
					className="h-[34px] flex-1 rounded-lg text-[13px]"
				>
					{isSubmitting
						? t("admin.spellingDictionary.modal.saving")
						: t("admin.spellingDictionary.modal.save")}
				</Button>
			</ModalActions>
		</>
	);
};
