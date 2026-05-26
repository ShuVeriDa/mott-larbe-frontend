"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
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
		handleNumericChange,
		handleBoolChange,
	} = useBillingLimitsModal({
		open,
		plan,
		onSubmit,
	});

	return (
		<Modal
			open={open && !!plan}
			onClose={onClose}
			title={plan ? `${t("admin.plans.limitsModal.title")}: ${plan.name}` : t("admin.plans.limitsModal.title")}
			className="max-w-[520px]"
		>
			<form
				id="limits-form"
				onSubmit={handleSubmit}
				className="flex flex-col gap-4"
			>
				{/* Numeric */}
				<div>
					<div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-t-3">
						{t("admin.plans.limitsModal.numericSection")}
					</div>
					<Typography tag="p" className="mb-3 text-[11.5px] text-t-3">
						{t("admin.plans.limitsModal.unlimitedHint")}
					</Typography>
					<div className="space-y-2.5">
						{numericFields.map(({ key, label }) => (
							<div key={key as string} className="flex items-center gap-3">
								<Typography tag="label" className="w-40 shrink-0 text-[12.5px] text-t-1">{label}</Typography>
								<Input
									type="number"
									min={-1}
									value={numeric[key as string] ?? "-1"}
									data-field={key as string}
									onChange={handleNumericChange}
									aria-label={label}
									className="h-[32px] rounded-[8px] focus:bg-surf"
								/>
							</div>
						))}
					</div>
				</div>

				{/* Boolean */}
				<div>
					<div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.4px] text-t-3">
						{t("admin.plans.limitsModal.featuresSection")}
					</div>
					<div className="space-y-2">
						{boolFields.map(({ key, label }) => (
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
						))}
					</div>
				</div>
			</form>

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.plans.limitsModal.cancel")}
				</Button>
				<Button
					variant="action"
					type="submit"
					form="limits-form"
					disabled={isPending}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
				>
					{t("admin.plans.limitsModal.save")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
