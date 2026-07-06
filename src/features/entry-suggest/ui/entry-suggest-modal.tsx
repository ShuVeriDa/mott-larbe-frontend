"use client";

import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Pencil } from "lucide-react";
import { useEntrySuggest } from "../model/use-entry-suggest";

export interface EntrySuggestModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	normalized: string;
	rawWord: string;
	currentTranslation: string;
}

export const EntrySuggestModal = ({
	open,
	onOpenChange,
	onSuccess,
	normalized,
	rawWord,
	currentTranslation,
}: EntrySuggestModalProps) => {
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
		submitAction,
		handleClose,
	} = useEntrySuggest({
		open,
		onOpenChange,
		onSuccess,
		normalized,
		rawWord,
		currentTranslation,
	});

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={
				<span className="flex items-center gap-2">
					<Pencil className="size-4 text-acc" strokeWidth={1.6} />
					{t("suggest.title")}
				</span>
			}
		>
			<form action={submitAction} className="space-y-3">
				<div>
					<InputLabel>{t("suggest.wordLabel")}</InputLabel>
					<div
						className="rounded-base border-[0.5px] border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 opacity-70 select-none"
						lang="ce"
					>
						{rawWord}
					</div>
				</div>

				<div>
					<InputLabel htmlFor="suggest-field">
						{t("suggest.fieldLabel")}
					</InputLabel>
					<Select
						id="suggest-field"
						value={field}
						onChange={handleFieldChange}
						disabled={isPending}
					>
						{fieldOrder.map(key => (
							<option key={key} value={key}>
								{t(`suggest.fields.${key}`)}
							</option>
						))}
					</Select>
				</div>

				<div>
					<InputLabel htmlFor="suggest-value">
						{t("suggest.newValueLabel")}
					</InputLabel>
					<Textarea
						id="suggest-value"
						value={newValue}
						onChange={handleNewValueChange}
						placeholder={t("suggest.newValuePlaceholder")}
						disabled={isPending}
						required
						rows={3}
					/>
				</div>

				<div>
					<InputLabel htmlFor="suggest-comment">
						{t("suggest.commentLabel")}
					</InputLabel>
					<Input
						id="suggest-comment"
						value={comment}
						onChange={handleCommentChange}
						placeholder={t("suggest.commentPlaceholder")}
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
						{t("suggest.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending || !newValue.trim()}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{isPending ? t("suggest.submitting") : t("suggest.submit")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
