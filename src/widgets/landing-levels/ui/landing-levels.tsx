"use client";

import { ease } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { EyebrowLabel } from "@/shared/ui/eyebrow-label";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import {
	BookOpen,
	CheckCircle,
	Flame,
	LucideIcon,
	Plus,
	RefreshCw,
	Zap,
} from "lucide-react";
import { ComponentProps, useState } from "react";

const LEVEL_KEYS = ["a", "b", "c"] as const;
type LevelKey = (typeof LEVEL_KEYS)[number];

const DEMO_WORDS = [
	{ word: "кхета", translation: "понимать", status: "known" },
	{ word: "кIант", translation: "юноша", status: "known" },
	{ word: "хIорда", translation: "море", status: "learning" },
	{ word: "маьлхан", translation: "солнечный", status: "learning" },
	{ word: "бала", translation: "горе", status: "new" },
] as const;

type WordStatus = (typeof DEMO_WORDS)[number]["status"];

const STATUS_COLOR: Record<WordStatus, string> = {
	known: "bg-grn",
	learning: "bg-amb",
	new: "bg-t-2/40",
};

const STAT_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

type Tone = "acc" | "grn" | "amb" | "pur";

interface StatMeta {
	tone: Tone;
	iconBg: string;
	iconColor: string;
	Icon: LucideIcon;
}

const STAT_META: Record<(typeof STAT_KEYS)[number], StatMeta> = {
	s1: {
		tone: "acc",
		iconBg: "bg-acc-bg",
		iconColor: "text-acc-t",
		Icon: BookOpen,
	},
	s2: {
		tone: "grn",
		iconBg: "bg-grn-bg",
		iconColor: "text-grn-t",
		Icon: CheckCircle,
	},
	s3: { tone: "grn", iconBg: "bg-grn-bg", iconColor: "text-grn-t", Icon: Zap },
	s4: { tone: "pur", iconBg: "bg-pur-bg", iconColor: "text-pur-t", Icon: Plus },
	s5: {
		tone: "amb",
		iconBg: "bg-amb-bg",
		iconColor: "text-amb-t",
		Icon: RefreshCw,
	},
	s6: {
		tone: "amb",
		iconBg: "bg-amb-bg",
		iconColor: "text-amb-t",
		Icon: Flame,
	},
};

const sectionVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.enter } },
};

const cardsContainer = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const cardVariant = {
	hidden: { opacity: 0, y: 18 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: ease.enter } },
};

export const LandingLevels = () => {
	const { t } = useI18n();
	const [active, setActive] = useState<LevelKey>("b");

	return (
		<section
			id="levels"
			className="border-[0.5px] border-bd-1 bg-surf-2 px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="levels-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<motion.header
					className="mb-12 max-[640px]:mb-9"
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
				>
					<EyebrowLabel>{t("landing.levels.eyebrow")}</EyebrowLabel>
					<Typography
						tag="h2"
						id="levels-title"
						className="max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.levels.title")}
					</Typography>
					<Typography className="mt-3.5 max-w-[620px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.levels.sub")}
					</Typography>
				</motion.header>

				<motion.div
					className="mb-10 flex flex-wrap gap-2"
					role="tablist"
					aria-label="CEFR levels"
					variants={sectionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-60px" }}
				>
					{LEVEL_KEYS.map(key => {
						const handleClick: NonNullable<
							ComponentProps<"button">["onClick"]
						> = () => setActive(key);
						return (
							<Button
								key={key}
								role="tab"
								aria-selected={active === key}
								onClick={handleClick}
								className={cn(
									"rounded-full flex gap-1.5 border-[0.5px] px-4 py-1.5 text-[13px] font-semibold transition-colors max-[440px]:text-[13px] max-[440px]:px-2",
									active === key
										? "border-acc bg-acc-bg text-acc-t"
										: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:text-t-1",
								)}
							>
								<Typography tag="span">
									{t(`landing.levels.tabs.${key}.label`)}
								</Typography>
								<Typography
									tag="span"
									className={cn(
										" font-normal",
										active == key ? "opacity-100" : "opacity-60",
									)}
								>
									{t(`landing.levels.tabs.${key}.name`)}
								</Typography>
							</Button>
						);
					})}
				</motion.div>

				<motion.div
					className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1"
					variants={cardsContainer}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-60px" }}
				>
					<motion.article variants={cardVariant} className="rounded-[14px] border-[0.5px] border-bd-2 bg-surf p-6">
						<div className="mb-4 flex items-center justify-between">
							<Typography
								tag="h3"
								className="text-[15px] font-semibold text-t-1"
							>
								{t("landing.levels.myDict.title")}
							</Typography>
							<Typography
								tag="span"
								className="rounded-full bg-acc-bg px-2.5 py-0.5 text-[12px] font-medium text-acc-t"
							>
								{t("landing.levels.myDict.badge")}
							</Typography>
						</div>
						<ul className="space-y-2">
							{DEMO_WORDS.map(({ word, translation, status }) => (
								<li
									key={word}
									className="flex items-center gap-3 rounded-[8px] px-3 py-2 bg-surf-2 border-[0.5px] border-bd-1"
								>
									<Typography
										tag="span"
										className={cn(
											"h-2 w-2 shrink-0 rounded-full",
											STATUS_COLOR[status],
										)}
									/>
									<Typography
										tag="span"
										className="flex-1 text-[14px] font-medium text-t-1"
									>
										{word}
									</Typography>
									<Typography tag="span" className="text-[13px] text-t-2">
										{translation}
									</Typography>
								</li>
							))}
						</ul>
						<Button className="mt-4 text-[13px] font-medium text-acc-t hover:underline">
							{t("landing.levels.myDict.viewAll")}
						</Button>
					</motion.article>

					<motion.article variants={cardVariant} className="rounded-[14px] border-[0.5px] border-bd-2 bg-surf p-5">
						<Typography
							tag="h3"
							className="mb-4 text-[15px] font-semibold text-t-1"
						>
							{t("landing.levels.weekStats.title")}
						</Typography>
						<div className="grid grid-cols-3 gap-2">
							{STAT_KEYS.map(k => {
								const m = STAT_META[k];
								return (
									<div
										key={k}
										className="rounded-[10px] border-[0.5px] border-bd-1 bg-surf-2 p-3"
									>
										<div
											className={cn(
												"mb-2.5 flex size-6 items-center justify-center rounded-[6px]",
												m.iconBg,
											)}
											aria-hidden="true"
										>
											<m.Icon size={13} className={m.iconColor} />
										</div>
										<div className="font-display text-[20px] font-semibold leading-none tracking-[-0.4px] text-t-1">
											{t(`landing.levels.weekStats.${k}v`)}
										</div>
										<div className="mt-1 text-[10.5px] text-t-3">
											{t(`landing.levels.weekStats.${k}l`)}
										</div>
									</div>
								);
							})}
						</div>
					</motion.article>
				</motion.div>
			</div>
		</section>
	);
};
