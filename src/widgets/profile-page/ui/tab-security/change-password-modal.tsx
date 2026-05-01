"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { authApi } from "@/entities/auth";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

export interface ChangePasswordModalProps {
	open: boolean;
	onClose: () => void;
	email: string;
}

export const ChangePasswordModal = ({ open, onClose, email }: ChangePasswordModalProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();

	const handleSend = async () => {
		try {
			await authApi.requestPasswordReset({ email });
			success(t("profile.security.passwordEmailSent"));
			onClose();
		} catch {
			error(t("profile.toasts.error"));
		}
	};

	return (
		<Modal open={open} onClose={onClose} title={t("profile.security.changePassword")}>
			<Typography tag="p" className="mb-5 text-[12.5px] text-t-2 leading-[1.55]">
				{t("profile.security.changePasswordDesc")}
			</Typography>
			<ModalActions>
				<Button variant="ghost" className="flex-1" onClick={onClose}>
					{t("profile.common.cancel")}
				</Button>
				<Button variant="action" className="flex-1" onClick={handleSend}>
					{t("profile.security.sendLink")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
