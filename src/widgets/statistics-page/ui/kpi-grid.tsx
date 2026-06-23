"use client";

import type { KpiSparklines, StatsHeader } from "@/entities/statistics";
import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { motion } from "framer-motion";
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
		<motion.section
			aria-label={t("statistics.pageTitle")}
			className="grid grid-cols-4 gap-2 max-md:grid-cols-2"
			variants={variants.staggerContainer}
			initial="hidden"
			animate="visible"
		>
			{items.map(item => (
				<motion.div key={item.label} variants={variants.staggerItem}>
					<KpiCard {...item} />
				</motion.div>
			))}
		</motion.section>
	);
};
