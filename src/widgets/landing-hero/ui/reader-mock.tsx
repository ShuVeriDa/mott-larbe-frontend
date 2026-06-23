"use client";

import { spring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	AnimatePresence,
	motion,
	type TargetAndTransition,
	type Transition,
} from "framer-motion";
import { BookOpen, Check, ExternalLink, Pencil, RefreshCw } from "lucide-react";
import { useState } from "react";

type ReaderScript = "CYRILLIC" | "LATIN" | "ARABIC";

const SCRIPT_TABS: { value: ReaderScript; label: string }[] = [
	{ value: "CYRILLIC", label: "Кириллица" },
	{ value: "LATIN", label: "Latin" },
	{ value: "ARABIC", label: "عربي" },
];

const ease = "easeInOut" as const;

const FLOAT_READER: { animate: TargetAndTransition; transition: Transition } = {
	animate: { y: [0, -5, -1, -6, 0], rotate: [-1, -0.4, -1.4, -0.5, -1] },
	transition: { duration: 14, ease, repeat: Infinity },
};

const FLOAT_CHIP_1: { animate: TargetAndTransition; transition: Transition } = {
	animate: { y: [0, -7, 0] },
	transition: { duration: 9, ease, repeat: Infinity, delay: 1.5 },
};

const FLOAT_CHIP_2: { animate: TargetAndTransition; transition: Transition } = {
	animate: { y: [0, -6, 0] },
	transition: { duration: 11, ease, repeat: Infinity, delay: 4 },
};

const FLOAT_POPUP: { animate: TargetAndTransition; transition: Transition } = {
	animate: { y: [0, -4, 0] },
	transition: { duration: 8, ease, repeat: Infinity, delay: 2 },
};

export const ReaderMock = () => {
	const { t } = useI18n();
	const [script, setScript] = useState<ReaderScript>("CYRILLIC");

	const original =
		script === "LATIN"
			? t("landing.hero.readerOriginalLatin")
			: script === "ARABIC"
				? t("landing.hero.readerOriginalArabic")
				: t("landing.hero.readerOriginal");

	const hl =
		script === "LATIN"
			? t("landing.hero.readerHlLatin")
			: script === "ARABIC"
				? t("landing.hero.readerHlArabic")
				: t("landing.hero.readerHl");

	const [activeWord, setActiveWord] = useState<string>("");

	const tokens = original.split(/(\s+)/);
	const isArabic = script === "ARABIC";

	const handleScriptChange = (s: ReaderScript) => {
		setScript(s);
		setActiveWord("");
	};

	const handleTokenClick = (clean: string) => setActiveWord(clean);

	return (
		<div className="relative" style={{ perspective: "1400px" }}>
			{/* Script switcher chip */}
			<motion.div
				className="absolute top-0 right-[calc(--spacing(6)+160px)] z-4 flex gap-0.5 rounded-[10px] border-[0.5px] border-bd-2 bg-surf p-1 shadow-md max-[640px]:hidden"
				animate={FLOAT_CHIP_1.animate}
				transition={FLOAT_CHIP_1.transition}
			>
				{SCRIPT_TABS.map(tab => {
					const active = script === tab.value;
					const handleClick = () => handleScriptChange(tab.value);
					return (
						<button
							key={tab.value}
							onClick={handleClick}
							className={cn(
								"h-[22px] min-w-[30px] rounded-[6px] border-[0.5px] px-[7px]",
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
			</motion.div>

			{/* +1 в словарь chip */}
			<motion.div
				className="absolute -top-4 right-6 z-4 flex items-center gap-2 rounded-[10px] border-[0.5px] border-bd-2 bg-surf px-3 py-2.5 text-[12px] shadow-md max-[640px]:hidden"
				animate={FLOAT_CHIP_1.animate}
				transition={FLOAT_CHIP_1.transition}
			>
				<Typography
					tag="span"
					className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-grn-bg text-grn-t"
				>
					<Check size={11} strokeWidth={2} />
				</Typography>
				<Typography tag="span">
					<Typography tag="span" className="block font-semibold text-t-1">
						{t("landing.hero.chip1Title")}
					</Typography>
					<Typography tag="span" className="mt-px block text-[10.5px] text-t-3">
						{t("landing.hero.chip1Sub")}
					</Typography>
				</Typography>
			</motion.div>

			{/* Повторение chip */}
			<motion.div
				className="absolute -bottom-3.5 left-7 z-4 flex items-center gap-2 rounded-[10px] border-[0.5px] border-bd-2 bg-surf px-3 py-2.5 text-[12px] shadow-md max-[640px]:hidden"
				animate={FLOAT_CHIP_2.animate}
				transition={FLOAT_CHIP_2.transition}
			>
				<Typography
					tag="span"
					className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-pur-bg text-pur-t"
				>
					<RefreshCw size={11} strokeWidth={2} />
				</Typography>
				<Typography tag="span">
					<Typography tag="span" className="block font-semibold text-t-1">
						{t("landing.hero.chip2Title")}
					</Typography>
					<Typography tag="span" className="mt-px block text-[10.5px] text-t-3">
						{t("landing.hero.chip2Sub")}
					</Typography>
				</Typography>
			</motion.div>

			{/* Reader — overflow-visible so popup is not clipped */}
			<motion.div
				className="relative overflow-visible rounded-[14px] border-[0.5px] border-bd-2 bg-surf shadow-lg"
				animate={FLOAT_READER.animate}
				transition={FLOAT_READER.transition}
				style={{ rotate: -1 }}
			>
				{/* Inner clip mask for the reader content only */}
				<div className="overflow-hidden rounded-[14px]">
					<div className="flex items-center gap-1.5 border-b-[0.5px] border-bd-1 bg-surf-2 px-[14px] py-[10px]">
						<Typography
							tag="span"
							aria-hidden="true"
							className="h-[9px] w-[9px] rounded-full"
							style={{ background: "#e87171", opacity: 0.55 }}
						/>
						<Typography
							tag="span"
							aria-hidden="true"
							className="h-[9px] w-[9px] rounded-full"
							style={{ background: "#f5a524", opacity: 0.55 }}
						/>
						<Typography
							tag="span"
							aria-hidden="true"
							className="h-[9px] w-[9px] rounded-full"
							style={{ background: "#3dc87a", opacity: 0.55 }}
						/>
						<Typography
							tag="span"
							className="ml-2.5 truncate font-display text-[12px] italic text-t-2"
						>
							{t("landing.hero.readerTitle")}
						</Typography>
						<Typography
							tag="span"
							className="ml-auto rounded bg-acc-bg px-[7px] py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-acc-t"
						>
							{t("landing.hero.readerLevel")}
						</Typography>
					</div>

					<div
						className="px-[30px] py-7 font-display text-[17px] leading-[1.75] text-t-1 max-[640px]:px-[22px] max-[640px]:py-[22px] max-[640px]:text-[15px] max-[640px]:leading-[1.65]"
						dir={isArabic ? "rtl" : undefined}
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={script}
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -6 }}
								transition={spring.snappy}
							>
								<Typography>
									{tokens.map((tok, i) => {
										if (!tok.trim()) return tok;
										const clean = tok.replace(/[.,!?;:«»،]/g, "");
										const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
										const isHl = normalize(clean) === normalize(hl) || (activeWord !== "" && normalize(clean) === normalize(activeWord));
										const handleClick = () => handleTokenClick(clean);
										return (
											<Typography
												tag="span"
												key={`${tok}-${i}`}
												role="button"
												tabIndex={0}
												onClick={handleClick}
												className={cn(
													"inline cursor-pointer rounded-[3px] px-[2px] py-px transition-colors hover:bg-acc/10",
													isHl &&
														"bg-acc-bg! text-acc-t! font-semibold outline-[0.5px] outline-acc/25",
												)}
											>
												{tok}
											</Typography>
										);
									})}
								</Typography>
								<Typography className="mt-[14px] text-[14px] italic text-t-3">
									{t("landing.hero.readerTranslation")}
								</Typography>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				{/* Popup — inside reader (overflow-visible), positioned under hl word */}
				<motion.div
					className="absolute left-[34%] top-[60%] z-10 w-[200px] overflow-hidden rounded-card border-[0.5px] border-bd-2 bg-surf shadow-lg max-[640px]:left-[20%] max-[640px]:w-[170px]"
					animate={FLOAT_POPUP.animate}
					transition={FLOAT_POPUP.transition}
				>
					<div className="border-b-[0.5px] border-bd-1 px-2.5 pb-2 pt-2.5">
						<div className="flex items-center gap-1.5">
							<div className="text-[13px] font-semibold tracking-[-0.2px] text-t-1">
								{hl}
							</div>
							<span className="flex shrink-0 items-center gap-1 rounded-[4px] border-[0.5px] border-grn/30 bg-grn/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.5px] text-grn">
								<BookOpen className="size-2" strokeWidth={1.8} />
								{t("landing.hero.popupBadge")}
							</span>
						</div>
					</div>

					<div className="border-b-[0.5px] border-bd-1 px-2.5 py-2">
						<div className="text-[12px] font-medium text-t-1">
							{t("landing.hero.popupTrans")}
						</div>
						<div className="mt-0.5 text-[10px] text-t-3">
							{t("landing.hero.popupBase")}{" "}
							<span className="font-medium text-t-2">
								{t("landing.hero.popupBaseValue")}
							</span>
						</div>
						<div className="mt-0.5 text-[10px] text-t-3">
							{t("landing.hero.popupPosLabel")}{" "}
							<span className="text-t-2">{t("landing.hero.popupPos")}</span>
						</div>
					</div>

					<div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5">
						<Button
							size={"bare"}
							className="flex h-6 flex-1 items-center justify-center gap-1 rounded-base bg-grn text-[10px] font-semibold text-white transition-opacity hover:opacity-[0.88]"
						>
							<Check size={10} strokeWidth={2.2} />
							{t("landing.hero.popupAdd")}
						</Button>
						<div className="flex gap-1">
							<Button
								size={"bare"}
								aria-hidden="true"
								className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:border-bd-2 hover:bg-surf-3 hover:text-t-1"
							>
								<Pencil className="size-2.5" strokeWidth={1.5} />
							</Button>
							<Button
								size={"bare"}
								aria-hidden="true"
								className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:border-bd-2 hover:bg-surf-3 hover:text-t-1"
							>
								<ExternalLink className="size-2.5" strokeWidth={1.5} />
							</Button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
};
