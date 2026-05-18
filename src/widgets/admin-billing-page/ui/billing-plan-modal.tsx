"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ComponentProps, useEffect, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { X } from "lucide-react";
import type { AdminPlan, CreatePlanDto, PlanInterval, PlanType, UpdatePlanDto } from "@/entities/admin-billing";
import { Select } from "@/shared/ui/select";

interface BillingPlanModalProps {
	open: boolean;
	mode: "create" | "edit";
	plan?: AdminPlan | null;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (dto: CreatePlanDto | UpdatePlanDto) => void;
}

const PLAN_TYPES: PlanType[] = ["FREE", "BASIC", "PRO", "PREMIUM", "LIFETIME"];
const INTERVALS: { value: PlanInterval; label: string }[] = [
	{ value: "month", label: "Месяц" },
	{ value: "year", label: "Год" },
	{ value: null, label: "Разово (lifetime/free)" },
];

const empty = {
	name: "",
	type: "PRO" as PlanType,
	priceCents: "",
	interval: "month" as PlanInterval,
	description: "",
	isActive: true,
};

export const BillingPlanModal = ({
	open,
	mode,
	plan,
	isPending,
	onClose,
	onSubmit,
}: BillingPlanModalProps) => {
	const { t } = useI18n();
	const [form, setForm] = useState(empty);

	useEffect(() => {
		if (!open) return;
		if (mode === "edit" && plan) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate edit form from selected plan
			setForm({
				name: plan.name,
				type: plan.type,
				priceCents: String(plan.priceCents / 100),
				interval: plan.interval,
				description: plan.description ?? "",
				isActive: plan.isActive,
			});
		} else {
			setForm(empty);
		}
	}, [open, mode, plan]);

	const set = <K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) =>
		setForm((prev) => ({ ...prev, [key]: value }));

	const handleSubmit = () => {
		if (!form.name.trim()) return;

		if (mode === "edit") {
			const dto: UpdatePlanDto = {
				name: form.name.trim(),
				priceCents: Math.round(Number(form.priceCents) * 100),
				description: form.description.trim() || undefined,
				isActive: form.isActive,
			};
			onSubmit(dto);
		} else {
			const dto: CreatePlanDto = {
				name: form.name.trim(),
				code: `${form.type}_${form.interval?.toUpperCase() ?? "LIFETIME"}`,
				type: form.type,
				priceCents: Math.round(Number(form.priceCents) * 100),
				interval: form.interval,
				description: form.description.trim() || undefined,
				isActive: form.isActive,
			};
			onSubmit(dto);
		}
	};

	if (!open) return null;

	const handleInnerClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => e.stopPropagation();
	const handleNameChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("name", e.currentTarget.value);
	const handleTypeChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => set("type", e.currentTarget.value as PlanType);
	const handleIntervalChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => set("interval", (e.currentTarget.value || null) as PlanInterval);
	const handlePriceChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("priceCents", e.currentTarget.value);
	const handleDescriptionChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("description", e.currentTarget.value);
	const handleActiveChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("isActive", e.currentTarget.checked);
return (
		<div
			className="fixed inset-0 z-400 flex items-end justify-center bg-black/35 sm:items-center sm:p-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-[500px] overflow-hidden rounded-t-[14px] bg-surf shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-transform sm:rounded-[14px]"
				onClick={handleInnerClick}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-bd-1 px-[18px] py-4">
					<Typography tag="span" className="font-display text-[14px] font-semibold text-t-1">
						{mode === "create"
							? t("admin.plans.planModal.titleNew")
							: t("admin.plans.planModal.titleEdit")}
					</Typography>
					<Button
						onClick={onClose}
						title={t("admin.plans.planModal.cancel")}
						className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
					>
						<X className="size-3" />
					</Button>
				</div>

				{/* Body */}
				<form action={handleSubmit} id="plan-form">
					<div className="space-y-3.5 px-[18px] py-4">
						<div>
							<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.name")}
							</Typography>
							<Input
								value={form.name}
								onChange={handleNameChange}
								placeholder={t("admin.plans.planModal.namePlaceholder")}
								aria-label={t("admin.plans.planModal.name")}
								className="rounded-[8px] focus:bg-surf"
							/>
						</div>

						{mode === "create" && (
							<div className="grid grid-cols-2 gap-2.5">
								<div>
									<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
										{t("admin.plans.planModal.type")}
									</Typography>
									<Select
										variant="lg"
										value={form.type}
										onChange={handleTypeChange}
									>
										{PLAN_TYPES.map((pt) => (
											<option key={pt} value={pt}>{pt}</option>
										))}
									</Select>
								</div>
								<div>
									<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
										{t("admin.plans.planModal.interval")}
									</Typography>
									<Select
										variant="lg"
										value={form.interval ?? ""}
										onChange={handleIntervalChange}
									>
										{INTERVALS.map(({ value, label }) => (
											<option key={value ?? "null"} value={value ?? ""}>{label}</option>
										))}
									</Select>
								</div>
							</div>
						)}

						<div>
							<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.price")} ₽
							</Typography>
							<Input
								type="number"
								min={0}
								step="0.01"
								value={form.priceCents}
								onChange={handlePriceChange}
								placeholder="690"
								aria-label={`${t("admin.plans.planModal.price")} ₽`}
								className="rounded-[8px] focus:bg-surf"
							/>
						</div>

						<div>
							<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.description")}
							</Typography>
							<Input
								value={form.description}
								onChange={handleDescriptionChange}
								placeholder={t("admin.plans.planModal.descriptionPlaceholder")}
								aria-label={t("admin.plans.planModal.description")}
								className="rounded-[8px] focus:bg-surf"
							/>
						</div>

						<div className="flex items-center justify-between">
							<Typography tag="span" className="text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.showToUsers")}
							</Typography>
							<Typography tag="label" className="relative h-[18px] w-8 cursor-pointer">
								<input
									type="checkbox"
									className="peer sr-only"
									checked={form.isActive}
									onChange={handleActiveChange}
								/>
								<Typography tag="span" className="absolute inset-0 rounded-full border border-bd-2 bg-surf-3 transition-colors peer-checked:border-acc peer-checked:bg-acc" />
								<Typography tag="span" className="absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-3.5" />
							</Typography>
						</div>
					</div>
				</form>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-[18px] py-3">
					<Button
						onClick={onClose}
						title={t("admin.plans.planModal.cancel")}
						className="h-8 rounded-[8px] border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("admin.plans.planModal.cancel")}
					</Button>
					<Button
						type="submit"
						form="plan-form"
						disabled={isPending || !form.name.trim()}
						title={t("admin.plans.planModal.save")}
						className="h-8 rounded-[8px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						{t("admin.plans.planModal.save")}
					</Button>
				</div>
			</div>
		</div>
	);
};
