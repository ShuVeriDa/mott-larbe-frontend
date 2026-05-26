"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface AdminTextConfirmModalProps {
	title: string;
	description: string;
	cancelLabel: string;
	confirmLabel: string;
	isConfirming?: boolean;
	closeOnBackdropClick?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const AdminTextConfirmModal = ({
	title,
	description,
	cancelLabel,
	confirmLabel,
	isConfirming = false,
	closeOnBackdropClick = false,
	onConfirm,
	onCancel,
}: AdminTextConfirmModalProps) => {
	const handleClose = () => {
		if (!closeOnBackdropClick || isConfirming) return;
		onCancel();
	};

	return (
		<Modal
			open
			onClose={handleClose}
			title={title}
		>
			<Typography tag="p" className="mb-4 text-sm text-t-3">
				{description}
			</Typography>

			<ModalActions>
				<Button
					onClick={onCancel}
					disabled={isConfirming}
					title={cancelLabel}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{cancelLabel}
				</Button>
				<Button
					onClick={onConfirm}
					disabled={isConfirming}
					title={confirmLabel}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					{confirmLabel}
				</Button>
			</ModalActions>
		</Modal>
	);
};
