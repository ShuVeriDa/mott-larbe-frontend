"use client";

import type { PaymentProvider } from "@/entities/admin-subscription";
import { adminSubscriptionApi } from "@/entities/admin-subscription";
import type { useAdminSubscriptionMutations } from "@/entities/admin-subscription/model/use-admin-subscription-mutations";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { ComponentProps, useState } from "react";
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

	const handleSubmit = () => {
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

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setEmail(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		setPlanId(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		setDurationDays(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		setProvider(e.currentTarget.value as PaymentProvider);
	const handleChange5: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setReason(e.currentTarget.value);
	return (
		<>
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography
					tag="span"
					className="font-display text-[14px] font-semibold text-t-1"
				>
					{t("admin.subscriptions.modal.addTitle")}
				</Typography>
				<Button
					size={"bare"}
					onClick={onClose}
					title={t("admin.subscriptions.modal.cancel")}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<X className="size-3" />
				</Button>
			</div>

			<form action={handleSubmit} className="px-4 py-3.5">
				<div className="mb-3">
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.subscriptions.modal.emailOrId")}
					</Typography>
					<Input
						value={email}
						onChange={handleChange}
						placeholder="zargan.d@gmail.com"
						type="email"
						aria-label={t("admin.subscriptions.modal.emailOrId")}
						className="rounded-lg focus:bg-surf"
					/>
				</div>

				<div className="mb-3">
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.subscriptions.modal.plan")}
					</Typography>
					<Select
						variant="lg"
						value={planId}
						onChange={handleChange2}
						disabled={plansQuery.isLoading}
						className="rounded-lg focus:bg-surf"
					>
						<option value="">— выбрать план —</option>
						{plans.map(plan => (
							<option key={plan.id} value={plan.id}>
								{plan.name} ({plan.code})
							</option>
						))}
					</Select>
				</div>

				<div className="mb-3">
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.subscriptions.modal.duration")}
					</Typography>
					<Select
						variant="lg"
						value={durationDays}
						onChange={handleChange3}
						className="rounded-lg focus:bg-surf"
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
					</Select>
				</div>

				<div className="mb-3">
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.subscriptions.modal.provider")}
					</Typography>
					<Select
						variant="lg"
						value={provider}
						onChange={handleChange4}
						className="rounded-lg focus:bg-surf"
					>
						<option value="MANUAL">Manual</option>
						<option value="STRIPE">Stripe</option>
						<option value="PAYPAL">PayPal</option>
						<option value="PADDLE">Paddle</option>
						<option value="LEMONSQUEEZY">LemonSqueezy</option>
					</Select>
				</div>

				<div className="mb-0">
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.subscriptions.modal.reason")}
					</Typography>
					<Input
						value={reason}
						onChange={handleChange5}
						placeholder={t("admin.subscriptions.modal.reasonPlaceholder")}
						aria-label={t("admin.subscriptions.modal.reason")}
						className="rounded-lg focus:bg-surf"
					/>
				</div>
			</form>

			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<Button
					onClick={onClose}
					title={t("admin.subscriptions.modal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.subscriptions.modal.cancel")}
				</Button>
				<Button
					onClick={handleSubmit}
					disabled={mutations.create.isPending || !planId || !email.trim()}
					title={mutations.create.isPending ? t("admin.subscriptions.modal.saving") : t("admin.subscriptions.modal.addConfirm")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{mutations.create.isPending
						? t("admin.subscriptions.modal.saving")
						: t("admin.subscriptions.modal.addConfirm")}
				</Button>
			</div>
		</>
	);
};
