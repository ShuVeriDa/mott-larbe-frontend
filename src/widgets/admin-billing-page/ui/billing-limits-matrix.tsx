"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminPlan, PlanLimits, PlanType } from "@/entities/admin-billing";

const PLAN_BADGE: Record<PlanType, string> = {
	FREE: "bg-surf-3 text-t-2",
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

interface LimitRow {
	key: keyof PlanLimits;
	labelKey: string;
	format: "bool" | "unlimited";
}

const LIMIT_ROWS: LimitRow[] = [
	{ key: "translationsPerDay", labelKey: "admin.plans.limitsMatrix.translationsPerDay", format: "unlimited" },
	{ key: "wordsInDictionary",  labelKey: "admin.plans.limitsMatrix.wordsInDictionary",  format: "unlimited" },
	{ key: "availableTexts",     labelKey: "admin.plans.limitsMatrix.availableTexts",     format: "unlimited" },
	{ key: "statisticsDays",     labelKey: "admin.plans.limitsMatrix.statisticsDays",     format: "unlimited" },
	{ key: "maxFolders",         labelKey: "admin.plans.limitsMatrix.maxFolders",         format: "unlimited" },
	{ key: "readTexts",          labelKey: "admin.plans.limitsMatrix.readTexts",          format: "bool" },
	{ key: "wordTranslation",    labelKey: "admin.plans.limitsMatrix.wordTranslation",    format: "bool" },
	{ key: "tokenAnalysis",      labelKey: "admin.plans.limitsMatrix.tokenAnalysis",      format: "bool" },
	{ key: "personalDictionary", labelKey: "admin.plans.limitsMatrix.personalDictionary", format: "bool" },
	{ key: "dictionaryFolders",  labelKey: "admin.plans.limitsMatrix.dictionaryFolders",  format: "bool" },
	{ key: "hasComplexTexts",    labelKey: "admin.plans.limitsMatrix.hasComplexTexts",    format: "bool" },
	{ key: "spaceRepetition",    labelKey: "admin.plans.limitsMatrix.spaceRepetition",    format: "bool" },
	{ key: "hasFlashcards",      labelKey: "admin.plans.limitsMatrix.hasFlashcards",      format: "bool" },
	{ key: "analytics",          labelKey: "admin.plans.limitsMatrix.analytics",          format: "bool" },
	{ key: "hasAdvancedAnalytics", labelKey: "admin.plans.limitsMatrix.hasAdvancedAnalytics", format: "bool" },
	{ key: "hasPrioritySupport", labelKey: "admin.plans.limitsMatrix.hasPrioritySupport", format: "bool" },
];

const CellValue = ({
	value,
	format,
	unlimitedLabel,
}: {
	value: unknown;
	format: LimitRow["format"];
	unlimitedLabel: string;
}) => {
	if (format === "bool") {
		return value === true
			? <Typography tag="span" className="font-semibold text-grn-t">✓</Typography>
			: <Typography tag="span" className="text-t-4">—</Typography>;
	}
	if (value === -1 || value === null || value === undefined)
		return <Typography tag="span" className="font-semibold text-acc-t">{unlimitedLabel}</Typography>;
	if (typeof value === "number")
		return <Typography tag="span" className="font-medium text-t-2">{value.toLocaleString("ru-RU")}</Typography>;
	return <Typography tag="span" className="text-t-4">—</Typography>;
};

interface BillingLimitsMatrixProps {
	plans: AdminPlan[];
	isLoading: boolean;
}

export const BillingLimitsMatrix = ({ plans, isLoading }: BillingLimitsMatrixProps) => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("admin.plans.limitsMatrix.title")}
				</Typography>
			</div>
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
				{isLoading ? (
					<div className="space-y-3 p-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="h-9 animate-pulse rounded-lg bg-surf-3" />
						))}
					</div>
				) : (
					<table className="w-full border-collapse text-[12.5px]">
						<thead>
							<tr>
								<th className="w-44 border-b border-bd-1 px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.4px] text-t-3">
									{t("admin.plans.limitsMatrix.parameter")}
								</th>
								{plans.map((plan) => (
									<th
										key={plan.id}
										className="border-b border-bd-1 px-2.5 py-2 text-center text-[11px]"
									>
										<Typography tag="span"
											className={`inline-flex items-center rounded-[6px] px-2 py-0.5 text-[11px] font-semibold ${PLAN_BADGE[plan.type] ?? "bg-surf-3 text-t-2"}`}
										>
											{plan.name}
										</Typography>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{LIMIT_ROWS.map((row) => (
								<tr key={row.key} className="border-b border-bd-1 last:border-b-0">
									<td className="px-4 py-2.5 text-[12.5px] text-t-1">
										{t(row.labelKey)}
									</td>
									{plans.map((plan) => (
										<td
											key={plan.id}
											className="px-2.5 py-2.5 text-center text-[12.5px]"
										>
											<CellValue
												value={plan.limits[row.key]}
												format={row.format}
												unlimitedLabel={t("admin.plans.limitsMatrix.unlimited")}
											/>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};
