"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminPlan, PlanLimits } from "@/entities/admin-billing";

interface BillingLimitsModalProps {
	open: boolean;
	plan: AdminPlan | null;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (id: string, limits: Partial<PlanLimits>) => void;
}

interface NumericField {
	key: keyof PlanLimits;
	label: string;
}

interface BoolField {
	key: keyof PlanLimits;
	label: string;
}

const NUMERIC_FIELDS: NumericField[] = [
	{ key: "translationsPerDay", label: "Переводов в день" },
	{ key: "wordsInDictionary",  label: "Слов в словаре" },
	{ key: "availableTexts",     label: "Доступных текстов" },
	{ key: "statisticsDays",     label: "Дней статистики" },
	{ key: "maxFolders",         label: "Папок словаря" },
];

const BOOL_FIELDS: BoolField[] = [
	{ key: "readTexts",            label: "Чтение текстов" },
	{ key: "wordTranslation",      label: "Перевод слов" },
	{ key: "tokenAnalysis",        label: "Анализ токенов" },
	{ key: "personalDictionary",   label: "Личный словарь" },
	{ key: "dictionaryFolders",    label: "Папки словаря" },
	{ key: "hasComplexTexts",      label: "Сложные тексты" },
	{ key: "textProgress",         label: "Прогресс чтения" },
	{ key: "spaceRepetition",      label: "Система повторений" },
	{ key: "hasFlashcards",        label: "Флэш-карточки" },
	{ key: "wordContexts",         label: "Контексты слов" },
	{ key: "analytics",            label: "Статистика" },
	{ key: "hasAdvancedAnalytics", label: "Расш. аналитика" },
	{ key: "hasPrioritySupport",   label: "Приоритетная поддержка" },
];

type NumericState = Record<string, string>;
type BoolState = Record<string, boolean>;

const buildInitialNumeric = (limits: PlanLimits): NumericState => {
	const out: NumericState = {};
	for (const { key } of NUMERIC_FIELDS) {
		const v = limits[key as keyof PlanLimits];
		out[key as string] = v !== undefined ? String(v) : "-1";
	}
	return out;
};

const buildInitialBool = (limits: PlanLimits): BoolState => {
	const out: BoolState = {};
	for (const { key } of BOOL_FIELDS) {
		out[key as string] = Boolean(limits[key as keyof PlanLimits]);
	}
	return out;
};

export const BillingLimitsModal = ({
	open,
	plan,
	isPending,
	onClose,
	onSubmit,
}: BillingLimitsModalProps) => {
	const { t } = useI18n();
	const [numeric, setNumeric] = useState<NumericState>({});
	const [bools, setBools] = useState<BoolState>({});

	useEffect(() => {
		if (!open || !plan) return;
		setNumeric(buildInitialNumeric(plan.limits));
		setBools(buildInitialBool(plan.limits));
	}, [open, plan]);

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!plan) return;

		const limits: Partial<PlanLimits> = { ...plan.limits };
		for (const { key } of NUMERIC_FIELDS) {
			(limits as Record<string, unknown>)[key as string] = Number(numeric[key as string] ?? -1);
		}
		for (const { key } of BOOL_FIELDS) {
			(limits as Record<string, unknown>)[key as string] = bools[key as string] ?? false;
		}
		onSubmit(plan.id, limits);
	};

	if (!open || !plan) return null;

		const handleClick: NonNullable<React.ComponentProps<"div">["onClick"]> = (e) => e.stopPropagation();
return (
		<div
			className="fixed inset-0 z-400 flex items-end justify-center bg-black/35 sm:items-center sm:p-4"
			onClick={onClose}
		>
			<div
				className="flex max-h-[90vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[14px] bg-surf shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:rounded-[14px]"
				onClick={handleClick}
			>
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-[18px] py-4">
					<span className="font-display text-[14px] font-semibold text-t-1">
						{t("admin.plans.limitsModal.title")}: {plan.name}
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
						<p className="mb-3 text-[11.5px] text-t-3">
							{t("admin.plans.limitsModal.unlimitedHint")}
						</p>
						<div className="space-y-2.5">
							{NUMERIC_FIELDS.map(({ key, label }) => {
							  const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) =>
											setNumeric((prev) => ({ ...prev, [key as string]: e.target.value }));
							  return (
								<div key={key as string} className="flex items-center gap-3">
									<label className="w-40 shrink-0 text-[12.5px] text-t-1">{label}</label>
									<input
										type="number"
										min={-1}
										value={numeric[key as string] ?? "-1"}
										onChange={handleChange
										}
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
							{BOOL_FIELDS.map(({ key, label }) => {
							  const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) =>
												setBools((prev) => ({ ...prev, [key as string]: e.target.checked }));
							  return (
								<div key={key as string} className="flex items-center justify-between">
									<span className="text-[12.5px] text-t-1">{label}</span>
									<label className="relative h-[18px] w-8 cursor-pointer">
										<input
											type="checkbox"
											className="peer sr-only"
											checked={bools[key as string] ?? false}
											onChange={handleChange
											}
										/>
										<span className="absolute inset-0 rounded-full border border-bd-2 bg-surf-3 transition-colors peer-checked:border-acc peer-checked:bg-acc" />
										<span className="absolute left-0.5 top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-3.5" />
									</label>
								</div>
							);
							})}
						</div>
					</div>
				</form>

				{/* Footer */}
				<div className="flex shrink-0 items-center justify-end gap-2 border-t border-bd-1 px-[18px] py-3">
					<button
						type="button"
						onClick={onClose}
						className="h-8 rounded-[8px] border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("admin.plans.limitsModal.cancel")}
					</button>
					<button
						type="submit"
						form="limits-form"
						disabled={isPending}
						className="h-8 rounded-[8px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						{t("admin.plans.limitsModal.save")}
					</button>
				</div>
			</div>
		</div>
	);
};
