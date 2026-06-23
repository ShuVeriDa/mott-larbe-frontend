"use client";

import { ease } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { EyebrowLabel } from "@/shared/ui/eyebrow-label";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";

const STEPS = ["choose", "read", "review"] as const;

const headerVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.enter } },
};

const stepsContainer = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const stepItem = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.enter } },
};

export const LandingHowItWorks = () => {
	const { t } = useI18n();

	return (
		<section
			id="how"
			className="border-[0.5px] border-bd-1 bg-surf-2  px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="how-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<motion.header
					className="mb-12 text-center max-[640px]:mb-9"
					variants={headerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
				>
					<EyebrowLabel>{t("landing.how.eyebrow")}</EyebrowLabel>
					<Typography
						tag="h2"
						id="how-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.how.title")}
					</Typography>
					<Typography className="mx-auto mt-3.5 max-w-[620px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.how.sub")}
					</Typography>
				</motion.header>

				<motion.ol
					className="relative grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-8"
					variants={stepsContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-60px" }}
				>
					<Typography
						tag="span"
						aria-hidden="true"
						className="pointer-events-none absolute left-[12%] right-[12%] top-7 h-px max-[900px]:hidden"
						style={{
							background:
								"linear-gradient(90deg, transparent, var(--bd-2) 15%, var(--bd-2) 85%, transparent)",
						}}
					/>
					{STEPS.map((step, idx) => (
						<motion.li
							key={step}
							variants={stepItem}
							className="relative z-[1] px-3 text-center max-[900px]:px-0"
						>
							<div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full border-[0.5px] border-bd-2 bg-surf font-display text-[22px] font-semibold text-acc-t shadow-sm">
								{idx + 1}
							</div>
							<Typography
								tag="h3"
								className="mb-2 font-display text-[19px] font-semibold text-t-1"
							>
								{t(`landing.how.steps.${step}.title`)}
							</Typography>
							<Typography className="mx-auto max-w-[280px] text-[13.5px] leading-[1.55] text-t-2">
								{t(`landing.how.steps.${step}.desc`)}
							</Typography>
						</motion.li>
					))}
				</motion.ol>
			</div>
		</section>
	);
};
