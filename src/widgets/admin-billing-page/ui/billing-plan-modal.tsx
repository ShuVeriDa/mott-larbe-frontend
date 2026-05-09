"use client";
import { ComponentProps, SyntheticEvent, useEffect, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminPlan, CreatePlanDto, PlanInterval, PlanType, UpdatePlanDto } from "@/entities/admin-billing";

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

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
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

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => e.stopPropagation();
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("name", e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => set("type", e.currentTarget.value as PlanType);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => set("interval", (e.currentTarget.value || null) as PlanInterval);
	const handleChange4: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("priceCents", e.currentTarget.value);
	const handleChange5: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("description", e.currentTarget.value);
	const handleChange6: NonNullable<ComponentProps<"input">["onChange"]> = (e) => set("isActive", e.currentTarget.checked);
return (
		<div
			className="fixed inset-0 z-400 flex items-end justify-center bg-black/35 sm:items-center sm:p-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-[500px] overflow-hidden rounded-t-[14px] bg-surf shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-transform sm:rounded-[14px]"
				onClick={handleClick}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-bd-1 px-[18px] py-4">
					<span className="font-display text-[14px] font-semibold text-t-1">
						{mode === "create"
							? t("admin.plans.planModal.titleNew")
							: t("admin.plans.planModal.titleEdit")}
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
				<form onSubmit={handleSubmit} id="plan-form">
					<div className="space-y-3.5 px-[18px] py-4">
						<div>
							<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.name")}
							</label>
							<input
								value={form.name}
								onChange={handleChange}
								placeholder={t("admin.plans.planModal.namePlaceholder")}
								className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
							/>
						</div>

						{mode === "create" && (
							<div className="grid grid-cols-2 gap-2.5">
								<div>
									<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
										{t("admin.plans.planModal.type")}
									</label>
									<select
										value={form.type}
										onChange={handleChange2}
										className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf"
									>
										{PLAN_TYPES.map((pt) => (
											<option key={pt} value={pt}>{pt}</option>
										))}
									</select>
								</div>
								<div>
									<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
										{t("admin.plans.planModal.interval")}
									</label>
									<select
										value={form.interval ?? ""}
										onChange={handleChange3}
										className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none focus:border-acc focus:bg-surf"
									>
										{INTERVALS.map(({ value, label }) => (
											<option key={value ?? "null"} value={value ?? ""}>{label}</option>
										))}
									</select>
								</div>
							</div>
						)}

						<div>
							<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.price")} ₽
							</label>
							<input
								type="number"
								min={0}
								step="0.01"
								value={form.priceCents}
								onChange={handleChange4}
								placeholder="690"
								className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
							/>
						</div>

						<div>
							<label className="mb-1.5 block text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.description")}
							</label>
							<input
								value={form.description}
								onChange={handleChange5}
								placeholder={t("admin.plans.planModal.descriptionPlaceholder")}
								className="h-[34px] w-full rounded-[8px] border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf"
							/>
						</div>

						<div className="flex items-center justify-between">
							<span className="text-[11.5px] font-medium text-t-2">
								{t("admin.plans.planModal.showToUsers")}
							</span>
							<label className="relative h-[18px] w-8 cursor-pointer">
								<input
									type="checkbox"
									className="peer sr-only"
									checked={form.isActive}
									onChange={handleChange6}
								/>
								<span className="absolute inset-0 rounded-full border border-bd-2 bg-surf-3 transition-colors peer-checked:border-acc peer-checked:bg-acc" />
								<span className="absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-3.5" />
							</label>
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
						{t("admin.plans.planModal.cancel")}
					</button>
					<button
						type="submit"
						form="plan-form"
						disabled={isPending || !form.name.trim()}
						className="h-8 rounded-[8px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						{t("admin.plans.planModal.save")}
					</button>
				</div>
			</div>
		</div>
	);
};
