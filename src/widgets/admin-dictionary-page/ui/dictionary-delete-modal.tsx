"use client";

import type { AdminDictListItem } from "@/entities/dictionary";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface DictionaryDeleteModalProps {
	entry: AdminDictListItem | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const DictionaryDeleteModal = ({
	entry,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: DictionaryDeleteModalProps) => {
	return (
		<Modal
			open={!!entry}
			onClose={onClose}
			title={t("admin.dictionary.deleteModal.title")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.dictionary.deleteModal.subtitle")}
			</Typography>

			{entry && (
				<div className="mb-4 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<Typography tag="p" className="font-display text-[15px] font-medium text-t-1">
						{entry.baseForm}
					</Typography>
					{entry.translation && (
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">{entry.translation}</Typography>
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
					{t("admin.dictionary.deleteModal.cancel")}
				</Button>
				<Button
					variant="bare"
					onClick={onConfirm}
					disabled={isDeleting}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85"
				>
					{isDeleting
						? t("admin.dictionary.deleteModal.deleting")
						: t("admin.dictionary.deleteModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
