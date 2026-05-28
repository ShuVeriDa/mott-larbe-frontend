"use client";

import { useGeminiKeyStatus } from "@/entities/ai-translation";
import {
	useAiKeyNudge,
	useAiSessionStore,
	useAiWordLookup,
	useAiWordRefine,
	useTranslationLanguageStore,
	WordRefineBlock,
} from "@/features/ai-word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	Check,
	CheckCircle2,
	ChevronDown,
	Clock,
	Copy,
	ExternalLink,
	Settings,
	Sparkles,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GeminiLimitBanner } from "./gemini-limit-banner";

interface AiWordPopupBodyProps {
	word: string;
	normalized: string;
	contextSentence?: string;
	lang: string;
}

export const AiWordPopupBody = ({
	word,
	normalized,
	contextSentence,
	lang,
}: AiWordPopupBodyProps) => {
	const { t } = useI18n();
	const { state, voted, translate, vote } = useAiWordLookup();
	const { refineState, openRefine, refine: refineWord } = useAiWordRefine();
	const { data: keyStatus } = useGeminiKeyStatus();
	const addToSession = useAiSessionStore(s => s.add);
	const { showNudge, dismiss } = useAiKeyNudge();
	const { targetLanguage } = useTranslationLanguageStore();

	const hasKey = keyStatus?.hasKey ?? false;

	useEffect(() => {
		if (hasKey) {
			translate(normalized, contextSentence, targetLanguage);
		}
	}, [normalized, contextSentence, hasKey, targetLanguage]);

	useEffect(() => {
		if (state.phase === "done") {
			addToSession(word, state.result);
		}
	}, [state.phase]);

	const [copied, setCopied] = useState(false);
	const [glossOpen, setGlossOpen] = useState(false);

	const handleThumbsUp = () => vote("up");
	const handleThumbsDown = () => vote("down");
	const handleRefineSubmit = (hint: string) => {
		if (state.phase !== "done") return;
		refineWord(word, state.result.translation, hint, contextSentence, targetLanguage);
	};
	const handleCopy = () => {
		if (state.phase !== "done") return;
		navigator.clipboard.writeText(state.result.translation);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};
	const handleGlossToggle = () => setGlossOpen(prev => !prev);

	if (!hasKey) {
		return (
			<div className="flex flex-col gap-2.5 px-3.5 py-3">
				<div className="flex items-start gap-2">
					<div className="relative mt-0.5 shrink-0">
						<Sparkles className="size-3.5 text-pur-t" strokeWidth={1.6} />
						{showNudge && (
							<span className="absolute -right-1 -top-1 flex size-2">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-acc opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-acc" />
							</span>
						)}
					</div>
					<Typography tag="p" className="text-[12.5px] font-medium text-t-1">
						{t("aiTranslation.popup.noKeyTitle")}
					</Typography>
				</div>
				<Typography tag="p" className="text-[11.5px] text-t-3">
					{t("aiTranslation.popup.noKeyDescription")}
				</Typography>
				<Typography tag="p" className="text-[11px] text-grn">
					{t("aiTranslation.popup.noKeyFree")}
				</Typography>
				<div className="flex flex-col gap-1.5">
					<Link
						href={`/${lang}/profile?tab=ai`}
						onClick={dismiss}
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
		);
	}

	if (state.phase === "loading" || state.phase === "idle") {
		return (
			<div className="flex flex-col items-center justify-center gap-2 p-6">
				<div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
				<div className="text-[12px] text-t-3">
					{t("aiTranslation.popup.translating")}
				</div>
			</div>
		);
	}

	if (state.phase === "not_chechen") {
		return (
			<div className="px-3.5 py-3">
				<Typography tag="p" className="text-[12.5px] text-t-3">
					{t("aiTranslation.popup.notChechen")}
				</Typography>
			</div>
		);
	}

	if (state.phase === "location_not_supported") {
		return (
			<div className="px-3.5 py-3">
				<Typography tag="p" className="text-[12.5px] text-t-3">
					{t("aiTranslation.phrase.errorLocationNotSupported")}
				</Typography>
			</div>
		);
	}

	if (state.phase === "error" || state.phase === "no_key") {
		return (
			<div className="px-3.5 py-3">
				<Typography tag="p" className="text-[12.5px] text-red-t">
					{t("aiTranslation.popup.error")}
				</Typography>
			</div>
		);
	}

	const result = state.result;
	const showGloss = targetLanguage !== "ru" && Boolean(result.russianGloss);

	return (
		<>
			<GeminiLimitBanner />
			<div className="border-b-[0.5px] border-bd-1 px-3.5 pt-3.5 pb-2.5">
				<div className="mb-1.5 flex items-start justify-between gap-2">
					<div className="flex items-start gap-2">
						<div className="text-[17px] font-semibold tracking-[-0.2px] text-t-1">
							{word}
						</div>
						<span className="mt-0.5 flex shrink-0 items-center gap-0.5 rounded-[4px] border-[0.5px] border-pur/30 bg-pur-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-pur-t">
							<Sparkles className="size-2.5" strokeWidth={1.8} />
							{t("aiTranslation.popup.badge")}
						</span>
					</div>
					</div>
			</div>

			<div className="border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div className="flex items-start justify-between gap-2">
					<div className="text-[14px] font-medium text-t-1">
						{result.translation}
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
				<div
					className={cn(
						"mt-1 flex items-center gap-1 text-[10.5px]",
						result.fromCache && result.status === "APPROVED"
							? "text-grn"
							: result.fromCache
								? "text-t-4"
								: "text-pur-t",
					)}
				>
					{result.fromCache && result.status === "APPROVED" ? (
						<>
							<CheckCircle2 className="size-2.5" strokeWidth={1.8} />
							{t("aiTranslation.popup.sourceApproved")}
						</>
					) : result.fromCache ? (
						<>
							<Clock className="size-2.5" strokeWidth={1.8} />
							{t("aiTranslation.popup.sourcePending")}
						</>
					) : (
						<>
							<Sparkles className="size-2.5" strokeWidth={1.8} />
							{t("aiTranslation.popup.sourceFresh")}
						</>
					)}
				</div>
				{result.partOfSpeech && (
					<div className="mt-1.5 text-[11.5px] text-t-3">
						{t("aiTranslation.popup.partOfSpeech")}:{" "}
						<span className="text-t-2">{result.partOfSpeech}</span>
					</div>
				)}
				{result.transliteration && (
					<div className="mt-0.5 text-[11.5px] text-t-3">
						{t("aiTranslation.popup.transliteration")}:{" "}
						<span className="font-medium text-t-2">
							{result.transliteration}
						</span>
					</div>
				)}
				{result.example && (
					<div className="mt-1.5 text-[11.5px] text-t-3 italic">
						{result.example}
					</div>
				)}

				{showGloss && (
					<div className="mt-2 border-t border-bd-1 pt-1.5">
						<Button
							size="bare"
							onClick={handleGlossToggle}
							className="flex items-center gap-1 text-[10.5px] text-t-4 hover:text-t-2 transition-colors"
						>
							<ChevronDown
								className={cn("size-3 transition-transform", glossOpen && "rotate-180")}
								strokeWidth={1.6}
							/>
							{t("aiTranslation.popup.russianGloss")}
						</Button>
						{glossOpen && (
							<div className="mt-1 text-[11.5px] text-t-3">
								{result.russianGloss}
							</div>
						)}
					</div>
				)}
			</div>

			<div className="flex items-center justify-between gap-2 px-3.5 py-2">
				<div className="flex gap-1.5">
					<Button
						size="bare"
						onClick={handleThumbsUp}
						disabled={Boolean(voted)}
						aria-label={t("aiTranslation.admin.thumbsUp")}
						title={t("aiTranslation.admin.thumbsUp")}
						className={`flex h-7 items-center gap-1 rounded-base px-2 text-[11.5px] border-[0.5px] transition-colors ${
							voted === "up"
								? "border-grn/40 bg-grn/10 text-grn"
								: "border-bd-1 bg-surf-2 text-t-3 hover:text-t-1"
						}`}
					>
						<ThumbsUp className="size-3" strokeWidth={1.5} />
						{result.thumbsUp + (voted === "up" ? 1 : 0)}
					</Button>
					<Button
						size="bare"
						onClick={handleThumbsDown}
						disabled={Boolean(voted)}
						aria-label={t("aiTranslation.admin.thumbsDown")}
						title={t("aiTranslation.admin.thumbsDown")}
						className={`flex h-7 items-center gap-1 rounded-base px-2 text-[11.5px] border-[0.5px] transition-colors ${
							voted === "down"
								? "border-red/40 bg-red/10 text-red"
								: "border-bd-1 bg-surf-2 text-t-3 hover:text-t-1"
						}`}
					>
						<ThumbsDown className="size-3" strokeWidth={1.5} />
						{result.thumbsDown + (voted === "down" ? 1 : 0)}
					</Button>
				</div>
			</div>
			<WordRefineBlock
				refineState={refineState}
				size="sm"
				onOpen={openRefine}
				onSubmit={handleRefineSubmit}
			/>
		</>
	);
};
