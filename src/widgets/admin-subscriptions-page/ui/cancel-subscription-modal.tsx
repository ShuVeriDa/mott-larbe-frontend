"use client";

import type { useAdminSubscriptionMutations } from "@/entities/admin-subscription/model/use-admin-subscription-mutations";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { X } from "lucide-react";
import { ComponentProps, useState } from "react";
interface Props {
	subscriptionId: string | null;
	mutations: ReturnType<typeof useAdminSubscriptionMutations>;
	onClose: () => void;
}

export const CancelSubscriptionModal = ({
	subscriptionId,
	mutations,
	onClose,
}: Props) => {
	const { t } = useI18n();
	const [reason, setReason] = useState("");

	const handleConfirm = () => {
		if (!subscriptionId) return;
		mutations.cancel.mutate(
			{ id: subscriptionId, dto: { reason: reason.trim() || undefined } },
			{ onSuccess: onClose },
		);
	};

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setReason(e.currentTarget.value);
	return (
		<>
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography
					tag="span"
					className="font-display text-[14px] font-semibold text-t-1"
				>
					{t("admin.subscriptions.modal.cancelTitle")}
				</Typography>
				<Button
					size={"bare"}
					onClick={onClose}
					title={t("admin.subscriptions.modal.keepSub")}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<X className="size-3" />
				</Button>
			</div>

			<form action={handleConfirm} className="px-4 py-3.5">
				<Typography
					tag="p"
					className="mb-3 text-[12.5px] leading-relaxed text-t-2"
				>
					{t("admin.subscriptions.modal.cancelWarning")}
				</Typography>
				<div>
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.subscriptions.modal.cancelReason")}
					</Typography>
					<Input
						value={reason}
						onChange={handleChange}
						placeholder={t("admin.subscriptions.modal.cancelReasonPlaceholder")}
						aria-label={t("admin.subscriptions.modal.cancelReason")}
						className="rounded-lg focus:bg-surf"
					/>
				</div>
			</form>

			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<Button
					onClick={onClose}
					title={t("admin.subscriptions.modal.keepSub")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.subscriptions.modal.keepSub")}
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={mutations.cancel.isPending}
					title={mutations.cancel.isPending ? t("admin.subscriptions.modal.saving") : t("admin.subscriptions.modal.cancelConfirm")}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85"
				>
					{mutations.cancel.isPending
						? t("admin.subscriptions.modal.saving")
						: t("admin.subscriptions.modal.cancelConfirm")}
				</Button>
			</div>
		</>
	);
};
