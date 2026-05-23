"use client";

import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Pencil, X } from "lucide-react";
import { createPortal } from "react-dom";
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
		handleSubmit,
		handleClose,
	} = useEntrySuggest({ open, onOpenChange, onSuccess, normalized, rawWord, currentTranslation });

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<>
			<div
				className="fixed inset-0 z-199 bg-black/30 backdrop-blur-[2px]"
				onClick={handleClose}
				aria-hidden="true"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("suggest.title")}
				className="fixed left-1/2 top-1/2 z-200 w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-hairline border-bd-2 bg-surf shadow-xl"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-hairline border-bd-1 px-4 py-3">
					<div className="flex items-center gap-2">
						<Pencil className="size-4 text-acc" strokeWidth={1.6} />
						<span className="text-[13px] font-semibold text-t-1">
							{t("suggest.title")}
						</span>
					</div>
					<Button
						onClick={handleClose}
						title={t("suggest.cancel")}
						className="rounded-md p-1 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<X className="size-4" />
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-3 p-4">
					{/* Word — read-only context */}
					<div>
						<InputLabel>{t("suggest.wordLabel")}</InputLabel>
						<div className="rounded-base border-hairline border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 opacity-70 select-none" lang="ce">
							{rawWord}
						</div>
					</div>

					{/* Field selector */}
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
							{fieldOrder.map((key) => (
								<option key={key} value={key}>
									{t(`suggest.fields.${key}`)}
								</option>
							))}
						</Select>
					</div>

					{/* New value */}
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

					{/* Comment */}
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

					<div className="flex gap-2 pt-1">
						<Button
							type="button"
							onClick={handleClose}
							disabled={isPending}
							className="h-[34px] rounded-lg border-hairline border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
						>
							{t("suggest.cancel")}
						</Button>
						<Button
							type="submit"
							disabled={isPending || !newValue.trim()}
							className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isPending ? t("suggest.submitting") : t("suggest.submit")}
						</Button>
					</div>
				</form>
			</div>
		</>,
		document.body,
	);
};
