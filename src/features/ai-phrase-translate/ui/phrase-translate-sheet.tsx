"use client";

import { useGeminiKeyStatus } from "@/entities/ai-translation";
import { useTranslationLanguageStore } from "@/features/ai-word-lookup";
import { useReaderScript } from "@/features/reader-script";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
} from "@/shared/ui/drawer";
import {
	Check,
	ChevronDown,
	Copy,
	ExternalLink,
	Settings,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { useAiPhraseTranslate } from "../model/use-ai-phrase-translate";
import { PhraseRefineBlock } from "./phrase-refine-block";

interface PhraseTranslateSheetProps {
	open: boolean;
	phrase: string;
	displayPhrase?: string;
	lang: string;
	contextSentence?: string;
	onClose: () => void;
}

export const PhraseTranslateSheet = ({
	open,
	phrase,
	displayPhrase,
	lang,
	contextSentence,
	onClose,
}: PhraseTranslateSheetProps) => {
	const { t } = useI18n();
	const { script } = useReaderScript();
	const isRtl = script === "ARABIC";
	const { state, refineState, translate, reset, openRefine, refine } = useAiPhraseTranslate();
	const { data: keyStatus } = useGeminiKeyStatus();
	const { targetLanguage } = useTranslationLanguageStore();

	const hasKey = keyStatus?.hasKey ?? false;

	useEffect(() => {
		if (!open) return;
		reset();
		setShowCyrillic(false);
		if (hasKey) {
			translate(phrase, contextSentence, targetLanguage);
		}
	}, [open, phrase, contextSentence, hasKey, targetLanguage]);

	const [copied, setCopied] = useState(false);
	const [glossOpen, setGlossOpen] = useState(false);
	const [showCyrillic, setShowCyrillic] = useState(false);

	const handleToggleCyrillic = () => setShowCyrillic(prev => !prev);

	const handleCopy = () => {
		if (state.phase !== "done") return;
		navigator.clipboard.writeText(state.result.translation);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const handleRefineSubmit = (hint: string) => {
		if (state.phase !== "done") return;
		refine(phrase, state.result.translation, hint, targetLanguage);
	};

	const handleGlossToggle = () => setGlossOpen(prev => !prev);
	const handleOpenChange = (isOpen: boolean) => { if (!isOpen) onClose(); };

	return (
		<Drawer open={open} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90dvh]" aria-describedby={undefined}>
				<DrawerTitle className="sr-only">{t("aiTranslation.phrase.title")}</DrawerTitle>

				<div className="min-h-0 flex-1 overflow-y-auto">
					{/* Badge + phrase */}
					<div className="relative border-b border-bd-1 px-4 py-3">
						<div className="mb-2 flex items-center gap-1.5">
							<span className="flex items-center gap-1 rounded-[4px] border-[0.5px] border-pur/30 bg-pur-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-pur-t">
								<Sparkles className="size-2.5" strokeWidth={1.8} />
								{t("aiTranslation.phrase.title")}
							</span>
						</div>
						<div
							className={cn("text-[15px] font-medium text-t-1", displayPhrase && "pr-7")}
							dir={isRtl ? "rtl" : undefined}
						>
							{displayPhrase ?? phrase}
						</div>
						{displayPhrase && (
							<>
								<Button
									onClick={handleToggleCyrillic}
									title={showCyrillic ? t("aiTranslation.phrase.hideCyrillic") : t("aiTranslation.phrase.showCyrillic")}
									className={cn(
										"absolute right-3 top-3 flex size-6 items-center justify-center rounded-full border-[0.5px] transition-colors",
										showCyrillic
											? "border-acc/40 bg-acc/10 text-acc"
											: "border-bd-2 bg-surf-2 text-t-4 hover:border-acc/40 hover:text-acc",
									)}
								>
									<ChevronDown
										className={cn("size-3.5 transition-transform", showCyrillic && "rotate-180")}
										strokeWidth={1.8}
									/>
								</Button>
								{showCyrillic && (
									<div className="mt-2 text-[13px] text-t-3">{phrase}</div>
								)}
							</>
						)}
					</div>

					{/* Body */}
					{!hasKey ? (
						<div className="flex flex-col gap-3 px-4 py-4">
							<Typography tag="p" className="text-[14px] font-medium text-t-1">
								{t("aiTranslation.popup.noKeyTitle")}
							</Typography>
							<Typography tag="p" className="text-[13px] text-t-3">
								{t("aiTranslation.popup.noKeyDescription")}
							</Typography>
							<Typography tag="p" className="text-[12px] text-grn">
								{t("aiTranslation.popup.noKeyFree")}
							</Typography>
							<div className="flex flex-col gap-2">
								<Link
									href={`/${lang}/profile?tab=ai`}
									className="inline-flex items-center gap-1.5 text-[13px] text-acc hover:underline"
								>
									<Settings className="size-3.5" strokeWidth={1.5} />
									{t("aiTranslation.popup.goToSettings")}
								</Link>
								<a
									href="https://aistudio.google.com/app/apikey"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-[13px] text-t-3 hover:text-t-1 hover:underline"
								>
									<ExternalLink className="size-3.5" strokeWidth={1.5} />
									{t("aiTranslation.popup.getKeyLink")}
								</a>
							</div>
						</div>
					) : state.phase === "idle" || state.phase === "loading" ? (
						<div className="flex flex-col items-center justify-center gap-2 p-8">
							<div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
							<div className="text-[13px] text-t-3">
								{t("aiTranslation.phrase.translating")}
							</div>
						</div>
					) : state.phase === "error" ? (
						<div className="px-4 py-4">
							<Typography tag="p" className="text-[13px] text-red-t">
								{state.errorMessage}
							</Typography>
						</div>
					) : (
						<>
							<div className="px-4 py-4">
								<div className="flex items-start justify-between gap-2">
									<div className="text-[16px] font-medium text-t-1">
										{state.result.translation}
									</div>
									<Button
										size="bare"
										onClick={handleCopy}
										aria-label={t("aiTranslation.popup.copy")}
										title={t("aiTranslation.popup.copy")}
										className="mt-0.5 shrink-0 rounded p-1 text-t-4 transition-colors hover:text-t-2"
									>
										{copied ? (
											<Check className="size-4" strokeWidth={1.8} />
										) : (
											<Copy className="size-4" strokeWidth={1.5} />
										)}
									</Button>
								</div>
								{state.result.notes && (
									<div className="mt-1.5 text-[13px] text-t-3">
										{state.result.notes}
									</div>
								)}
								{targetLanguage !== "ru" && state.result.russianGloss && (
									<div className="mt-3 border-t border-bd-1 pt-2">
										<Button
											size="bare"
											onClick={handleGlossToggle}
											className="flex items-center gap-1.5 text-[12px] text-t-4 transition-colors hover:text-t-2"
										>
											<ChevronDown
												className={cn("size-3.5 transition-transform", glossOpen && "rotate-180")}
												strokeWidth={1.6}
											/>
											{t("aiTranslation.popup.russianGloss")}
										</Button>
										{glossOpen && (
											<div className="mt-1.5 text-[13px] text-t-3">
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
				</div>

				<div className="shrink-0 border-t border-bd-1 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
					<Button
						onClick={onClose}
						className="inline-flex h-11 w-full items-center justify-center rounded-[10px] border border-bd-2 bg-surf-2 text-[14px] font-semibold text-t-2"
					>
						{t("reader.sheet.close")}
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
