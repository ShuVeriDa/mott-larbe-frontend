"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import { parseCorrectForm } from "@/entities/spelling-dictionary";
import type { AdminSpellingEntry } from "@/entities/spelling-dictionary";

interface SpellingEntryDeleteDialogProps {
	entry: AdminSpellingEntry | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

const renderCorrectForm = (value: string) =>
	parseCorrectForm(value).map((node, i) =>
		node.superscript ? <sup key={i}>{node.text}</sup> : <span key={i}>{node.text}</span>,
	);

export const SpellingEntryDeleteDialog = ({
	entry,
	isDeleting,
	onConfirm,
	onClose,
}: SpellingEntryDeleteDialogProps) => {
	const { t } = useI18n();

	return (
		<Modal
			open={!!entry}
			onClose={onClose}
			title={t("admin.spellingDictionary.deleteModal.title")}
			className="max-w-[420px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.spellingDictionary.deleteModal.subtitle")}
			</Typography>

			{entry && (
				<div className="mb-4 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<Typography tag="p" className="font-mono text-[13px] font-medium text-t-1">
						<span className="text-red-t line-through">{entry.wrongForm}</span>
						{" → "}
						<span>{renderCorrectForm(entry.correctForm)}</span>
					</Typography>
					{entry.comment && (
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
							{entry.comment}
						</Typography>
					)}
				</div>
			)}

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isDeleting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.spellingDictionary.deleteModal.cancel")}
				</Button>
				<Button
					variant="bare"
					onClick={onConfirm}
					disabled={isDeleting}
					className="h-[34px] flex-1 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85"
				>
					{isDeleting
						? t("admin.spellingDictionary.deleteModal.deleting")
						: t("admin.spellingDictionary.deleteModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
