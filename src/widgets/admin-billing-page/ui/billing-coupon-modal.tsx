"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ComponentProps, useEffect, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { CreateCouponDto, CouponType } from "@/entities/admin-billing";
import { Select } from "@/shared/ui/select";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface BillingCouponModalProps {
	open: boolean;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (dto: CreateCouponDto) => void;
}

const empty = {
	code: "",
	name: "",
	type: "PERCENT" as CouponType,
	amount: "10",
	maxRedemptions: "",
	validUntil: "",
};

export const BillingCouponModal = ({
	open,
	isPending,
	onClose,
	onSubmit,
}: BillingCouponModalProps) => {
	const { t } = useI18n();
	const [form, setForm] = useState(empty);

	useEffect(() => {
		if (open) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- reset form when modal opens
			setForm(empty);
		}
	}, [open]);

	const set = <K extends keyof typeof empty>(key: K, value: string) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSubmit = () => {
		if (!form.code.trim()) return;

		const amount =
			form.type === "PERCENT"
				? Math.min(100, Math.max(1, Number(form.amount) || 10))
				: Math.round((Number(form.amount) || 0) * 100);

		const dto: CreateCouponDto = {
			code: form.code.trim().toUpperCase(),
			name: form.name.trim() || undefined,
			type: form.type,
			amount,
			maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : undefined,
			validUntil: form.validUntil ? `${form.validUntil}T23:59:59.000Z` : undefined,
			applicablePlans: [],
			isActive: true,
		};
		onSubmit(dto);
	};

	const handleCodeChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("code", e.currentTarget.value);
	const handleNameChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("name", e.currentTarget.value);
	const handleTypeChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => set("type", e.currentTarget.value);
	const handleAmountChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("amount", e.currentTarget.value);
	const handleMaxRedemptionsChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("maxRedemptions", e.currentTarget.value);
	const handleValidUntilChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("validUntil", e.currentTarget.value);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("admin.plans.couponModal.title")}
			className="max-w-[440px]"
		>
			<form action={handleSubmit} id="coupon-form">
				<div className="space-y-3.5">
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
							{t("admin.plans.couponModal.code")}
						</Typography>
						<Input
							value={form.code}
							onChange={handleCodeChange}
							placeholder={t("admin.plans.couponModal.codePlaceholder")}
							aria-label={t("admin.plans.couponModal.code")}
							className="rounded-[8px] font-mono uppercase placeholder:normal-case focus:bg-surf"
						/>
					</div>

					<div>
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
							{t("admin.plans.couponModal.name")}
						</Typography>
						<Input
							value={form.name}
							onChange={handleNameChange}
							placeholder={t("admin.plans.couponModal.namePlaceholder")}
							aria-label={t("admin.plans.couponModal.name")}
							className="rounded-[8px] focus:bg-surf"
						/>
					</div>

					<div className="grid grid-cols-2 gap-2.5">
						<div>
							<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.couponModal.discountType")}
							</Typography>
							<Select
								variant="lg"
								value={form.type}
								onChange={handleTypeChange}
							>
								<option value="PERCENT">% скидка</option>
								<option value="FIXED">₽ скидка</option>
							</Select>
						</div>
						<div>
							<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.couponModal.discount")}
							</Typography>
							<div className="relative">
								<Input
									type="number"
									min={1}
									max={form.type === "PERCENT" ? 100 : undefined}
									step={form.type === "PERCENT" ? 1 : 0.01}
									value={form.amount}
									onChange={handleAmountChange}
									placeholder={form.type === "PERCENT" ? "10" : "500"}
									aria-label={t("admin.plans.couponModal.discount")}
									className="rounded-[8px] pr-7 focus:bg-surf"
								/>
								<Typography tag="span" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-t-3">
									{form.type === "PERCENT" ? "%" : "₽"}
								</Typography>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2.5">
						<div>
							<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.couponModal.maxUses")}
							</Typography>
							<Input
								type="number"
								min={1}
								value={form.maxRedemptions}
								onChange={handleMaxRedemptionsChange}
								placeholder="∞"
								aria-label={t("admin.plans.couponModal.maxUses")}
								className="rounded-[8px] focus:bg-surf"
							/>
						</div>
						<div>
							<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.couponModal.expiresAt")}
							</Typography>
							<Input
								type="date"
								value={form.validUntil}
								onChange={handleValidUntilChange}
								aria-label={t("admin.plans.couponModal.expiresAt")}
								className="rounded-[8px] focus:bg-surf"
							/>
						</div>
					</div>
				</div>
			</form>

			<ModalActions>
				<Button
					onClick={onClose}
					title={t("admin.plans.couponModal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.plans.couponModal.cancel")}
				</Button>
				<Button
					type="submit"
					form="coupon-form"
					disabled={isPending || !form.code.trim()}
					title={t("admin.plans.couponModal.save")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
				>
					{t("admin.plans.couponModal.save")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
