"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import { parseCorrectForm } from "../lib/correct-form";

interface SpellingFixConfirmDialogProps {
	open: boolean;
	selectedCount: number;
	wrongForm: string;
	correctForm: string;
	isFixing: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

const renderCorrectForm = (value: string) =>
	parseCorrectForm(value).map((node, i) =>
		node.superscript ? <sup key={i}>{node.text}</sup> : <span key={i}>{node.text}</span>,
	);

export const SpellingFixConfirmDialog = ({
	open,
	selectedCount,
	wrongForm,
	correctForm,
	isFixing,
	onConfirm,
	onClose,
}: SpellingFixConfirmDialogProps) => {
	const { t } = useI18n();

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("admin.spellingDictionaryDetail.confirmDialog.title")}
			className="max-w-[420px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.spellingDictionaryDetail.confirmDialog.subtitle", { count: selectedCount })}
			</Typography>

			<div className="mb-4 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
				<Typography tag="p" className="font-mono text-[13px] font-medium text-t-1">
					<span className="text-red-t line-through">{wrongForm}</span>
					{" → "}
					<span>{renderCorrectForm(correctForm)}</span>
				</Typography>
			</div>

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isFixing}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.spellingDictionaryDetail.confirmDialog.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={onConfirm}
					disabled={isFixing}
					className="h-[34px] flex-1 rounded-lg text-[13px] font-semibold"
				>
					{isFixing
						? t("admin.spellingDictionaryDetail.confirmDialog.fixing")
						: t("admin.spellingDictionaryDetail.confirmDialog.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
