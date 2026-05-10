"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import type { AdminPlan, PlanLimits } from "@/entities/admin-billing";
import { useBillingLimitsModal } from "../model/use-billing-limits-modal";

interface BillingLimitsModalProps {
	open: boolean;
	plan: AdminPlan | null;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (id: string, limits: Partial<PlanLimits>) => void;
}

export const BillingLimitsModal = ({
	open,
	plan,
	isPending,
	onClose,
	onSubmit,
}: BillingLimitsModalProps) => {
	const {
		t,
		numericFields,
		boolFields,
		numeric,
		bools,
		handleSubmit,
		handleContainerClick,
		handleNumericChange,
		handleBoolChange,
	} = useBillingLimitsModal({
		open,
		plan,
		onSubmit,
	});

	if (!open || !plan) return null;

	return (
		<div
			className="fixed inset-0 z-400 flex items-end justify-center bg-black/35 sm:items-center sm:p-4"
			onClick={onClose}
		>
			<div
				className="flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[14px] bg-surf shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:rounded-[14px]"
				onClick={handleContainerClick}
			>
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-[18px] py-4">
					<Typography tag="span" className="font-display text-[14px] font-semibold text-t-1">
						{t("admin.plans.limitsModal.title")}: {plan.name}
					</Typography>
					<Button
						onClick={onClose}
						className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
					>
						<X className="size-3" />
					</Button>
				</div>

				{/* Body */}
				<form
					id="limits-form"
					onSubmit={handleSubmit}
					className="min-h-0 flex-1 overflow-y-auto px-[18px] py-4 [&::-webkit-scrollbar]:w-0"
				>
					{/* Numeric */}
					<div className="mb-4">
						<div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-t-3">
							{t("admin.plans.limitsModal.numericSection")}
						</div>
						<Typography tag="p" className="mb-3 text-[11.5px] text-t-3">
							{t("admin.plans.limitsModal.unlimitedHint")}
						</Typography>
						<div className="space-y-2.5">
							{numericFields.map(({ key, label }) => {
							  return (
								<div key={key as string} className="flex items-center gap-3">
									<Typography tag="label" className="w-40 shrink-0 text-[12.5px] text-t-1">{label}</Typography>
									<input
										type="number"
										min={-1}
										value={numeric[key as string] ?? "-1"}
										data-field={key as string}
										onChange={handleNumericChange}
										className="h-[32px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf"
									/>
								</div>
							);
							})}
						</div>
					</div>

					{/* Boolean */}
					<div>
						<div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-t-3">
							{t("admin.plans.limitsModal.featuresSection")}
						</div>
						<div className="space-y-2">
							{boolFields.map(({ key, label }) => {
							  return (
								<div key={key as string} className="flex items-center justify-between">
									<Typography tag="span" className="text-[12.5px] text-t-1">{label}</Typography>
									<Typography tag="label" className="relative h-[18px] w-8 cursor-pointer">
										<input
											type="checkbox"
											className="peer sr-only"
											checked={bools[key as string] ?? false}
											data-field={key as string}
											onChange={handleBoolChange}
										/>
										<Typography tag="span" className="absolute inset-0 rounded-full border border-bd-2 bg-surf-3 transition-colors peer-checked:border-acc peer-checked:bg-acc" />
										<Typography tag="span" className="absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-3.5" />
									</Typography>
								</div>
							);
							})}
						</div>
					</div>
				</form>

				{/* Footer */}
				<div className="flex shrink-0 items-center justify-end gap-2 border-t border-bd-1 px-[18px] py-3">
					<Button
						onClick={onClose}
						className="h-8 rounded-[8px] border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("admin.plans.limitsModal.cancel")}
					</Button>
					<Button
						type="submit"
						form="limits-form"
						disabled={isPending}
						className="h-8 rounded-[8px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						{t("admin.plans.limitsModal.save")}
					</Button>
				</div>
			</div>
		</div>
	);
};
