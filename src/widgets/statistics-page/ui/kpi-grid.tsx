"use client";

import type { KpiSparklines, StatsHeader } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { buildKpiItems } from "../lib/kpi-items";
import { KpiCard } from "./kpi-card";

interface KpiGridProps {
	header: StatsHeader;
	sparklines: KpiSparklines;
}

export const KpiGrid = ({ header, sparklines }: KpiGridProps) => {
	const { t } = useI18n();
	const items = buildKpiItems(header, sparklines, t);

	return (
		<section aria-label={t("statistics.pageTitle")} className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
			{items.map(item => (
				<KpiCard key={item.label} {...item} />
			))}
		</section>
	);
};
