"use client";

import { Button } from "@/shared/ui/button";

import type { DemoWordEntry } from "@/entities/landing";
import { DemoPopup, useDemoReader } from "@/features/landing-demo-reader";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { EyebrowLabel } from "@/shared/ui/eyebrow-label";
import { Typography } from "@/shared/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import { DemoParagraph, type DemoTokenSpec } from "./demo-paragraph";

type ReaderScript = "CYRILLIC" | "LATIN" | "ARABIC";

const SCRIPT_TABS: { value: ReaderScript; label: string }[] = [
	{ value: "CYRILLIC", label: "Кириллица" },
	{ value: "LATIN", label: "Latin" },
	{ value: "ARABIC", label: "عربي" },
];

// s[0]=жа  s[1]=гена  s[2]=уьш  s[3]=мецачу  s[4]=ӏахар
const TOKENS_CYR: DemoTokenSpec[] = [
	{ word: "жа", display: "Жа", status: "unknown" },
	{ word: "гена", display: "ге́на", status: "unknown" },
	{ word: "уьш", display: "уьш", status: "studied" },
	{ word: "мецачу", display: "мецачу", status: "studied" },
	{ word: "ӏахар", display: "ӏа́хар", status: "unknown" },
];

const TOKENS_LAT: DemoTokenSpec[] = [
	{ word: "жа", display: "Ƶa", status: "unknown" },
	{ word: "гена", display: "géna", status: "unknown" },
	{ word: "уьш", display: "üş", status: "studied" },
	{ word: "мецачу", display: "mecaçu", status: "studied" },
	{ word: "ӏахар", display: "jáxar", status: "unknown" },
];

const TOKENS_ARA: DemoTokenSpec[] = [
	{ word: "жа", display: "جَ", status: "unknown" },
	{ word: "гена", display: "ڠِ۬ينَ", status: "unknown" },
	{ word: "уьш", display: "أُ۬شْ", status: "studied" },
	{ word: "мецачу", display: "مِ۬ﮃَچُ", status: "studied" },
	{ word: "ӏахар", display: "عَاخَرْ", status: "unknown" },
];

// Полный текст: «Буорз а, къе́на ка а» — 4 предложения
type ParagraphBuilder = (s: DemoTokenSpec[]) => (string | DemoTokenSpec)[];

const buildCyr: ParagraphBuilder[] = [
	s => [
		s[0],
		" йуккъе́ра нацкъар а баь́лла, уьдуш, ловзуш хилла цхьа-ши ",
		s[4],
		".",
	],
	s => [
		s[0],
		" ",
		s[1],
		" даь́лча, ",
		s[2],
		" тергалдиэш ӏаш йолчу ",
		s[3],
		" буорзуо, а́ра а иккхина, ши ",
		s[4],
		" схьа а лаьцна, биъна.",
	],
	_ => [
		"Жижиг а диина, довха цӏий тӏе а мелла, хьун луьста йолчу дӏатаӏа йоь́душ хилла буорз.",
	],
	_ => ["Хьуьна йистехь, бай тӏиэхь бе́жаш цхьа къе́на ка гина цунна."],
];

const buildLat: ParagraphBuilder[] = [
	s => [s[0], " yukq̇éra nacq̇ar ə bä́lla, üduş, lovzuş xilla cẋa-şi ", s[4], "."],
	s => [
		s[0],
		" ",
		s[1],
		" dä́lça, ",
		s[2],
		" tergaldieş jaş yolçu ",
		s[3],
		" buorzuo, ára ə ikqina, şi ",
		s[4],
		" sẋa ə läcna, biəna.",
	],
	_ => [
		"Ƶiƶig ə diina, dovxa ċiy the ə mella, ẋun lüsta yolçu djataja yö́duş xilla buorz.",
	],
	_ => ["Ẋünaŋ yisteẋ, bay thieẋ béƶaş cẋa q̇éna ka gina cunna."],
];

const buildAra: ParagraphBuilder[] = [
	s => [
		s[0],
		" يُقِّ۬يرَ نَﮃْقَرْ أَ بَ۬الَّ، أُ۬دُشْ، لٗوْزُشْ خِلَّ ﮃْحَ-شِ ",
		s[4],
		".",
	],
	s => [
		s[0],
		" ",
		s[1],
		" دَ۬الْچَ، ",
		s[2],
		" تِ۬رْڠَلْدِئِ۬شْ عَشْ يٗلْچُ ",
		s[3],
		" بُؤٗرْزُؤٗ، أَارَ أَ إِڤِّنَ، شِ ",
		s[4],
		" سْحَ أَ لَ۬ﮃْنَ، بِءْنَ.",
	],
	_ => [
		"جِجِڠْ أَ دِإِنَ، دٗوْخَ ڗِيْ طِ۬ أَ مِ۬لَّ، حُنْ لُ۬سْتَ يٗلْچُ دْعَتَعَ يٗ۬ودُشْ خِلَّ بُؤٗرْزْ.",
	],
	_ => ["حُ۬نًا يِسْتِ۬حْ، بَيْ طِئِ۬حْ بِ۬يجَشْ ﮃْحَ قِ۬ينَ كَ ڠِنَ ﮃُنَّ."],
];

const WORDS_DICT: Record<string, DemoWordEntry> = {
	жа: {
		base: "жа",
		pos: "цӀердош / Существительное",
		trans: "отара",
		extra: "",
		tags: [],
	},
	гена: {
		base: "гена",
		pos: "куцдош / Наречие",
		trans: "далеко; далее, дальше",
		extra: "",
		tags: [],
	},
	уьш: {
		base: "уьш",
		pos: "цӀерметдош / Местоимение",
		trans: "они",
		extra: "",
		tags: [],
	},
	мецачу: {
		base: "меца",
		pos: "билгало / Прилагательное",
		trans: "голодный",
		extra: "",
		tags: [],
	},
	ӏахар: {
		base: "Ӏахар",
		pos: "цӀердош / Существительное",
		trans: "ягнёнок; мычание",
		extra: "",
		tags: [],
	},
};

export const LandingDemo = () => {
	const wordsDict = WORDS_DICT;
	const { t } = useI18n();
	// cardRef — карточка (overflow-hidden), нужна для вычисления координат popup
	// wrapperRef — внешний relative-контейнер, popup рендерится относительно него
	const cardRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [script, setScript] = useState<ReaderScript>("CYRILLIC");

	const {
		activeWord,
		activeData,
		position,
		isAdded,
		isMobile,
		toggle,
		toggleAdded,
		close,
	} = useDemoReader({ cardRef, containerRef: wrapperRef, wordsDict });

	const isArabic = script === "ARABIC";

	const builders =
		script === "LATIN" ? buildLat : script === "ARABIC" ? buildAra : buildCyr;
	const tokens =
		script === "LATIN"
			? TOKENS_LAT
			: script === "ARABIC"
				? TOKENS_ARA
				: TOKENS_CYR;
	const paragraphs = builders.map(fn => fn(tokens));

	const handleScriptChange = (s: ReaderScript) => {
		close();
		setScript(s);
	};

	return (
		<section
			id="demo"
			className="bg-surf-3 px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="demo-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 text-center max-[640px]:mb-9">
					<EyebrowLabel>{t("landing.demo.eyebrow")}</EyebrowLabel>
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

				{/* wrapper — relative container; popup позиционируется относительно него */}
				<div ref={wrapperRef} className="relative">
					<div
						ref={cardRef}
						className="overflow-hidden rounded-[14px] border-[0.5px] border-bd-2 bg-surf shadow-md max-[640px]:rounded-[12px]"
					>
						{/* Header */}
						<div className="flex items-center gap-2.5 border-b-[0.5px] border-bd-1 bg-surf-2 px-5 py-3.5 max-[640px]:px-3.5 max-[640px]:py-3">
							<Button
								size={"bare"}
								aria-hidden="true"
								className="flex h-7 w-7 items-center justify-center rounded-md border-[0.5px] border-bd-2 bg-transparent text-t-2 max-[640px]:h-[26px] max-[640px]:w-[26px]"
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
							{/* Script switcher */}
							<div
								className="flex gap-0.5 rounded-base border-[0.5px] border-bd-2 bg-surf p-[3px]"
								role="group"
							>
								{SCRIPT_TABS.map(tab => {
									const active = script === tab.value;
									const handleClick = () => handleScriptChange(tab.value);
									return (
										<button
											key={tab.value}
											onClick={handleClick}
											className={cn(
												"h-[22px] min-w-[28px] rounded-[4px] border-[0.5px] px-[6px]",
												"text-[10px] font-medium leading-none transition-colors duration-100",
												active
													? "border-acc/20 bg-acc-bg text-acc-t"
													: "border-transparent text-t-3 hover:bg-surf-2 hover:text-t-1",
											)}
										>
											{tab.label}
										</button>
									);
								})}
							</div>
							<Typography
								tag="span"
								className="rounded bg-grn-bg px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.5px] text-grn-t"
							>
								{t("landing.demo.level")}
							</Typography>
						</div>

						{/* Content */}
						<div
							className="px-7 py-7 font-display text-[19px] leading-[1.85] text-t-1 max-[900px]:px-[30px] max-[900px]:py-5 max-[900px]:text-[17px] max-[640px]:px-3 max-[640px]:py-4 max-[640px]:text-base max-[640px]:leading-[1.7]"
							dir={isArabic ? "rtl" : undefined}
						>
							<AnimatePresence mode="wait">
								<motion.div
									key={script}
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -5 }}
									transition={{ type: "spring", stiffness: 400, damping: 30 }}
									className="space-y-4 [&>p]:mb-1"
								>
									{paragraphs.map((parts, i) => (
										<DemoParagraph
											key={i}
											tokens={parts}
											activeWord={activeWord}
											onSelect={toggle}
										/>
									))}
								</motion.div>
							</AnimatePresence>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between border-t-[0.5px] border-bd-1 bg-surf-2 px-5 py-3.5 text-[12px] text-t-3 max-[640px]:px-4 max-[640px]:py-3 max-[640px]:text-[11.5px]">
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

					{/* Popup — вне overflow-hidden карточки, внутри relative wrapper */}
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

				<div className="mt-[18px] flex flex-wrap justify-center gap-3.5 text-[11.5px] text-t-3">
					<Typography tag="span" className="flex items-center gap-1.5">
						<Typography
							tag="span"
							className="block h-[10px] w-[10px] rounded-[3px] border-[0.5px] border-acc/25 bg-acc-bg"
						/>
						{t("landing.demo.legendCurrent")}
					</Typography>
					<Typography tag="span" className="flex items-center gap-1.5">
						<Typography
							tag="span"
							className="block h-0 w-4 border-b-[1.5px] border-dotted border-grn"
						/>
						{t("landing.demo.legendKnown")}
					</Typography>
					<Typography tag="span" className="flex items-center gap-1.5">
						<Typography
							tag="span"
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
