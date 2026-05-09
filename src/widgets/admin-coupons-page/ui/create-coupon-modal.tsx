"use client";

import type {
	AdminCouponDetail,
	CouponType,
	CreateCouponDto,
	UpdateCouponDto,
	useCouponMutations,
} from "@/entities/admin-coupon";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useState, type SyntheticEvent } from "react";

const PLANS = ["BASIC", "PRO", "PREMIUM", "LIFETIME"] as const;
const PLAN_STYLES: Record<string, string> = {
	BASIC: "bg-acc-bg border-acc text-acc-t",
	PRO: "bg-grn-bg border-grn text-grn-t",
	PREMIUM: "bg-pur-bg border-pur text-pur-t",
	LIFETIME: "bg-amb-bg border-amb text-amb-t",
};

const generateCode = () => {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	return Array.from(
		{ length: 8 },
		() => chars[Math.floor(Math.random() * chars.length)],
	).join("");
};

interface FormState {
	code: string;
	name: string;
	type: CouponType;
	amount: string;
	maxRedemptions: string;
	maxPerUser: string;
	applicablePlans: string[];
	validFrom: string;
	validUntil: string;
	newUsersOnly: boolean;
	isStackable: boolean;
}

const defaultForm = (): FormState => ({
	code: "",
	name: "",
	type: "PERCENT",
	amount: "",
	maxRedemptions: "",
	maxPerUser: "1",
	applicablePlans: [],
	validFrom: "",
	validUntil: "",
	newUsersOnly: false,
	isStackable: false,
});

const fromCoupon = (c: AdminCouponDetail): FormState => ({
	code: c.code,
	name: c.name ?? "",
	type: c.type,
	amount: String(c.amount),
	maxRedemptions: c.maxRedemptions != null ? String(c.maxRedemptions) : "",
	maxPerUser: c.maxPerUser != null ? String(c.maxPerUser) : "1",
	applicablePlans: [...c.applicablePlans],
	validFrom: c.validFrom ? c.validFrom.slice(0, 10) : "",
	validUntil: c.validUntil ? c.validUntil.slice(0, 10) : "",
	newUsersOnly: c.newUsersOnly,
	isStackable: c.isStackable,
});

interface Props {
	editing?: AdminCouponDetail | null;
	mutations: ReturnType<typeof useCouponMutations>;
	onClose: () => void;
}

export const CreateCouponModal = ({ editing, mutations, onClose }: Props) => {
	const { t } = useI18n();
	const [form, setForm] = useState<FormState>(
		editing ? fromCoupon(editing) : defaultForm,
	);
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormState, string>>
	>({});

	const isEdit = !!editing;
	const isPending = mutations.create.isPending || mutations.update.isPending;

	const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
		setForm(prev => ({ ...prev, [key]: value }));

	const togglePlan = (plan: string) =>
		set(
			"applicablePlans",
			form.applicablePlans.includes(plan)
				? form.applicablePlans.filter(p => p !== plan)
				: [...form.applicablePlans, plan],
		);

	const validate = (): boolean => {
		const e: typeof errors = {};
		if (!form.code.trim()) e.code = t("admin.coupons.modal.errorCodeRequired");
		if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
			e.amount = t("admin.coupons.modal.errorAmountRequired");
		if (form.type === "PERCENT" && Number(form.amount) > 100)
			e.amount = t("admin.coupons.modal.errorAmountMax");
		if (form.validFrom && form.validUntil && form.validFrom > form.validUntil)
			e.validUntil = t("admin.coupons.modal.errorDateRange");
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const payload: CreateCouponDto = {
			code: form.code.trim().toUpperCase(),
			...(form.name.trim() ? { name: form.name.trim() } : {}),
			type: form.type,
			amount: Number(form.amount),
			...(form.maxRedemptions
				? { maxRedemptions: Number(form.maxRedemptions) }
				: {}),
			...(form.maxPerUser ? { maxPerUser: Number(form.maxPerUser) } : {}),
			applicablePlans: form.applicablePlans,
			...(form.validFrom
				? { validFrom: new Date(form.validFrom).toISOString() }
				: {}),
			...(form.validUntil
				? { validUntil: new Date(form.validUntil + "T23:59:59").toISOString() }
				: {}),
			newUsersOnly: form.newUsersOnly,
			isStackable: form.isStackable,
			isActive: true,
		};

		if (isEdit) {
			const update: UpdateCouponDto = payload;
			await mutations.update.mutateAsync({ id: editing!.id, dto: update });
		} else {
			await mutations.create.mutateAsync(payload);
		}
		onClose();
	};

		const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("code", e.target.value.toUpperCase());
	const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => set("code", generateCode());
	const handleChange2: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("name", e.target.value);
	const handleChange3: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("amount", e.target.value);
	const handleChange4: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("maxRedemptions", e.target.value);
	const handleChange5: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("maxPerUser", e.target.value);
	const handleClick2: NonNullable<React.ComponentProps<"button">["onClick"]> = () => set("applicablePlans", []);
	const handleChange6: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("validFrom", e.target.value);
	const handleChange7: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("validUntil", e.target.value);
	const handleChange8: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("newUsersOnly", e.target.checked);
	const handleChange9: NonNullable<React.ComponentProps<"input">["onChange"]> = e => set("isStackable", e.target.checked);
return (
		<form onSubmit={handleSubmit}>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<h2 className="font-display text-[14px] font-semibold text-t-1">
					{isEdit
						? t("admin.coupons.modal.titleEdit")
						: t("admin.coupons.modal.titleNew")}
				</h2>
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
						<path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
					</svg>
				</button>
			</div>

			{/* Body */}
			<div className="max-h-[70vh] overflow-y-auto p-4">
				{/* Code + random */}
				<div className="mb-3">
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.coupons.modal.code")}
						<span className="ml-1 text-red-t">*</span>
					</label>
					<div className="flex gap-1.5">
						<input
							value={form.code}
							onChange={handleChange}
							placeholder={t("admin.coupons.modal.codePlaceholder")}
							className={cn(
								"h-[34px] flex-1 rounded-[8px] border bg-surf-2 px-2.5 font-mono text-[14px] font-bold uppercase tracking-[1px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf",
								errors.code ? "border-red" : "border-bd-2",
							)}
						/>
						<button
							type="button"
							onClick={handleClick}
							className="h-[34px] shrink-0 rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
						>
							{t("admin.coupons.modal.random")}
						</button>
					</div>
					{errors.code && (
						<p className="mt-1 text-[11px] text-red-t">{errors.code}</p>
					)}
				</div>

				{/* Name */}
				<div className="mb-3">
					<label className="mb-1 block text-[11.5px] font-medium text-t-2">
						{t("admin.coupons.modal.name")}
					</label>
					<input
						value={form.name}
						onChange={handleChange2}
						placeholder={t("admin.coupons.modal.namePlaceholder")}
						className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
					/>
				</div>

				{/* Type toggle + amount */}
				<div className="mb-3 grid grid-cols-2 gap-2.5">
					<div>
						<label className="mb-1 block text-[11.5px] font-medium text-t-2">
							{t("admin.coupons.modal.type")}
						</label>
						<div className="flex gap-1">
							{(["PERCENT", "FIXED"] as CouponType[]).map(tp => {
							  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => set("type", tp);
							  return (
								<button
									key={tp}
									type="button"
									onClick={handleClick}
									className={cn(
										"flex-1 h-[34px] rounded-[8px] border text-[12.5px] transition-colors",
										form.type === tp
											? "border-acc bg-acc-bg font-semibold text-acc-t"
											: "border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3",
									)}
								>
									{tp === "PERCENT"
										? t("admin.coupons.modal.typePercent")
										: t("admin.coupons.modal.typeFixed")}
								</button>
							);
							})}
						</div>
					</div>
					<div>
						<label className="mb-1 block text-[11.5px] font-medium text-t-2">
							{t("admin.coupons.modal.amount")}
							<span className="ml-1 text-red-t">*</span>
						</label>
						<input
							type="number"
							min="0"
							max={form.type === "PERCENT" ? 100 : undefined}
							step="1"
							value={form.amount}
							onChange={handleChange3}
							className={cn(
								"h-[34px] w-full rounded-[8px] border bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf",
								errors.amount ? "border-red" : "border-bd-2",
							)}
						/>
						{errors.amount && (
							<p className="mt-1 text-[11px] text-red-t">{errors.amount}</p>
						)}
					</div>
				</div>

				{/* Max redemptions + per user */}
				<div className="mb-3 grid grid-cols-2 gap-2.5">
					<div>
						<label className="mb-1 block text-[11.5px] font-medium text-t-2">
							{t("admin.coupons.modal.maxRedemptions")}
							<span className="ml-1 text-[10.5px] font-normal text-t-3">
								{t("admin.coupons.modal.optional")}
							</span>
						</label>
						<input
							type="number"
							min="1"
							value={form.maxRedemptions}
							onChange={handleChange4}
							placeholder="∞"
							className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
						/>
					</div>
					<div>
						<label className="mb-1 block text-[11.5px] font-medium text-t-2">
							{t("admin.coupons.modal.maxPerUser")}
						</label>
						<input
							type="number"
							min="1"
							value={form.maxPerUser}
							onChange={handleChange5}
							className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf"
						/>
					</div>
				</div>

				{/* Applicable plans */}
				<div className="mb-3">
					<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
						{t("admin.coupons.modal.plans")}
					</label>
					<div className="flex flex-wrap gap-1.5">
						<button
							type="button"
							onClick={handleClick2}
							className={cn(
								"h-7 rounded-[6px] border px-2.5 text-[11.5px] transition-colors",
								form.applicablePlans.length === 0
									? "border-acc bg-acc-bg font-semibold text-acc-t"
									: "border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3",
							)}
						>
							{t("admin.coupons.modal.plansAll")}
						</button>
						{PLANS.map(p => {
						  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => togglePlan(p);
						  return (
							<button
								key={p}
								type="button"
								onClick={handleClick}
								className={cn(
									"h-7 rounded-[6px] border px-2.5 text-[11.5px] font-semibold transition-colors",
									form.applicablePlans.includes(p)
										? PLAN_STYLES[p]
										: "border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3",
								)}
							>
								{p.charAt(0) + p.slice(1).toLowerCase()}
							</button>
						);
						})}
					</div>
				</div>

				{/* Dates */}
				<div className="mb-3 grid grid-cols-2 gap-2.5">
					<div>
						<label className="mb-1 block text-[11.5px] font-medium text-t-2">
							{t("admin.coupons.modal.validFrom")}
						</label>
						<input
							type="date"
							value={form.validFrom}
							onChange={handleChange6}
							className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf"
						/>
					</div>
					<div>
						<label className="mb-1 block text-[11.5px] font-medium text-t-2">
							{t("admin.coupons.modal.validUntil")}
						</label>
						<input
							type="date"
							value={form.validUntil}
							onChange={handleChange7}
							className={cn(
								"h-[34px] w-full rounded-[8px] border bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf",
								errors.validUntil ? "border-red" : "border-bd-2",
							)}
						/>
						{errors.validUntil && (
							<p className="mt-1 text-[11px] text-red-t">{errors.validUntil}</p>
						)}
					</div>
				</div>

				{/* Checkboxes */}
				<div className="flex flex-wrap gap-4">
					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							checked={form.newUsersOnly}
							onChange={handleChange8}
							className="h-3.5 w-3.5 cursor-pointer accent-acc"
						/>
						<span className="text-[12.5px] text-t-2">
							{t("admin.coupons.modal.newUsersOnly")}
						</span>
					</label>
					<label className="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							checked={form.isStackable}
							onChange={handleChange9}
							className="h-3.5 w-3.5 cursor-pointer accent-acc"
						/>
						<span className="text-[12.5px] text-t-2">
							{t("admin.coupons.modal.isStackable")}
						</span>
					</label>
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<button
					type="button"
					onClick={onClose}
					className="h-8 rounded-[8px] border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("admin.coupons.modal.cancel")}
				</button>
				<button
					type="submit"
					disabled={isPending}
					className="h-8 rounded-[8px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{isEdit
						? t("admin.coupons.modal.save")
						: t("admin.coupons.modal.create")}
				</button>
			</div>
		</form>
	);
};
