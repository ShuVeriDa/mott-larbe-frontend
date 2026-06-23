"use client";

import { ease } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import Link from "next/link";
import { ReaderMockParallax } from "./reader-mock-parallax";

interface LandingHeroProps {
	startHref: string;
}

const heroContainer = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const heroItem = {
	hidden: { opacity: 0, y: 18 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.enter } },
};

const heroRight = {
	hidden: { opacity: 0, x: 32, scale: 0.97 },
	visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.65, ease: ease.enter, delay: 0.25 } },
};

export const LandingHero = ({ startHref }: LandingHeroProps) => {
	const { t } = useI18n();

	return (
		<section
			className="relative overflow-hidden px-7 pb-24 pt-[72px] max-[900px]:px-[22px] max-[900px]:pb-24 max-[900px]:pt-12 max-[640px]:px-[18px] max-[640px]:pb-24 max-[640px]:pt-9"
			aria-labelledby="hero-title"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					background:
						"radial-gradient(circle at 20% 10%, rgba(34,84,211,0.12), transparent 45%), radial-gradient(circle at 85% 85%, rgba(34,84,211,0.12), transparent 45%)",
				}}
			/>

			<div className="relative z-1 mx-auto grid w-full max-w-[1120px] grid-cols-[1.05fr_1fr] items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-14">
				<motion.div
					variants={heroContainer}
					initial="hidden"
					animate="visible"
				>
					<motion.div variants={heroItem}>
						<Typography
							tag="span"
							className="mb-[22px] inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-acc/25 bg-acc-bg px-[11px] py-[5px] text-[11.5px] font-semibold text-acc-t"
						>
							<span className="relative flex h-1.5 w-1.5">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acc opacity-60" />
								<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acc" />
							</span>
							{t("landing.hero.eyebrow")}
						</Typography>
					</motion.div>

					<motion.div variants={heroItem}>
						<Typography
							tag="h1"
							id="hero-title"
							className="mb-[22px] font-display text-[56px] font-semibold leading-[1.05] tracking-[-1px] text-t-1 max-[900px]:text-[44px] max-[640px]:text-[34px] max-[640px]:tracking-[-0.5px]"
						>
							{t("landing.hero.titleStart")}{" "}
							<Typography tag="em" className="font-medium italic text-acc-t">
								{t("landing.hero.titleEm")}
							</Typography>{" "}
							{t("landing.hero.titleEnd")}
						</Typography>
					</motion.div>

					<motion.div variants={heroItem}>
						<Typography className="mb-8 max-w-[520px] text-[17px] leading-[1.55] text-t-2 max-[900px]:text-base max-[640px]:text-[15px]">
							{t("landing.hero.sub")}
						</Typography>
					</motion.div>

					<motion.div variants={heroItem} className="flex flex-wrap gap-2.5 max-[640px]:flex-col">
						<Link
							href={startHref}
							className="group inline-flex h-[46px] items-center gap-1.5 rounded-[9px] bg-acc px-[22px] text-[14.5px] font-semibold text-white shadow-[0_2px_6px_rgba(34,84,211,0.25)] transition-opacity hover:opacity-[0.92] max-[640px]:w-full max-[640px]:justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-2"
						>
							{t("landing.hero.start")}
							<ArrowRight
								size={14}
								strokeWidth={1.8}
								className="transition-transform duration-200 ease-out group-hover:translate-x-1"
							/>
						</Link>
						<Link
							href="#how"
							className="inline-flex h-[46px] items-center gap-1.5 rounded-[9px] border-[0.5px] border-bd-2 bg-transparent px-5 text-[14px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-2 max-[640px]:w-full max-[640px]:justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
						>
							<PlayCircle size={14} strokeWidth={1.5} />
							{t("landing.hero.how")}
						</Link>
					</motion.div>

					<motion.div
						variants={heroItem}
						className="mt-[26px] flex flex-wrap items-center gap-[18px] text-[12.5px] text-t-3 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2"
					>
						<Typography tag="span" className="flex items-center gap-1.5">
							<Check size={13} strokeWidth={2} className="text-grn" />
							{t("landing.hero.meta.free")}
						</Typography>
						<Typography tag="span" className="flex items-center gap-1.5">
							<Check size={13} strokeWidth={2} className="text-grn" />
							{t("landing.hero.meta.noCard")}
						</Typography>
						<Typography tag="span" className="flex items-center gap-1.5">
							<Check size={13} strokeWidth={2} className="text-grn" />
							{t("landing.hero.meta.fast")}
						</Typography>
					</motion.div>
				</motion.div>

				<motion.div variants={heroRight} initial="hidden" animate="visible">
					<ReaderMockParallax />
				</motion.div>
			</div>
		</section>
	);
};
