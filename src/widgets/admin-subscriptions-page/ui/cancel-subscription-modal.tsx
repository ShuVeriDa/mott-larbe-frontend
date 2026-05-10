"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import type { useAdminSubscriptionMutations } from "@/entities/admin-subscription/model/use-admin-subscription-mutations";
import { useI18n } from "@/shared/lib/i18n";
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

		const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setReason(e.currentTarget.value);
return (
		<>
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography tag="span" className="font-display text-[14px] font-semibold text-t-1">
					{t("admin.subscriptions.modal.cancelTitle")}
				</Typography>
				<Button
					onClick={onClose}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<X className="size-3" />
				</Button>
			</div>

			<form action={handleConfirm} className="px-4 py-3.5">
				<Typography tag="p" className="mb-3 text-[12.5px] leading-relaxed text-t-2">
					{t("admin.subscriptions.modal.cancelWarning")}
				</Typography>
				<div>
					<Typography tag="label" className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.cancelReason")}
					</Typography>
					<input
						value={reason}
						onChange={handleChange}
						placeholder={t("admin.subscriptions.modal.cancelReasonPlaceholder")}
						className="h-[34px] w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
					/>
				</div>
			</form>

			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<Button
					onClick={onClose}
					className="h-8 rounded-lg border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("admin.subscriptions.modal.keepSub")}
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={mutations.cancel.isPending}
					className="h-8 rounded-lg bg-red px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
				>
					{mutations.cancel.isPending
						? t("admin.subscriptions.modal.saving")
						: t("admin.subscriptions.modal.cancelConfirm")}
				</Button>
			</div>
		</>
	);
};
