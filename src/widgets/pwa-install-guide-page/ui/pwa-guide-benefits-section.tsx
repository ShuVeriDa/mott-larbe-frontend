"use client";

import { Globe, LayoutGrid, Smartphone, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

import { ease } from "@/shared/lib/animation";
import { Typography } from "@/shared/ui/typography";

import type { PwaGuideBenefitsText } from "../model/types";

interface PwaGuideBenefitsSectionProps {
	benefits: PwaGuideBenefitsText;
}

const sectionVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.enter } },
};

export const PwaGuideBenefitsSection = ({ benefits }: PwaGuideBenefitsSectionProps) => (
	<motion.section
		aria-labelledby="pwa-guide-benefits-title"
		className="flex flex-col gap-5 rounded-card border-[0.5px] border-bd-2 bg-surf-2 p-5"
		variants={sectionVariants}
		initial="hidden"
		whileInView="visible"
		viewport={{ once: true, margin: "-80px" }}
	>
		<Typography
			tag="h2"
			id="pwa-guide-benefits-title"
			size="lg"
			className="font-semibold text-t-1"
		>
			{benefits.title}
		</Typography>

		<div className="flex items-start gap-3">
			<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-acc/12 text-acc">
				<Smartphone className="h-4 w-4" aria-hidden="true" />
			</span>
			<Typography tag="p" size="sm" className="leading-relaxed text-t-1">
				{benefits.explainer}
			</Typography>
		</div>

		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surf text-t-2">
					<LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
				</span>
				<Typography tag="p" size="sm" className="text-t-2">
					{benefits.quickAccess}
				</Typography>
			</div>
			<div className="flex items-center gap-3">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surf text-t-2">
					<WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
				</span>
				<Typography tag="p" size="sm" className="text-t-2">
					{benefits.offline}
				</Typography>
			</div>
			<div className="flex items-center gap-3">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surf text-t-2">
					<Globe className="h-3.5 w-3.5" aria-hidden="true" />
				</span>
				<Typography tag="p" size="sm" className="text-t-2">
					{benefits.noStore}
				</Typography>
			</div>
		</div>
	</motion.section>
);
