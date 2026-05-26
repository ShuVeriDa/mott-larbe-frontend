"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface DeleteConfirmModalProps {
	open: boolean;
	title: string;
	description: string;
	itemLabel: string;
	itemSublabel?: string;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const DeleteConfirmModal = ({
	open,
	title,
	description,
	itemLabel,
	itemSublabel,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: DeleteConfirmModalProps) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			title={title}
			className="max-w-[420px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{description}
			</Typography>

			<div className="mb-4 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
				<Typography tag="p" className="font-medium text-[13.5px] text-t-1">
					{itemLabel}
				</Typography>
				{itemSublabel && (
					<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
						{itemSublabel}
					</Typography>
				)}
			</div>

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isDeleting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("adminPhrasebook.cancel")}
				</Button>
				<Button
					variant="bare"
					onClick={onConfirm}
					disabled={isDeleting}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85"
				>
					{isDeleting ? t("adminPhrasebook.deleting") : t("adminPhrasebook.confirmDelete")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
