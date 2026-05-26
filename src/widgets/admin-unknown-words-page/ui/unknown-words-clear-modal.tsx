"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";
import { Trash2 } from "lucide-react";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface UnknownWordsClearModalProps {
	open: boolean;
	totalPending: number;
	isPending: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const UnknownWordsClearModal = ({
	open,
	totalPending,
	isPending,
	onClose,
	onConfirm,
}: UnknownWordsClearModalProps) => {
	const { t } = useI18n();

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("admin.unknownWords.clearModal.title")}
			className="max-w-[420px]"
		>
			<Typography tag="p" className="mb-1 text-[11.5px] text-t-3">
				{t("admin.unknownWords.clearModal.subtitle")}
			</Typography>
			<Typography tag="p" className="mb-2 text-[13px] leading-[1.65] text-t-2">
				{t("admin.unknownWords.clearModal.body", { count: totalPending })}
			</Typography>

			<ModalActions>
				<Button
					onClick={onClose}
					title={t("admin.unknownWords.clearModal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.unknownWords.clearModal.cancel")}
				</Button>
				<Button
					onClick={onConfirm}
					disabled={isPending}
					title={t("admin.unknownWords.clearModal.confirm")}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					<Trash2 className="size-3" />
					{t("admin.unknownWords.clearModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
