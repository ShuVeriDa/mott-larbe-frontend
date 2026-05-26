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
					className="h-[34px] rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("vocabulary.foldersPage.upsell.close")}
				</Button>
				<Button
					onClick={handleClick}
					className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{t("vocabulary.foldersPage.upsell.upgrade")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
