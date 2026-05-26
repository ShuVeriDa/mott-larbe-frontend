"use client";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseListItem } from "@/entities/text-phrase";
import { Modal, ModalActions } from "@/shared/ui/modal";

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
	return (
		<Modal
			open={!!phrase}
			onClose={onClose}
			title={t("admin.textPhrases.deleteModal.title")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.textPhrases.deleteModal.subtitle", {
					count: phrase?._count.occurrences ?? 0,
				})}
			</Typography>

			{phrase && (
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
			)}

			<ModalActions>
				<Button
					onClick={onClose}
					disabled={isDeleting}
					title={t("admin.textPhrases.deleteModal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.textPhrases.deleteModal.cancel")}
				</Button>
				<Button
					onClick={onConfirm}
					disabled={isDeleting}
					title={isDeleting ? t("admin.textPhrases.deleteModal.deleting") : t("admin.textPhrases.deleteModal.confirm")}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					{isDeleting
						? t("admin.textPhrases.deleteModal.deleting")
						: t("admin.textPhrases.deleteModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
