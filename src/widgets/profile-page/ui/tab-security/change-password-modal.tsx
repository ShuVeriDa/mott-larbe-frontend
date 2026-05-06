"use client";

import { useState, type SyntheticEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useChangePassword } from "@/entities/auth";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";

export interface ChangePasswordModalProps {
	open: boolean;
	onClose: () => void;
}

export const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutateAsync, isPending } = useChangePassword();

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [mismatch, setMismatch] = useState(false);

	const handleClose = () => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setMismatch(false);
		onClose();
	};

	const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setMismatch(true);
			return;
		}
		setMismatch(false);
		try {
			await mutateAsync({ currentPassword, newPassword });
			success(t("profile.security.passwordChanged"));
			handleClose();
		} catch {
			error(t("profile.toasts.error"));
		}
	};

	return (
		<Modal open={open} onClose={handleClose} title={t("profile.security.changePassword")}>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<div>
					<InputLabel htmlFor="cp-current">{t("profile.security.currentPassword")}</InputLabel>
					<Input
						id="cp-current"
						type="password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<InputLabel htmlFor="cp-new">{t("profile.security.newPassword")}</InputLabel>
					<Input
						id="cp-new"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
				</div>
				<div>
					<InputLabel htmlFor="cp-confirm">{t("profile.security.confirmNewPassword")}</InputLabel>
					<Input
						id="cp-confirm"
						type="password"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
							setMismatch(false);
						}}
						required
					/>
					{mismatch && (
						<p className="mt-1 text-[11px] text-red-500">
							{t("profile.security.passwordMismatch")}
						</p>
					)}
				</div>
				<ModalActions>
					<Button type="button" variant="ghost" className="flex-1" onClick={handleClose}>
						{t("profile.common.cancel")}
					</Button>
					<Button type="submit" variant="action" className="flex-1" disabled={isPending}>
						{t("profile.security.savePassword")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
