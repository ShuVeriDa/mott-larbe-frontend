"use client";
import { ComponentProps, useEffect, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { CreateCouponDto, CouponType } from "@/entities/admin-billing";

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

	if (!open) return null;

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => e.stopPropagation();
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("code", e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("name", e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => set("type", e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("amount", e.currentTarget.value);
	const handleChange5: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("maxRedemptions", e.currentTarget.value);
	const handleChange6: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("validUntil", e.currentTarget.value);
return (
		<div
			className="fixed inset-0 z-400 flex items-end justify-center bg-black/35 sm:items-center sm:p-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-[440px] overflow-hidden rounded-t-[14px] bg-surf shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:rounded-[14px]"
				onClick={handleClick}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-bd-1 px-[18px] py-4">
					<span className="font-display text-[14px] font-semibold text-t-1">
						{t("admin.plans.couponModal.title")}
					</span>
					<button
						onClick={onClose}
						className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
					>
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
							<path d="M1 1l10 10M11 1 1 11" />
						</svg>
					</button>
				</div>

				{/* Body */}
				<form action={handleSubmit} id="coupon-form">
					<div className="space-y-3.5 px-[18px] py-4">
						<div>
							<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.couponModal.code")}
							</label>
							<input
								value={form.code}
								onChange={handleChange}
								placeholder={t("admin.plans.couponModal.codePlaceholder")}
								className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 font-mono text-[13px] uppercase text-t-1 outline-none placeholder:normal-case placeholder:text-t-3 focus:border-acc focus:bg-surf"
							/>
						</div>

						<div>
							<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.couponModal.name")}
							</label>
							<input
								value={form.name}
								onChange={handleChange2}
								placeholder={t("admin.plans.couponModal.namePlaceholder")}
								className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
							/>
						</div>

						<div className="grid grid-cols-2 gap-2.5">
							<div>
								<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
									{t("admin.plans.couponModal.discountType")}
								</label>
								<select
									value={form.type}
									onChange={handleChange3}
									className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf"
								>
									<option value="PERCENT">% скидка</option>
									<option value="FIXED">₽ скидка</option>
								</select>
							</div>
							<div>
								<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
									{t("admin.plans.couponModal.discount")}
								</label>
								<div className="relative">
									<input
										type="number"
										min={1}
										max={form.type === "PERCENT" ? 100 : undefined}
										step={form.type === "PERCENT" ? 1 : 0.01}
										value={form.amount}
										onChange={handleChange4}
										placeholder={form.type === "PERCENT" ? "10" : "500"}
										className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 pr-7 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
									/>
									<span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-t-3">
										{form.type === "PERCENT" ? "%" : "₽"}
									</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2.5">
							<div>
								<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
									{t("admin.plans.couponModal.maxUses")}
								</label>
								<input
									type="number"
									min={1}
									value={form.maxRedemptions}
									onChange={handleChange5}
									placeholder="∞"
									className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
								/>
							</div>
							<div>
								<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
									{t("admin.plans.couponModal.expiresAt")}
								</label>
								<input
									type="date"
									value={form.validUntil}
									onChange={handleChange6}
									className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf"
								/>
							</div>
						</div>
					</div>
				</form>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-[18px] py-3">
					<button
						type="button"
						onClick={onClose}
						className="h-8 rounded-[8px] border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("admin.plans.couponModal.cancel")}
					</button>
					<button
						type="submit"
						form="coupon-form"
						disabled={isPending || !form.code.trim()}
						className="h-8 rounded-[8px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						{t("admin.plans.couponModal.save")}
					</button>
				</div>
			</div>
		</div>
	);
};
