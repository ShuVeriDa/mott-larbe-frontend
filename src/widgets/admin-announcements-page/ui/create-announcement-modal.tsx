"use client";

import { Modal } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import type { CreateAnnouncementPayload } from "@/entities/announcement";
import { CreateAnnouncementForm } from "./create-announcement-form";

interface CreateAnnouncementModalProps {
	open: boolean;
	isSubmitting: boolean;
	onSubmit: (payload: CreateAnnouncementPayload) => void;
	onClose: () => void;
}

export const CreateAnnouncementModal = ({
	open,
	isSubmitting,
	onSubmit,
	onClose,
}: CreateAnnouncementModalProps) => {
	const { t } = useI18n();

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("admin.announcements.modal.createTitle")}
			className="max-w-[460px] max-sm:max-w-full"
		>
			{open && (
				<CreateAnnouncementForm
					key="create-form"
					isSubmitting={isSubmitting}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			)}
		</Modal>
	);
};
