"use client";

import { useGeminiKeyStatus } from "@/entities/ai-translation";
import { useTranslationLanguageStore } from "@/features/ai-word-lookup";
import { useReaderScript } from "@/features/reader-script";
import { variants } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import {
	Check,
	ChevronDown,
	Copy,
	ExternalLink,
	Settings,
	Sparkles,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAiPhraseTranslate } from "../model/use-ai-phrase-translate";
import { PhraseRefineBlock } from "./phrase-refine-block";

const POPUP_WIDTH = 280;
const SAFE_MARGIN = 10;

const computePosition = (
	x: number,
	y: number,
	bottom: number,
	popupHeight: number,
) => {
	if (typeof window === "undefined") return { left: 0, top: 0 };
	const left = Math.max(
		SAFE_MARGIN,
		Math.min(x - POPUP_WIDTH / 2, window.innerWidth - POPUP_WIDTH - SAFE_MARGIN),
	);
	const topAbove = y - 8 - popupHeight;
	const topBelow = bottom + 8;
	const fitsAbove = topAbove >= SAFE_MARGIN;
	const top = fitsAbove
		? topAbove
		: Math.min(topBelow, window.innerHeight - popupHeight - SAFE_MARGIN);
	return { left, top };
};

interface PhraseTranslatePopupProps {
	phrase: string;
	displayPhrase?: string;
	x: number;
	y: number;
	bottom: number;
	lang: string;
	contextSentence?: string;
	onClose: () => void;
}

export const PhraseTranslatePopup = ({
	phrase,
	displayPhrase,
	x,
	y,
	bottom,
	lang,
	contextSentence,
	onClose,
}: PhraseTranslatePopupProps) => {
	const { t } = useI18n();
	const { script } = useReaderScript();
	const isRtl = script === "ARABIC";
	const { state, refineState, translate, reset, openRefine, refine } =
		useAiPhraseTranslate();
	const { data: keyStatus } = useGeminiKeyStatus();
	const { targetLanguage } = useTranslationLanguageStore();
	const ref = useRef<HTMLDivElement>(null);
	const [showCyrillic, setShowCyrillic] = useState(false);
	const [popupHeight, setPopupHeight] = useState(160);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new ResizeObserver(entries => {
			const h = entries[0]?.contentRect.height;
			if (h && h > 0) setPopupHeight(h);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const hasKey = keyStatus?.hasKey ?? false;

	useEffect(() => {
		reset();
		if (hasKey) {
			translate(phrase, contextSentence, targetLanguage);
		}
	}, [phrase, contextSentence, hasKey, targetLanguage]);

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onClose();
			}
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	const [copied, setCopied] = useState(false);
	const [glossOpen, setGlossOpen] = useState(false);

	const handleToggleCyrillic = () => setShowCyrillic(prev => !prev);

	const handleRefineSubmit = (hint: string) => {
		if (state.phase !== "done") return;
		refine(phrase, state.result.translation, hint, targetLanguage);
	};

	const handleCopy = () => {
		if (state.phase !== "done") return;
		navigator.clipboard.writeText(state.result.translation);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const handleGlossToggle = () => setGlossOpen(prev => !prev);

	const { left, top } = computePosition(x, y, bottom, popupHeight);

	return createPortal(
		<motion.div
			ref={ref}
			role="dialog"
			aria-label={t("aiTranslation.phrase.title")}
			className="fixed z-200 w-[280px] overflow-hidden rounded-card border-[0.5px] border-bd-2 bg-surf shadow-lg"
			style={{ left, top }}
			variants={variants.fadeUp}
			initial="hidden"
			animate="visible"
			exit="exit"
		>
			{/* Header */}
			<div className="flex items-center justify-between border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div className="flex items-center gap-1.5">
					<span className="flex items-center gap-1 rounded-[4px] border-[0.5px] border-pur/30 bg-pur-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-pur-t">
						<Sparkles className="size-2.5" strokeWidth={1.8} />
						{t("aiTranslation.phrase.title")}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Button
						size="bare"
						onClick={onClose}
						aria-label={t("reader.sheet.close")}
						className="rounded p-0.5 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<X className="size-3.5" strokeWidth={1.6} />
					</Button>
				</div>
			</div>

			{/* Phrase */}
			<div className="relative border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div
					className={cn(
						"text-[13px] font-medium text-t-1 line-clamp-2",
						displayPhrase && "pr-6",
					)}
					dir={isRtl ? "rtl" : undefined}
				>
					{displayPhrase ?? phrase}
				</div>
				{displayPhrase && (
					<>
						<Button
							onClick={handleToggleCyrillic}
							title={
								showCyrillic
									? t("aiTranslation.phrase.hideCyrillic")
									: t("aiTranslation.phrase.showCyrillic")
							}
							className={cn(
								"absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full border-[0.5px] transition-colors",
								showCyrillic
									? "border-acc/40 bg-acc/10 text-acc"
									: "border-bd-2 bg-surf-2 text-t-4 hover:border-acc/40 hover:text-acc",
							)}
						>
							<ChevronDown
								className={cn(
									"size-3 transition-transform",
									showCyrillic && "rotate-180",
								)}
								strokeWidth={1.8}
							/>
						</Button>
						{showCyrillic && (
							<div className="mt-1.5 text-[11px] text-t-3">{phrase}</div>
						)}
					</>
				)}
			</div>

			{/* Body */}
			{!hasKey ? (
				<div className="flex flex-col gap-2.5 px-3.5 py-3">
					<Typography tag="p" className="text-[12.5px] font-medium text-t-1">
						{t("aiTranslation.popup.noKeyTitle")}
					</Typography>
					<Typography tag="p" className="text-[11.5px] text-t-3">
						{t("aiTranslation.popup.noKeyDescription")}
					</Typography>
					<Typography tag="p" className="text-[11px] text-grn">
						{t("aiTranslation.popup.noKeyFree")}
					</Typography>
					<div className="flex flex-col gap-1.5">
						<Link
							href={`/${lang}/profile?tab=ai`}
							className="inline-flex items-center gap-1 text-[11.5px] text-acc hover:underline"
						>
							<Settings className="size-3" strokeWidth={1.5} />
							{t("aiTranslation.popup.goToSettings")}
						</Link>
						<a
							href="https://aistudio.google.com/app/apikey"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 text-[11.5px] text-t-3 hover:text-t-1 hover:underline"
						>
							<ExternalLink className="size-3" strokeWidth={1.5} />
							{t("aiTranslation.popup.getKeyLink")}
						</a>
					</div>
				</div>
			) : state.phase === "idle" || state.phase === "loading" ? (
				<div className="flex flex-col items-center justify-center gap-2 p-5">
					<div className="size-[16px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
					<div className="text-[11.5px] text-t-3">
						{t("aiTranslation.phrase.translating")}
					</div>
				</div>
			) : state.phase === "error" ? (
				<div className="px-3.5 py-3">
					<Typography tag="p" className="text-[12.5px] text-red-t">
						{state.errorMessage}
					</Typography>
				</div>
			) : (
				<>
					<div className="px-3.5 py-3">
						<div className="flex items-start justify-between gap-2">
							<div className="text-[14px] font-medium text-t-1">
								{state.result.translation}
							</div>
							<Button
								size="bare"
								onClick={handleCopy}
								aria-label={t("aiTranslation.popup.copy")}
								title={t("aiTranslation.popup.copy")}
								className="mt-0.5 shrink-0 rounded p-0.5 text-t-4 transition-colors hover:text-t-2"
							>
								{copied ? (
									<Check className="size-3" strokeWidth={1.8} />
								) : (
									<Copy className="size-3" strokeWidth={1.5} />
								)}
							</Button>
						</div>
						{state.result.notes && (
							<div className="mt-1 text-[12px] text-t-3">
								{state.result.notes}
							</div>
						)}

						{targetLanguage !== "ru" && state.result.russianGloss && (
							<div className="mt-2 border-t border-bd-1 pt-1.5">
								<Button
									size="bare"
									onClick={handleGlossToggle}
									className="flex items-center gap-1 text-[10.5px] text-t-4 hover:text-t-2 transition-colors"
								>
									<ChevronDown
										className={cn(
											"size-3 transition-transform",
											glossOpen && "rotate-180",
										)}
										strokeWidth={1.6}
									/>
									{t("aiTranslation.popup.russianGloss")}
								</Button>
								{glossOpen && (
									<div className="mt-1 text-[11.5px] text-t-3">
										{state.result.russianGloss}
									</div>
								)}
							</div>
						)}
					</div>
					<PhraseRefineBlock
						refineState={refineState}
						onOpen={openRefine}
						onSubmit={handleRefineSubmit}
					/>
				</>
			)}
		</motion.div>,
		document.body,
	);
};
