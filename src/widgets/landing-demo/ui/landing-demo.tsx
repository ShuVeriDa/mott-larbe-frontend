"use client";

import { Button } from "@/shared/ui/button";

import { ChevronLeft } from "lucide-react";
import { useRef } from 'react';
import {
	DemoPopup,
	useDemoReader,
} from "@/features/landing-demo-reader";
import type { DemoWordEntry } from "@/entities/landing";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	DemoParagraph,
	type DemoTokenSpec,
} from "./demo-paragraph";

const PARAGRAPHS: DemoTokenSpec[][] = [
	[
		{ word: "вехаш", display: "вехаш", status: "studied" },
		{ word: "хилла", display: "хилла", status: "default" },
		{ word: "кIант", display: "кIант", status: "studied" },
		{ word: "да-нана", display: "да-нана", status: "unknown" },
		{ word: "доттагIий", display: "доттагIий", status: "studied" },
		{ word: "хIорда", display: "хIорда", status: "default" },
		{ word: "маьлхан", display: "маьлхан", status: "default" },
		{ word: "олхазарш", display: "тIема олхазарш", status: "unknown" },
	],
	[
		{ word: "волавелла", display: "волавелла", status: "default" },
		{ word: "вала", display: "вала", status: "studied" },
		{ word: "кхечу", display: "кхечу", status: "default" },
		{ word: "тарх", display: "тарх", status: "unknown" },
		{ word: "шиъ", display: "шиъ", status: "default" },
		{ word: "кхета", display: "кхета", status: "default" },
		{ word: "бала", display: "бала", status: "default" },
	],
];

const buildParagraph1 = (specs: DemoTokenSpec[]) => [
	"Цхьана хенахь, лаьмнашкахь ",
	specs[0],
	" ",
	specs[1],
	" цхьа жима ",
	specs[2],
	". Цуьнан ",
	specs[3],
	" ца хилла, амма цуьнан ",
	specs[4],
	" дукха хилла — ",
	specs[5],
	", ",
	specs[6],
	" сирла серло, ",
	specs[7],
	".",
];

const buildParagraph2 = (specs: DemoTokenSpec[]) => [
	"Цхьана дийнахь и кIант лаьмнашка ",
	specs[0],
	" хьала, ",
	specs[1],
	" луучу ",
	specs[2],
	" махках. Цхьа ",
	specs[3],
	" карийна цунна, цигахь язйина хилла ",
	specs[4],
	" дош: «",
	specs[5],
	" — ",
	specs[6],
	"».",
];

interface LandingDemoProps {
	wordsDict: Record<string, DemoWordEntry>;
}

export const LandingDemo = ({ wordsDict }: LandingDemoProps) => {
	const { t } = useI18n();
	const cardRef = useRef<HTMLDivElement>(null);

	const {
		activeWord,
		activeData,
		position,
		isAdded,
		isMobile,
		toggle,
		toggleAdded,
		close,
	} = useDemoReader({ cardRef, wordsDict });

	return (
		<section
			id="demo"
			className="px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="demo-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 text-center max-[640px]:mb-9">
					<Typography
						tag="span"
						className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t"
					>
						{t("landing.demo.eyebrow")}
					</Typography>
					<Typography
						tag="h2"
						id="demo-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.demo.title")}
					</Typography>
					<Typography className="mx-auto mt-3.5 max-w-[620px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.demo.sub")}
					</Typography>
				</header>

				<div
					ref={cardRef}
					className="relative overflow-hidden rounded-[14px] border-hairline border-bd-2 bg-surf shadow-md max-[640px]:rounded-[12px]"
				>
					<div className="flex items-center gap-2.5 border-hairline border-b border-bd-1 bg-surf-2 px-5 py-3.5 max-[640px]:px-3.5 max-[640px]:py-3">
						<Button
							aria-hidden="true"
							className="flex h-7 w-7 items-center justify-center rounded-md border-hairline border-bd-2 bg-transparent text-t-2 max-[640px]:h-[26px] max-[640px]:w-[26px]"
						>
							<ChevronLeft size={13} strokeWidth={2} />
						</Button>
						<div className="min-w-0 flex-1">
							<div className="truncate font-display text-[14px] font-medium text-t-1 max-[640px]:text-[13px]">
								{t("landing.demo.textTitle")}
							</div>
							<div className="mt-px text-[11px] italic text-t-3">
								{t("landing.demo.textAuthor")}
							</div>
						</div>
						<Typography
							tag="span"
							className="rounded bg-grn-bg px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.5px] text-grn-t"
						>
							{t("landing.demo.level")}
						</Typography>
					</div>

					<div className="relative px-[50px] py-9 font-display text-[19px] leading-[1.85] text-t-1 max-[900px]:px-[30px] max-[900px]:py-7 max-[900px]:text-[17px] max-[640px]:px-5 max-[640px]:py-6 max-[640px]:text-base max-[640px]:leading-[1.7]">
						<DemoParagraph
							tokens={buildParagraph1(PARAGRAPHS[0])}
							activeWord={activeWord}
							onSelect={toggle}
						/>
						<div className="mt-4">
							<DemoParagraph
								tokens={buildParagraph2(PARAGRAPHS[1])}
								activeWord={activeWord}
								onSelect={toggle}
							/>
						</div>

						{activeWord && activeData ? (
							<DemoPopup
								word={activeWord}
								data={activeData}
								position={position}
								isMobile={isMobile}
								isAdded={isAdded}
								onAdd={toggleAdded}
								onClose={close}
							/>
						) : null}
					</div>

					<div className="flex items-center justify-between border-hairline border-t border-bd-1 bg-surf-2 px-5 py-3.5 text-[12px] text-t-3 max-[640px]:px-4 max-[640px]:py-3 max-[640px]:text-[11.5px]">
						<Typography tag="span">{t("landing.demo.page")}</Typography>
						<div className="mx-4 h-1 flex-1 max-w-[200px] overflow-hidden rounded-[2px] bg-surf-4 max-[640px]:mx-3">
							<div
								className="h-full rounded-[2px] bg-acc"
								style={{ width: "38%" }}
							/>
						</div>
						<Typography tag="span">{t("landing.demo.time")}</Typography>
					</div>
				</div>

				<div className="mt-[18px] flex flex-wrap justify-center gap-3.5 text-[11.5px] text-t-3">
					<Typography tag="span" className="flex items-center gap-1.5">
						<Typography tag="span" className="block h-[10px] w-[10px] rounded-[3px] border-hairline border-acc/25 bg-acc-bg" />
						{t("landing.demo.legendCurrent")}
					</Typography>
					<Typography tag="span" className="flex items-center gap-1.5">
						<Typography tag="span" className="block h-0 w-4 border-b-[1.5px] border-dotted border-grn" />
						{t("landing.demo.legendKnown")}
					</Typography>
					<Typography tag="span" className="flex items-center gap-1.5">
						<Typography tag="span"
							className="block h-[10px] w-[10px] rounded-[3px] bg-amb-bg"
							style={{ borderColor: "rgba(217,119,6,0.3)", borderWidth: 0.5 }}
						/>
						{t("landing.demo.legendUnknown")}
					</Typography>
				</div>
			</div>
		</section>
	);
};
