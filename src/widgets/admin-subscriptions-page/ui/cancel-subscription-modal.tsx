"use client";

import type { useAdminSubscriptionMutations } from "@/entities/admin-subscription/model/use-admin-subscription-mutations";
import { useI18n } from "@/shared/lib/i18n";
import { useState } from "react";

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

	const handleConfirm = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!subscriptionId) return;
		mutations.cancel.mutate(
			{ id: subscriptionId, dto: { reason: reason.trim() || undefined } },
			{ onSuccess: onClose },
		);
	};

	return (
		<>
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<span className="font-display text-[14px] font-semibold text-t-1">
					{t("admin.subscriptions.modal.cancelTitle")}
				</span>
				<button
					type="button"
					onClick={onClose}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<path d="M1 1l10 10M11 1 1 11" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			<form onSubmit={handleConfirm} className="px-4 py-3.5">
				<p className="mb-3 text-[12.5px] leading-relaxed text-t-2">
					{t("admin.subscriptions.modal.cancelWarning")}
				</p>
				<div>
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.cancelReason")}
					</label>
					<input
						value={reason}
						onChange={e => setReason(e.target.value)}
						placeholder={t("admin.subscriptions.modal.cancelReasonPlaceholder")}
						className="h-[34px] w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
					/>
				</div>
			</form>

			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<button
					type="button"
					onClick={onClose}
					className="h-8 rounded-lg border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("admin.subscriptions.modal.keepSub")}
				</button>
				<button
					type="button"
					onClick={handleConfirm}
					disabled={mutations.cancel.isPending}
					className="h-8 rounded-lg bg-red px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
				>
					{mutations.cancel.isPending
						? t("admin.subscriptions.modal.saving")
						: t("admin.subscriptions.modal.cancelConfirm")}
				</button>
			</div>
		</>
	);
};
