"use client";

import { useRef, type ChangeEvent, type ComponentProps } from "react";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { CorrectFormEditor } from "@/shared/ui/correct-form-editor";
import type {
	AdminSpellingEntry,
	CreateSpellingEntryPayload,
	CorrectFormNode,
	SpellingMatchType,
} from "@/entities/spelling-dictionary";
import { parseCorrectForm, serializeCorrectForm } from "@/entities/spelling-dictionary";

const MATCH_TYPES: SpellingMatchType[] = ["substring", "whole_word", "prefix", "suffix"];

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
			className="max-w-[480px]"
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
	const [matchType, setMatchType] = useState<SpellingMatchType>(editEntry?.matchType ?? "substring");
	const [correctFormNodes, setCorrectFormNodes] = useState<CorrectFormNode[]>(
		() => parseCorrectForm(editEntry?.correctForm ?? ""),
	);
	const [additionalForms, setAdditionalForms] = useState<CorrectFormNode[][]>(
		() => (editEntry?.correctForms ?? []).map(f => parseCorrectForm(f)),
	);
	const [comment, setComment] = useState(editEntry?.comment ?? "");
	const wrongFormRef = useRef<HTMLInputElement>(null);

	const handleWrongFormChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setWrongForm(e.currentTarget.value);

	const handleMatchTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
		setMatchType(e.currentTarget.value as SpellingMatchType);

	const handleCommentChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setComment(e.currentTarget.value);

	const handleAddForm = () =>
		setAdditionalForms(prev => [...prev, [{ text: "" }]]);

	const handleRemoveForm = (index: number) =>
		setAdditionalForms(prev => prev.filter((_, i) => i !== index));

	const handleAdditionalFormChange = (index: number, nodes: CorrectFormNode[]) =>
		setAdditionalForms(prev => prev.map((f, i) => (i === index ? nodes : f)));

	const handleSubmit: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		const correctFormStr = serializeCorrectForm(correctFormNodes);
		if (!wrongForm.trim() || !correctFormStr.trim()) return;

		const correctForms = additionalForms
			.map(nodes => serializeCorrectForm(nodes))
			.filter(f => f.trim());

		onSubmit({
			wrongForm: wrongForm.trim(),
			correctForm: correctFormStr,
			correctForms: correctForms.length > 0 ? correctForms : undefined,
			matchType,
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
						{t("admin.spellingDictionary.modal.matchTypeLabel")}
					</Typography>
					<Select
						value={matchType}
						onChange={handleMatchTypeChange}
						variant="lg"
						disabled={isSubmitting}
					>
						{MATCH_TYPES.map(type => (
							<option key={type} value={type}>
								{t(`admin.spellingDictionary.modal.matchType.${type}`)}
							</option>
						))}
					</Select>
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

				{(additionalForms.length > 0 || true) && (
					<div className="space-y-2">
						{additionalForms.length > 0 && (
							<Typography tag="label" className="block text-[11.5px] font-semibold text-t-2">
								{t("admin.spellingDictionary.modal.additionalFormsLabel")}
							</Typography>
						)}
						{additionalForms.map((nodes, index) => (
							<div key={index} className="flex items-center gap-2">
								<div className="flex-1">
									<CorrectFormEditor
										value={nodes}
										onChange={updated => handleAdditionalFormChange(index, updated)}
										placeholder={t("admin.spellingDictionary.modal.additionalFormPlaceholder")}
										disabled={isSubmitting}
									/>
								</div>
								<button
									type="button"
									onClick={() => handleRemoveForm(index)}
									disabled={isSubmitting}
									title={t("admin.spellingDictionary.modal.removeForm")}
									className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] text-t-3 transition-colors duration-150 ease-out hover:bg-surf-3 hover:text-red-600 disabled:opacity-40"
								>
									<X className="size-3.5" />
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={handleAddForm}
							disabled={isSubmitting}
							className="flex items-center gap-1.5 text-[12px] text-acc transition-opacity duration-150 ease-out hover:opacity-80 disabled:opacity-40"
						>
							<Plus className="size-3.5" />
							{t("admin.spellingDictionary.modal.addAnotherForm")}
						</button>
					</div>
				)}

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
