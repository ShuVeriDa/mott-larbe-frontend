"use client";

import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Pencil } from "lucide-react";
import { useTextSuggest } from "../model/use-text-suggest";

export interface TextSuggestModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	textId: string;
	textTitle: string;
}

export const TextSuggestModal = ({
	open,
	onOpenChange,
	onSuccess,
	textId,
	textTitle,
}: TextSuggestModalProps) => {
	const {
		t,
		field,
		newValue,
		comment,
		isPending,
		fieldOrder,
		handleFieldChange,
		handleNewValueChange,
		handleCommentChange,
		handleSubmit,
		handleClose,
	} = useTextSuggest({ open, onOpenChange, onSuccess, textId, textTitle });

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={
				<span className="flex items-center gap-2">
					<Pencil className="size-4 text-acc" strokeWidth={1.6} />
					{t("suggestText.title")}
				</span>
			}
		>
			<form onSubmit={handleSubmit} className="space-y-3">
				<div>
					<InputLabel>{t("suggestText.textLabel")}</InputLabel>
					<div className="rounded-base border-[0.5px] border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 opacity-70 select-none truncate">
						{textTitle}
					</div>
				</div>

				<div>
					<InputLabel htmlFor="text-suggest-field">
						{t("suggestText.fieldLabel")}
					</InputLabel>
					<Select
						id="text-suggest-field"
						value={field}
						onChange={handleFieldChange}
						disabled={isPending}
					>
						{fieldOrder.map((key) => (
							<option key={key} value={key}>
								{t(`suggestText.fields.${key}`)}
							</option>
						))}
					</Select>
				</div>

				<div>
					<InputLabel htmlFor="text-suggest-value">
						{t("suggestText.newValueLabel")}
					</InputLabel>
					<Textarea
						id="text-suggest-value"
						value={newValue}
						onChange={handleNewValueChange}
						placeholder={t("suggestText.newValuePlaceholder")}
						disabled={isPending}
						required
						rows={3}
					/>
				</div>

				<div>
					<InputLabel htmlFor="text-suggest-comment">
						{t("suggestText.commentLabel")}
					</InputLabel>
					<Input
						id="text-suggest-comment"
						value={comment}
						onChange={handleCommentChange}
						placeholder={t("suggestText.commentPlaceholder")}
						disabled={isPending}
					/>
				</div>

				<ModalActions>
					<Button
						type="button"
						onClick={handleClose}
						disabled={isPending}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("suggestText.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending || !newValue.trim()}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{isPending ? t("suggestText.submitting") : t("suggestText.submit")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
