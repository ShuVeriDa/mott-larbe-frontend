"use client";
import { ComponentProps, useState } from "react";
import { useDeleteAccount } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

export interface DeleteAccountModalProps {
	open: boolean;
	onClose: () => void;
}

export const DeleteAccountModal = ({
	open,
	onClose,
}: DeleteAccountModalProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useDeleteAccount();
	const { success } = useToast();
	const [email, setEmail] = useState("");

	const handleSubmit = async () => {
		if (!email.trim()) return;
		try {
			await mutateAsync(email.trim());
			success(t("settings.toasts.deleteRequested"));
			setEmail("");
			onClose();
		} catch {}
	};

		const handleChange: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) => setEmail(e.currentTarget.value);
return (
		<Modal open={open} onClose={onClose} title={t("settings.deleteAccountModal.title")}>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3 leading-[1.55]">
				{t("settings.deleteAccountModal.desc")}
			</Typography>
			<form action={handleSubmit}>
				<InputLabel htmlFor="delete-account-email">
					{t("settings.deleteAccountModal.emailLabel")}
				</InputLabel>
				<Input
					id="delete-account-email"
					type="email"
					value={email}
					onChange={handleChange}
					placeholder={t("settings.deleteAccountModal.emailPlaceholder")}
					className="mb-4"
					required
				/>
				<ModalActions>
					<Button
						onClick={onClose}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("settings.deleteAccountModal.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending || !email.trim()}
						variant="bare"
						className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
					>
						{t("settings.deleteAccountModal.confirm")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
