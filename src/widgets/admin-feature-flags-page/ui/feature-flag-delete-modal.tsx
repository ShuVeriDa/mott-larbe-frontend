"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { FeatureFlagItem } from "@/entities/feature-flag";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface FeatureFlagDeleteModalProps {
	flag: FeatureFlagItem | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const FeatureFlagDeleteModal = ({
	flag,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: FeatureFlagDeleteModalProps) => {
	return (
		<Modal
			open={!!flag}
			onClose={onClose}
			title={t("admin.featureFlags.deleteModal.title")}
			className="max-w-[400px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.featureFlags.deleteModal.subtitle")}
			</Typography>
			{flag && (
				<div className="mb-4 rounded-[8px] border border-bd-1 bg-surf-2 px-3 py-2">
					<Typography tag="span" className="font-mono text-[12px] text-t-1">{flag.key}</Typography>
				</div>
			)}
			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isDeleting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.featureFlags.deleteModal.cancel")}
				</Button>
				<Button
					variant="bare"
					onClick={onConfirm}
					disabled={isDeleting}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85"
				>
					{isDeleting
						? t("admin.featureFlags.deleteModal.deleting")
						: t("admin.featureFlags.deleteModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
