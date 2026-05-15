"use client";

import { ComponentProps } from "react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseListItem } from "@/entities/text-phrase";

interface PhraseDeleteModalProps {
	phrase: TextPhraseListItem | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhraseDeleteModal = ({
	phrase,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: PhraseDeleteModalProps) => {
	if (!phrase) return null;

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleBackdropClick}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.textPhrases.deleteModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.textPhrases.deleteModal.subtitle", {
						count: phrase._count.occurrences,
					})}
				</Typography>

				<div className="mb-4 flex items-start gap-2 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<div className="flex-1">
						<Typography tag="p" className="font-display text-[14px] font-semibold text-t-1">
							{phrase.original}
						</Typography>
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
							{phrase.translation}
						</Typography>
					</div>
					<Badge variant="acc" className="shrink-0 mt-0.5">
						{phrase.language}
					</Badge>
				</div>

				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						variant="ghost"
						size="default"
						onClick={onClose}
						disabled={isDeleting}
					>
						{t("admin.textPhrases.deleteModal.cancel")}
					</Button>
					<Button
						variant="bare"
						size="default"
						onClick={onConfirm}
						disabled={isDeleting}
						className="h-[30px] cursor-pointer rounded-base bg-red-500 px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50"
					>
						{isDeleting
							? t("admin.textPhrases.deleteModal.deleting")
							: t("admin.textPhrases.deleteModal.confirm")}
					</Button>
				</div>
			</div>
		</div>
	);
};
