"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { usePlans, UNLIMITED_SYMBOL, type Plan } from "@/entities/subscription";
import { ProfileCard as SettingCard } from "../profile-card";

const CheckIcon = () => (
	<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-3 text-grn-t">
		<path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const DashIcon = () => (
	<span className="inline-block w-3 text-center text-[12px] text-t-4">—</span>
);

interface FeatureRow {
	label: string;
	free: string | boolean;
	premium: string | boolean;
	pro: string | boolean;
}

const buildRows = (
	freePlan: Plan | undefined,
	premiumPlan: Plan | undefined,
	proPlan: Plan | undefined,
	t: (k: string) => string,
): FeatureRow[] => {
	const fLimits = freePlan?.limits;
	const pmLimits = premiumPlan?.limits;
	const prLimits = proPlan?.limits;

	const fmtLimit = (v: number | undefined | null) =>
		v === undefined || v === null || v < 0 ? UNLIMITED_SYMBOL : String(v);

	return [
		{
			label: t("profile.planComparison.translationsPerDay"),
			free: fmtLimit(fLimits?.translationsPerDay),
			premium: fmtLimit(pmLimits?.translationsPerDay),
			pro: fmtLimit(prLimits?.translationsPerDay),
		},
		{
			label: t("profile.planComparison.wordsInDictionary"),
			free: fmtLimit(fLimits?.wordsInDictionary),
			premium: fmtLimit(pmLimits?.wordsInDictionary),
			pro: fmtLimit(prLimits?.wordsInDictionary),
		},
		{
			label: t("profile.planComparison.personalDictionary"),
			free: fLimits?.personalDictionary ?? true,
			premium: pmLimits?.personalDictionary ?? true,
			pro: prLimits?.personalDictionary ?? true,
		},
		{
			label: t("profile.planComparison.statistics"),
			free: fLimits?.analytics ?? false,
			premium: pmLimits?.analytics ?? true,
			pro: prLimits?.analytics ?? true,
		},
		{
			label: t("profile.planComparison.spaceRepetition"),
			free: fLimits?.spaceRepetition ?? false,
			premium: pmLimits?.spaceRepetition ?? true,
			pro: prLimits?.spaceRepetition ?? true,
		},
		{
			label: t("profile.planComparison.flashcards"),
			free: fLimits?.hasFlashcards ?? false,
			premium: pmLimits?.hasFlashcards ?? true,
			pro: prLimits?.hasFlashcards ?? true,
		},
		{
			label: t("profile.planComparison.complexTexts"),
			free: fLimits?.hasComplexTexts ?? false,
			premium: pmLimits?.hasComplexTexts ?? true,
			pro: prLimits?.hasComplexTexts ?? true,
		},
		{
			label: t("profile.planComparison.prioritySupport"),
			free: fLimits?.hasPrioritySupport ?? false,
			premium: pmLimits?.hasPrioritySupport ?? false,
			pro: prLimits?.hasPrioritySupport ?? true,
		},
	];
};

const CellValue = ({ value, color }: { value: string | boolean; color: string }) => {
	if (typeof value === "boolean") {
		return value ? <CheckIcon /> : <DashIcon />;
	}
	return (
		<Typography tag="span" className={`text-[12px] font-semibold ${color}`}>
			{value}
		</Typography>
	);
};

export const PlanComparisonCard = () => {
	const { t } = useI18n();
	const { data: plans } = usePlans();

	const allPlans = [
		...(plans?.groups.flatMap((g) => g.variants) ?? []),
		...(plans?.ungrouped ?? []),
	];

	const freePlan = allPlans.find((p) => p.type === "FREE");
	const premiumPlan = allPlans.find((p) => p.type === "PREMIUM");
	const proPlan = allPlans.find((p) => p.type === "PRO");

	const rows = buildRows(freePlan, premiumPlan, proPlan, t);

	return (
		<SettingCard title={t("profile.planComparison.title")} noBody>
			<div className="px-4 py-3.5">
				<div className="grid grid-cols-[1fr_repeat(3,68px)] gap-1.5 pb-2 mb-1 border-b border-hairline border-bd-1">
					<div />
					<div className="text-center text-[11px] font-semibold text-t-2">Free</div>
					<div className="text-center text-[11px] font-semibold text-acc-t">Premium</div>
					<div className="text-center text-[11px] font-semibold text-pur-t">Pro</div>
				</div>
				{rows.map((row, i) => (
					<div
						key={row.label}
						className={`grid grid-cols-[1fr_repeat(3,68px)] gap-1.5 py-[7px] ${i < rows.length - 1 ? "border-b border-hairline border-bd-1" : ""}`}
					>
						<span className="flex items-center text-[12px] text-t-2 leading-[1.3]">
							{row.label}
						</span>
						<div className="flex items-center justify-center">
							<CellValue value={row.free} color="text-t-2" />
						</div>
						<div className="flex items-center justify-center">
							<CellValue value={row.premium} color="text-acc-t" />
						</div>
						<div className="flex items-center justify-center">
							<CellValue value={row.pro} color="text-pur-t" />
						</div>
					</div>
				))}
			</div>
		</SettingCard>
	);
};
