"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps, useState } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

const LEVEL_KEYS = ["a1", "a2", "b1", "b2", "c1", "c2"] as const;
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

export const LandingLevels = () => {
	const { t } = useI18n();
	const [active, setActive] = useState<LevelKey>("b1");

	return (
		<section
			id="levels"
			className="px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="levels-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 max-[640px]:mb-9">
					<Typography
						tag="span"
						className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t"
					>
						{t("landing.levels.eyebrow")}
					</Typography>
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
				</header>

				<div
					className="mb-10 flex flex-wrap gap-2"
					role="tablist"
					aria-label="CEFR levels"
				>
					{LEVEL_KEYS.map((key) => {
					  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setActive(key);
					  return (
						<Button
							key={key}
							role="tab"
							aria-selected={active === key}
							onClick={handleClick}
							className={cn(
								"rounded-full border-hairline px-4 py-1.5 text-[13px] font-semibold transition-colors",
								active === key
									? "border-acc bg-acc-bg text-acc-t"
									: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:text-t-1",
							)}
						>
							{t(`landing.levels.tabs.${key}.label`)}
							<Typography tag="span" className="ml-1.5 font-normal opacity-60">
								{t(`landing.levels.tabs.${key}.name`)}
							</Typography>
						</Button>
					);
					})}
				</div>

				<div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
					<article className="rounded-[14px] border-hairline border-bd-2 bg-surf p-6">
						<div className="mb-4 flex items-center justify-between">
							<Typography
								tag="h3"
								className="text-[15px] font-semibold text-t-1"
							>
								{t("landing.levels.myDict.title")}
							</Typography>
							<Typography tag="span" className="rounded-full bg-acc-bg px-2.5 py-0.5 text-[12px] font-medium text-acc-t">
								{t("landing.levels.myDict.badge")}
							</Typography>
						</div>
						<ul className="space-y-2">
							{DEMO_WORDS.map(({ word, translation, status }) => (
								<li
									key={word}
									className="flex items-center gap-3 rounded-[8px] bg-bg px-3 py-2"
								>
									<Typography tag="span"
										className={cn(
											"h-2 w-2 shrink-0 rounded-full",
											STATUS_COLOR[status],
										)}
									/>
									<Typography tag="span" className="flex-1 text-[14px] font-medium text-t-1">
										{word}
									</Typography>
									<Typography tag="span" className="text-[13px] text-t-2">{translation}</Typography>
								</li>
							))}
						</ul>
						<Button
							className="mt-4 text-[13px] font-medium text-acc-t hover:underline"
						>
							{t("landing.levels.myDict.viewAll")}
						</Button>
					</article>

					<article className="rounded-[14px] border-hairline border-bd-2 bg-surf p-6">
						<Typography
							tag="h3"
							className="mb-6 text-[15px] font-semibold text-t-1"
						>
							{t("landing.levels.weekStats.title")}
						</Typography>
						<div className="grid grid-cols-3 gap-x-4 gap-y-6">
							{STAT_KEYS.map((k) => (
								<div key={k} className="text-center">
									<div className="font-display text-[24px] font-bold leading-none text-t-1">
										{t(`landing.levels.weekStats.${k}v`)}
									</div>
									<div className="mt-1 text-[11.5px] uppercase tracking-[0.6px] text-t-3">
										{t(`landing.levels.weekStats.${k}l`)}
									</div>
								</div>
							))}
						</div>
					</article>
				</div>
			</div>
		</section>
	);
};
