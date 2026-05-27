"use client";

import { useGeminiKeyStatus } from "@/entities/ai-translation";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Check, Copy, ExternalLink, Settings, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAiPhraseTranslate } from "../model/use-ai-phrase-translate";
import { PhraseRefineBlock } from "./phrase-refine-block";

interface PhraseTranslatePopupProps {
	phrase: string;
	x: number;
	y: number;
	lang: string;
	contextSentence?: string;
	onClose: () => void;
}

export const PhraseTranslatePopup = ({
	phrase,
	x,
	y,
	lang,
	contextSentence,
	onClose,
}: PhraseTranslatePopupProps) => {
	const { t } = useI18n();
	const { state, refineState, translate, reset, openRefine, refine } =
		useAiPhraseTranslate();
	const { data: keyStatus } = useGeminiKeyStatus();
	const ref = useRef<HTMLDivElement>(null);

	const hasKey = keyStatus?.hasKey ?? false;

	useEffect(() => {
		reset();
		if (hasKey) {
			translate(phrase, contextSentence);
		}
	}, [phrase, contextSentence, hasKey]);

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

	const handleRefineSubmit = (hint: string) => {
		if (state.phase !== "done") return;
		refine(phrase, state.result.translation, hint);
	};

	const handleCopy = () => {
		if (state.phase !== "done") return;
		navigator.clipboard.writeText(state.result.translation);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const POPUP_WIDTH = 280;
	const SAFE_MARGIN = 10;
	const left = Math.max(
		SAFE_MARGIN,
		Math.min(
			x - POPUP_WIDTH / 2,
			window.innerWidth - POPUP_WIDTH - SAFE_MARGIN,
		),
	);
	const top = y - 8;

	return createPortal(
		<div
			ref={ref}
			role="dialog"
			aria-label={t("aiTranslation.phrase.title")}
			className="fixed z-200 w-[280px] overflow-hidden rounded-card border-[0.5px] border-bd-2 bg-surf shadow-lg"
			style={{ left, top, transform: "translateY(-100%)" }}
		>
			{/* Header */}
			<div className="flex items-center justify-between border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div className="flex items-center gap-1.5">
					<span className="flex items-center gap-1 rounded-[4px] border-[0.5px] border-pur/30 bg-pur-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-pur-t">
						<Sparkles className="size-2.5" strokeWidth={1.8} />
						{t("aiTranslation.phrase.title")}
					</span>
				</div>
				<Button
					size="bare"
					onClick={onClose}
					aria-label={t("reader.sheet.close")}
					className="rounded p-0.5 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					<X className="size-3.5" strokeWidth={1.6} />
				</Button>
			</div>

			{/* Phrase */}
			<div className="border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div className="text-[13px] font-medium text-t-1 line-clamp-2">
					{phrase}
				</div>
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
					</div>
					<PhraseRefineBlock
						refineState={refineState}
						onOpen={openRefine}
						onSubmit={handleRefineSubmit}
					/>
				</>
			)}
		</div>,
		document.body,
	);
};
