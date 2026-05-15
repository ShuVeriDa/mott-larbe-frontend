"use client";

import { ComponentProps } from "react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseOccurrence } from "@/entities/text-phrase";

interface PhraseOccurrenceDeleteModalProps {
	occurrence: TextPhraseOccurrence | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhraseOccurrenceDeleteModal = ({
	occurrence,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: PhraseOccurrenceDeleteModalProps) => {
	if (!occurrence) return null;

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleBackdropClick}
		>
			<div className="w-[400px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.textPhrases.deleteOccurrenceModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.textPhrases.deleteOccurrenceModal.subtitle", {
						title: occurrence.text.title,
					})}
				</Typography>

				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						variant="ghost"
						size="default"
						onClick={onClose}
						disabled={isDeleting}
					>
						{t("admin.textPhrases.deleteOccurrenceModal.cancel")}
					</Button>
					<Button
						variant="bare"
						size="default"
						onClick={onConfirm}
						disabled={isDeleting}
						className="h-[30px] cursor-pointer rounded-base bg-red-500 px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50"
					>
						{isDeleting
							? t("admin.textPhrases.deleteOccurrenceModal.deleting")
							: t("admin.textPhrases.deleteOccurrenceModal.confirm")}
					</Button>
				</div>
			</div>
		</div>
	);
};
