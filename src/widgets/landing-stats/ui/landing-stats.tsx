"use client";

import { ease } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";

interface StatItem {
	prefixKey: string;
	emKey: string;
	labelKey: string;
}

const ITEMS: StatItem[] = [
	{
		prefixKey: "landing.stats.textsPrefix",
		emKey: "landing.stats.textsValue",
		labelKey: "landing.stats.texts",
	},
	// {
	// 	prefixKey: "landing.stats.wordsPrefix",
	// 	emKey: "landing.stats.wordsValue",
	// 	labelKey: "landing.stats.words",
	// },
	{
		prefixKey: "landing.stats.levelsPrefix",
		emKey: "landing.stats.levelsValue",
		labelKey: "landing.stats.levels",
	},
	{
		prefixKey: "landing.stats.systemsPrefix",
		emKey: "landing.stats.systemsValue",
		labelKey: "landing.stats.systems",
	},
];

const container = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
	hidden: { opacity: 0, y: 14 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.enter } },
};

export const LandingStats = () => {
	const { t } = useI18n();
	return (
		<section
			className="border-[0.5px] border-bd-1 bg-surf-2 py-7"
			aria-label={t("landing.stats.ariaLabel")}
		>
			<div className="mx-auto w-full max-w-[1120px] px-7 max-[900px]:px-[22px] max-[640px]:px-[18px]">
				<motion.div
					className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-3 max-[900px]:gap-6 max-[380px]:grid-cols-1"
					variants={container}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-60px" }}
				>
					{ITEMS.map(stat => (
						<motion.div key={stat.labelKey} variants={item} className="text-center">
							<div className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.5px] text-t-1 max-[900px]:text-[26px]">
								{t(stat.prefixKey)}
								<Typography tag="em" className="not-italic text-acc-t">
									{t(stat.emKey)}
								</Typography>
							</div>
							<div className="mt-1.5 text-[11.5px] uppercase tracking-[0.8px] text-t-3">
								{t(stat.labelKey)}
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};
