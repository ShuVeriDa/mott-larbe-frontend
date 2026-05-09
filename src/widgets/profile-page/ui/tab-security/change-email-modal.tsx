"use client";

import { useState, type SyntheticEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useRequestEmailChange } from "@/entities/auth";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

export interface ChangeEmailModalProps {
	open: boolean;
	onClose: () => void;
}

export const ChangeEmailModal = ({ open, onClose }: ChangeEmailModalProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutateAsync, isPending } = useRequestEmailChange();

	const [newEmail, setNewEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleClose = () => {
		setNewEmail("");
		setPassword("");
		onClose();
	};

	const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
		e.preventDefault();
		try {
			await mutateAsync({ newEmail: newEmail.trim(), currentPassword: password });
			success(t("profile.security.emailChangeSent"));
			handleClose();
		} catch {
			error(t("profile.toasts.error"));
		}
	};

		const handleChange: NonNullable<React.ComponentProps<typeof Input>["onChange"]> = (e) => setNewEmail(e.target.value);
	const handleChange2: NonNullable<React.ComponentProps<typeof Input>["onChange"]> = (e) => setPassword(e.target.value);
return (
		<Modal open={open} onClose={handleClose} title={t("profile.security.changeEmailTitle")}>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-2 leading-[1.55]">
				{t("profile.security.changeEmailDesc")}
			</Typography>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<div>
					<InputLabel htmlFor="ce-email">{t("profile.security.newEmail")}</InputLabel>
					<Input
						id="ce-email"
						type="email"
						value={newEmail}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<InputLabel htmlFor="ce-password">{t("profile.security.currentPassword")}</InputLabel>
					<Input
						id="ce-password"
						type="password"
						value={password}
						onChange={handleChange2}
						required
					/>
				</div>
				<ModalActions>
					<Button type="button" variant="ghost" className="flex-1" onClick={handleClose}>
						{t("profile.common.cancel")}
					</Button>
					<Button type="submit" variant="action" className="flex-1" disabled={isPending}>
						{t("profile.security.sendLink")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
