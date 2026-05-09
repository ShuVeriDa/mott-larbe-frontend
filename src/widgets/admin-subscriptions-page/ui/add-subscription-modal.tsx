"use client";

import type { PaymentProvider } from "@/entities/admin-subscription";
import { adminSubscriptionApi } from "@/entities/admin-subscription";
import type { useAdminSubscriptionMutations } from "@/entities/admin-subscription/model/use-admin-subscription-mutations";
import { useI18n } from "@/shared/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
	mutations: ReturnType<typeof useAdminSubscriptionMutations>;
	onClose: () => void;
	initialEmail?: string;
}

export const AddSubscriptionModal = ({
	mutations,
	onClose,
	initialEmail,
}: Props) => {
	const { t } = useI18n();
	const [email, setEmail] = useState(initialEmail ?? "");
	const [planId, setPlanId] = useState("");
	const [durationDays, setDurationDays] = useState("30");
	const [provider, setProvider] = useState<PaymentProvider>("MANUAL");
	const [reason, setReason] = useState("");

	const plansQuery = useQuery({
		queryKey: ["admin", "plans"],
		queryFn: adminSubscriptionApi.listPlans,
	});

	const plans = plansQuery.data ?? [];

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		mutations.create.mutate(
			{
				email: email.trim() || undefined,
				planId: planId || undefined,
				durationDays: durationDays ? Number(durationDays) : undefined,
				provider,
				reason: reason.trim() || undefined,
			},
			{ onSuccess: onClose },
		);
	};

		const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = e => setEmail(e.target.value);
	const handleChange2: NonNullable<React.ComponentProps<"select">["onChange"]> = e => setPlanId(e.target.value);
	const handleChange3: NonNullable<React.ComponentProps<"select">["onChange"]> = e => setDurationDays(e.target.value);
	const handleChange4: NonNullable<React.ComponentProps<"select">["onChange"]> = e => setProvider(e.target.value as PaymentProvider);
	const handleChange5: NonNullable<React.ComponentProps<"input">["onChange"]> = e => setReason(e.target.value);
return (
		<>
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<span className="font-display text-[14px] font-semibold text-t-1">
					{t("admin.subscriptions.modal.addTitle")}
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

			<form onSubmit={handleSubmit} className="px-4 py-3.5">
				<div className="mb-3">
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.emailOrId")}
					</label>
					<input
						value={email}
						onChange={handleChange}
						placeholder="zargan.d@gmail.com"
						className="h-[34px] w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc focus:bg-surf"
					/>
				</div>

				<div className="mb-3">
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.plan")}
					</label>
					<select
						value={planId}
						onChange={handleChange2}
						disabled={plansQuery.isLoading}
						className="h-[34px] w-full cursor-pointer appearance-none rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors focus:border-acc focus:bg-surf disabled:opacity-60"
					>
						<option value="">— выбрать план —</option>
						{plans.map(plan => (
							<option key={plan.id} value={plan.id}>
								{plan.name} ({plan.code})
							</option>
						))}
					</select>
				</div>

				<div className="mb-3">
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.duration")}
					</label>
					<select
						value={durationDays}
						onChange={handleChange3}
						className="h-[34px] w-full cursor-pointer appearance-none rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors focus:border-acc focus:bg-surf"
					>
						<option value="30">
							{t("admin.subscriptions.modal.duration1m")}
						</option>
						<option value="90">
							{t("admin.subscriptions.modal.duration3m")}
						</option>
						<option value="180">
							{t("admin.subscriptions.modal.duration6m")}
						</option>
						<option value="365">
							{t("admin.subscriptions.modal.duration1y")}
						</option>
					</select>
				</div>

				<div className="mb-3">
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.provider")}
					</label>
					<select
						value={provider}
						onChange={handleChange4}
						className="h-[34px] w-full cursor-pointer appearance-none rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors focus:border-acc focus:bg-surf"
					>
						<option value="MANUAL">Manual</option>
						<option value="STRIPE">Stripe</option>
						<option value="PAYPAL">PayPal</option>
						<option value="PADDLE">Paddle</option>
						<option value="LEMONSQUEEZY">LemonSqueezy</option>
					</select>
				</div>

				<div className="mb-0">
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.subscriptions.modal.reason")}
					</label>
					<input
						value={reason}
						onChange={handleChange5}
						placeholder={t("admin.subscriptions.modal.reasonPlaceholder")}
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
					{t("admin.subscriptions.modal.cancel")}
				</button>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={mutations.create.isPending || !planId || !email.trim()}
					className="h-8 rounded-lg bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
				>
					{mutations.create.isPending
						? t("admin.subscriptions.modal.saving")
						: t("admin.subscriptions.modal.addConfirm")}
				</button>
			</div>
		</>
	);
};
