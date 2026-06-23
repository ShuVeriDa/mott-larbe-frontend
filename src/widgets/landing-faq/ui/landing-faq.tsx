"use client";

import { FaqItem, useFaq } from "@/features/landing-faq";
import { ease } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { EyebrowLabel } from "@/shared/ui/eyebrow-label";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import { ComponentProps } from "react";

interface FaqDictItem {
	q: string;
	a: string;
}

const headerVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.enter } },
};

const listVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.enter } },
};

export const LandingFaq = () => {
	const { t, dict } = useI18n();
	const { openIndex, toggle } = useFaq(0);

	const items =
		(
			dict as unknown as {
				landing?: { faq?: { items?: FaqDictItem[] } };
			}
		).landing?.faq?.items ?? [];

	return (
		<section
			id="faq"
			className="border-[0.5px] border-bd-1 bg-surf-2 px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="faq-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<motion.header
					className="mb-12 text-center max-[640px]:mb-9"
					variants={headerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
				>
					<EyebrowLabel>{t("landing.faq.eyebrow")}</EyebrowLabel>
					<Typography
						tag="h2"
						id="faq-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.faq.title")}
					</Typography>
				</motion.header>

				<motion.div
					className="mx-auto max-w-[760px]"
					variants={listVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-60px" }}
				>
					{items.map((item, idx) => {
						const handleToggle: NonNullable<
							ComponentProps<typeof FaqItem>["onToggle"]
						> = () => toggle(idx);
						return (
							<motion.div key={`faq-${idx}`} variants={itemVariants}>
								<FaqItem
									id={`faq-${idx}`}
									question={item.q}
									answer={item.a}
									open={openIndex === idx}
									onToggle={handleToggle}
								/>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
};
