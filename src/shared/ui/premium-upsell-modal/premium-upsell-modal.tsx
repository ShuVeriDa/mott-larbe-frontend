"use client";

import { Typography } from "@/shared/ui/typography";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";

export interface PremiumUpsellModalProps {
	open: boolean;
	onClose: () => void;
}

export const PremiumUpsellModal = ({
	open,
	onClose,
}: PremiumUpsellModalProps) => {
	const { t, lang } = useI18n();

		const handleClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = () => {
						window.location.href = `/${lang}/plans`;
					};
return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.foldersPage.upsell.title")}
		>
			<Typography tag="p" className="mb-5 text-[13.5px] leading-relaxed text-t-2">
				{t("vocabulary.foldersPage.upsell.description")}
			</Typography>
			<ModalActions>
				<Button
					onClick={onClose}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("vocabulary.foldersPage.upsell.close")}
				</Button>
				<Button
					onClick={handleClick}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
				>
					{t("vocabulary.foldersPage.upsell.upgrade")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
