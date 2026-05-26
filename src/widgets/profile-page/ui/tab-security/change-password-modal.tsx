"use client";

import { Typography } from "@/shared/ui/typography";
import { ComponentProps, useState } from "react";
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
	const { success } = useToast();
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

	const handleSubmit = async () => {
		if (newPassword !== confirmPassword) {
			setMismatch(true);
			return;
		}
		setMismatch(false);
		try {
			await mutateAsync({ currentPassword, newPassword });
			success(t("profile.security.passwordChanged"));
			handleClose();
		} catch {}
	};

		const handleChange: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) => setCurrentPassword(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) => setNewPassword(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) => {
							setConfirmPassword(e.currentTarget.value);
							setMismatch(false);
						};
return (
		<Modal open={open} onClose={handleClose} title={t("profile.security.changePassword")}>
			<form action={handleSubmit} className="flex flex-col gap-3">
				<div>
					<InputLabel htmlFor="cp-current">{t("profile.security.currentPassword")}</InputLabel>
					<Input
						id="cp-current"
						type="password"
						value={currentPassword}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<InputLabel htmlFor="cp-new">{t("profile.security.newPassword")}</InputLabel>
					<Input
						id="cp-new"
						type="password"
						value={newPassword}
						onChange={handleChange2}
						required
					/>
				</div>
				<div>
					<InputLabel htmlFor="cp-confirm">{t("profile.security.confirmNewPassword")}</InputLabel>
					<Input
						id="cp-confirm"
						type="password"
						value={confirmPassword}
						onChange={handleChange3}
						required
					/>
					{mismatch && (
						<Typography tag="p" className="mt-1 text-[11px] text-red-500">
							{t("profile.security.passwordMismatch")}
						</Typography>
					)}
				</div>
				<ModalActions>
					<Button
						onClick={handleClose}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("profile.common.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{t("profile.security.savePassword")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
