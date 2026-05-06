"use client";

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

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.foldersPage.upsell.title")}
		>
			<p className="mb-5 text-[13.5px] leading-relaxed text-t-2">
				{t("vocabulary.foldersPage.upsell.description")}
			</p>
			<ModalActions>
				<Button
					variant="ghost"
					size="lg"
					className="flex-1"
					onClick={onClose}
				>
					{t("vocabulary.foldersPage.upsell.close")}
				</Button>
				<Button
					variant="action"
					size="lg"
					className="flex-1"
					onClick={() => {
						window.location.href = `/${lang}/plans`;
					}}
				>
					{t("vocabulary.foldersPage.upsell.upgrade")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
