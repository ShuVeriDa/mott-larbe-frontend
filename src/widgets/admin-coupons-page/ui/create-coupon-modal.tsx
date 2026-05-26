"use client";

import type {
	AdminCouponDetail,
	CouponType,
	useCouponMutations,
} from "@/entities/admin-coupon";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { X } from "lucide-react";
import { useCreateCouponModal } from "../model/use-create-coupon-modal";

const PLAN_STYLES: Record<string, string> = {
	BASIC: "bg-acc-bg border-acc text-acc-t",
	PRO: "bg-grn-bg border-grn text-grn-t",
	PREMIUM: "bg-pur-bg border-pur text-pur-t",
	LIFETIME: "bg-amb-bg border-amb text-amb-t",
};

interface Props {
	editing?: AdminCouponDetail | null;
	mutations: ReturnType<typeof useCouponMutations>;
	onClose: () => void;
}

export const CreateCouponModal = ({ editing, mutations, onClose }: Props) => {
	const {
		t,
		plans,
		isEdit,
		isPending,
		form,
		errors,
		handleSubmit,
		handleCodeChange,
		handleGenerateCodeClick,
		handleNameChange,
		handleAmountChange,
		handleMaxRedemptionsChange,
		handleMaxPerUserChange,
		handleAllPlansClick,
		handleValidFromChange,
		handleValidUntilChange,
		handleNewUsersOnlyChange,
		handleIsStackableChange,
		handleTypeClick,
		handlePlanClick,
	} = useCreateCouponModal({
		editing,
		mutations,
		onClose,
	});

	return (
		<form action={handleSubmit}>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography
					tag="h2"
					className="font-display text-[14px] font-semibold text-t-1"
				>
					{isEdit
						? t("admin.coupons.modal.titleEdit")
						: t("admin.coupons.modal.titleNew")}
				</Typography>
				<Button
					size={"bare"}
					onClick={onClose}
					title={t("admin.coupons.modal.cancel")}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<X className="size-3" />
				</Button>
			</div>

			{/* Body */}
			<div className="max-h-[70vh] overflow-y-auto p-4">
				{/* Code + random */}
				<div className="mb-3">
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.coupons.modal.code")}
						<Typography tag="span" className="ml-1 text-red-t">
							*
						</Typography>
					</Typography>
					<div className="flex gap-1.5">
						<Input
							value={form.code}
							onChange={handleCodeChange}
							placeholder={t("admin.coupons.modal.codePlaceholder")}
							aria-label={t("admin.coupons.modal.code")}
							aria-invalid={Boolean(errors.code)}
							aria-describedby={errors.code ? "coupon-code-error" : undefined}
							className={cn(
								"flex-1 rounded-[8px] font-mono text-[14px] font-bold uppercase tracking-[1px] focus:bg-surf",
								errors.code ? "border-red" : "",
							)}
						/>
						<Button
							onClick={handleGenerateCodeClick}
							title={t("admin.coupons.modal.random")}
							className="h-[34px] shrink-0 rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
						>
							{t("admin.coupons.modal.random")}
						</Button>
					</div>
					{errors.code && (
						<Typography id="coupon-code-error" tag="p" className="mt-1 text-[11px] text-red-t">
							{errors.code}
						</Typography>
					)}
				</div>

				{/* Name */}
				<div className="mb-3">
					<Typography
						tag="label"
						className="mb-1 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.coupons.modal.name")}
					</Typography>
					<Input
						value={form.name}
						onChange={handleNameChange}
						placeholder={t("admin.coupons.modal.namePlaceholder")}
						aria-label={t("admin.coupons.modal.name")}
						className="rounded-[8px] focus:bg-surf"
					/>
				</div>

				{/* Type toggle + amount */}
				<div className="mb-3 grid grid-cols-2 gap-2.5">
					<div>
						<Typography
							tag="label"
							className="mb-1 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.coupons.modal.type")}
						</Typography>
						<div className="flex gap-1">
							{(["PERCENT", "FIXED"] as CouponType[]).map(tp => {
								return (
									<Button
										key={tp}
										data-type={tp}
										onClick={handleTypeClick}
										title={tp === "PERCENT" ? t("admin.coupons.modal.typePercent") : t("admin.coupons.modal.typeFixed")}
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
									</Button>
								);
							})}
						</div>
					</div>
					<div>
						<Typography
							tag="label"
							className="mb-1 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.coupons.modal.amount")}
							<Typography tag="span" className="ml-1 text-red-t">
								*
							</Typography>
						</Typography>
						<Input
							type="number"
							min="0"
							max={form.type === "PERCENT" ? 100 : undefined}
							step="1"
							value={form.amount}
							onChange={handleAmountChange}
							aria-label={t("admin.coupons.modal.amount")}
							aria-invalid={Boolean(errors.amount)}
							aria-describedby={errors.amount ? "coupon-amount-error" : undefined}
							className={cn(
								"rounded-[8px] focus:bg-surf",
								errors.amount ? "border-red" : "",
							)}
						/>
						{errors.amount && (
							<Typography id="coupon-amount-error" tag="p" className="mt-1 text-[11px] text-red-t">
								{errors.amount}
							</Typography>
						)}
					</div>
				</div>

				{/* Max redemptions + per user */}
				<div className="mb-3 grid grid-cols-2 gap-2.5">
					<div>
						<Typography
							tag="label"
							className="mb-1 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.coupons.modal.maxRedemptions")}
							<Typography
								tag="span"
								className="ml-1 text-[10.5px] font-normal text-t-3"
							>
								{t("admin.coupons.modal.optional")}
							</Typography>
						</Typography>
						<Input
							type="number"
							min="1"
							value={form.maxRedemptions}
							onChange={handleMaxRedemptionsChange}
							placeholder="∞"
							aria-label={t("admin.coupons.modal.maxRedemptions")}
							className="rounded-[8px] focus:bg-surf"
						/>
					</div>
					<div>
						<Typography
							tag="label"
							className="mb-1 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.coupons.modal.maxPerUser")}
						</Typography>
						<Input
							type="number"
							min="1"
							value={form.maxPerUser}
							onChange={handleMaxPerUserChange}
							aria-label={t("admin.coupons.modal.maxPerUser")}
							className="rounded-[8px] focus:bg-surf"
						/>
					</div>
				</div>

				{/* Applicable plans */}
				<div className="mb-3">
					<Typography
						tag="label"
						className="mb-1.5 block text-[11.5px] font-medium text-t-2"
					>
						{t("admin.coupons.modal.plans")}
					</Typography>
					<div className="flex flex-wrap gap-1.5">
						<Button
							onClick={handleAllPlansClick}
							title={t("admin.coupons.modal.plansAll")}
							className={cn(
								"h-7 rounded-[6px] border px-2.5 text-[11.5px] transition-colors",
								form.applicablePlans.length === 0
									? "border-acc bg-acc-bg font-semibold text-acc-t"
									: "border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3",
							)}
						>
							{t("admin.coupons.modal.plansAll")}
						</Button>
						{plans.map(p => {
							return (
								<Button
									key={p}
									data-plan={p}
									onClick={handlePlanClick}
									title={p.charAt(0) + p.slice(1).toLowerCase()}
									className={cn(
										"h-7 rounded-[6px] border px-2.5 text-[11.5px] font-semibold transition-colors",
										form.applicablePlans.includes(p)
											? PLAN_STYLES[p]
											: "border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3",
									)}
								>
									{p.charAt(0) + p.slice(1).toLowerCase()}
								</Button>
							);
						})}
					</div>
				</div>

				{/* Dates */}
				<div className="mb-3 grid grid-cols-2 gap-2.5">
					<div>
						<Typography
							tag="label"
							className="mb-1 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.coupons.modal.validFrom")}
						</Typography>
						<Input
							type="date"
							value={form.validFrom}
							onChange={handleValidFromChange}
							aria-label={t("admin.coupons.modal.validFrom")}
							className="rounded-[8px] focus:bg-surf"
						/>
					</div>
					<div>
						<Typography
							tag="label"
							className="mb-1 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.coupons.modal.validUntil")}
						</Typography>
						<Input
							type="date"
							value={form.validUntil}
							onChange={handleValidUntilChange}
							aria-label={t("admin.coupons.modal.validUntil")}
							aria-invalid={Boolean(errors.validUntil)}
							aria-describedby={errors.validUntil ? "coupon-validuntil-error" : undefined}
							className={cn(
								"rounded-[8px] focus:bg-surf",
								errors.validUntil ? "border-red" : "",
							)}
						/>
						{errors.validUntil && (
							<Typography id="coupon-validuntil-error" tag="p" className="mt-1 text-[11px] text-red-t">
								{errors.validUntil}
							</Typography>
						)}
					</div>
				</div>

				{/* Checkboxes */}
				<div className="flex flex-wrap gap-4">
					<Typography
						tag="label"
						className="flex cursor-pointer items-center gap-2"
					>
						<input
							type="checkbox"
							checked={form.newUsersOnly}
							onChange={handleNewUsersOnlyChange}
							className="h-3.5 w-3.5 cursor-pointer accent-acc"
						/>
						<Typography tag="span" className="text-[12.5px] text-t-2">
							{t("admin.coupons.modal.newUsersOnly")}
						</Typography>
					</Typography>
					<Typography
						tag="label"
						className="flex cursor-pointer items-center gap-2"
					>
						<input
							type="checkbox"
							checked={form.isStackable}
							onChange={handleIsStackableChange}
							className="h-3.5 w-3.5 cursor-pointer accent-acc"
						/>
						<Typography tag="span" className="text-[12.5px] text-t-2">
							{t("admin.coupons.modal.isStackable")}
						</Typography>
					</Typography>
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<Button
					onClick={onClose}
					title={t("admin.coupons.modal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.coupons.modal.cancel")}
				</Button>
				<Button
					type="submit"
					disabled={isPending}
					title={isEdit ? t("admin.coupons.modal.save") : t("admin.coupons.modal.create")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{isEdit
						? t("admin.coupons.modal.save")
						: t("admin.coupons.modal.create")}
				</Button>
			</div>
		</form>
	);
};
