"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import type { useAdminSubscriptionMutations } from "@/entities/admin-subscription/model/use-admin-subscription-mutations";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useState } from "react";
import { Select } from "@/shared/ui/select";
interface Props {
	subscriptionId: string | null;
	mutations: ReturnType<typeof useAdminSubscriptionMutations>;
	onClose: () => void;
}

const DURATION_OPTIONS = [
	{ value: 30, labelKey: "admin.subscriptions.modal.duration1m" },
	{ value: 90, labelKey: "admin.subscriptions.modal.duration3m" },
	{ value: 180, labelKey: "admin.subscriptions.modal.duration6m" },
	{ value: 365, labelKey: "admin.subscriptions.modal.duration1y" },
] as const;

export const ExtendSubscriptionModal = ({
	subscriptionId,
	mutations,
	onClose,
}: Props) => {
	const { t } = useI18n();
	const [extendDays, setExtendDays] = useState(365);
	const [reason, setReason] = useState("");

	const handleConfirm = () => {
		if (!subscriptionId) return;
		mutations.extend.mutate(
			{
				id: subscriptionId,
				dto: { extendDays, reason: reason.trim() || undefined },
			},
			{ onSuccess: onClose },
		);
	};

		const handleChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setExtendDays(Number(e.currentTarget.value));
	const handleChange2: NonNullable<ComponentProps<"input">["onChange"]> = e => setReason(e.currentTarget.value);
return (
		<>
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography tag="span" className="font-display text-[14px] font-semibold text-t-1">
					{t("admin.subscriptions.modal.extendTitle")}
				</Typography>
				<Button
					onClick={onClose}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<X className="size-3" />
				</Button>
			</div>

			<form action={handleConfirm} className="px-4 py-3.5">
				<div className="mb-3">
					<Typography tag="label" className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.extendBy")}
					</Typography>
					<Select
						variant="lg"
						value={extendDays}
						onChange={handleChange}
						className="rounded-lg focus:bg-surf"
					>
						{DURATION_OPTIONS.map(({ value, labelKey }) => (
							<option key={value} value={value}>
								{t(labelKey)}
							</option>
						))}
					</Select>
				</div>

				<div>
					<Typography tag="label" className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.reason")}
					</Typography>
					<input
						value={reason}
						onChange={handleChange2}
						placeholder={t("admin.subscriptions.modal.extendReasonPlaceholder")}
						className="h-[34px] w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
					/>
				</div>
			</form>

			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<Button
					onClick={onClose}
					className="h-8 rounded-lg border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("admin.subscriptions.modal.cancel")}
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={mutations.extend.isPending}
					className="h-8 rounded-lg bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
				>
					{mutations.extend.isPending
						? t("admin.subscriptions.modal.saving")
						: t("admin.subscriptions.modal.extendConfirm")}
				</Button>
			</div>
		</>
	);
};
