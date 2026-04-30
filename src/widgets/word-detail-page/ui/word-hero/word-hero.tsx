"use client";

import { Volume2 } from "lucide-react";
import { CefrBadge, StatusBadge } from "@/entities/dictionary";
import type { DictionaryEntryDetail } from "@/entities/dictionary";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useAudioPlayback } from "../../lib/use-audio-playback";

const FREQUENCY_DOTS = 5;

export interface WordHeroProps {
	entry: DictionaryEntryDetail;
}

export const WordHero = ({ entry }: WordHeroProps) => {
	const { t } = useI18n();
	const { play, isAvailable } = useAudioPlayback(entry.lemma?.audioUrl ?? null);

	const transliteration = entry.lemma?.transliteration ?? null;
	const partOfSpeech = entry.lemma?.partOfSpeech ?? null;
	const frequency = Math.max(
		0,
		Math.min(FREQUENCY_DOTS, entry.lemma?.frequency ?? 0),
	);

	return (
		<section
			aria-labelledby="word-hero-title"
			className="relative mb-4 overflow-hidden rounded-[14px] border-hairline border-bd-1 bg-surf p-[26px_28px_22px] max-md:p-[18px_16px_16px]"
		>
			<span
				aria-hidden="true"
				className="absolute inset-y-0 left-0 w-[3px] rounded-r-[3px] bg-acc"
			/>
			<div className="flex items-start justify-between gap-4 max-md:gap-2.5">
				<div className="min-w-0 flex-1">
					<h1
						id="word-hero-title"
						className="mb-1.5 font-display text-[38px] font-normal leading-none tracking-[-0.5px] text-t-1 max-md:text-[28px] max-lg:text-[32px]"
					>
						{entry.word}
					</h1>
					{transliteration ? (
						<p className="mb-2.5 text-[14px] italic text-t-3 max-md:mb-[7px] max-md:text-[13px]">
							{transliteration}
						</p>
					) : null}
					<p className="mb-2.5 text-[18px] leading-[1.4] text-t-2 max-md:mb-2 max-md:text-[15px]">
						{entry.translation}
					</p>
					<div className="flex flex-wrap items-center gap-1.5">
						{partOfSpeech ? (
							<span className="inline-flex items-center rounded-[6px] border-hairline border-bd-2 bg-surf-2 px-2 py-[3px] text-[11px] font-semibold text-t-2">
								{partOfSpeech}
							</span>
						) : null}
						{entry.cefrLevel ? <CefrBadge level={entry.cefrLevel} /> : null}
						<StatusBadge status={entry.learningLevel} />
						<span className="ml-1 flex items-center gap-1.5 max-md:hidden">
							<span className="text-[11px] text-t-3">
								{t("vocabulary.wordDetail.frequency")}
							</span>
							<span
								className="flex gap-[3px]"
								role="img"
								aria-label={t("vocabulary.wordDetail.frequencyValue", {
									value: frequency,
								})}
							>
								{Array.from({ length: FREQUENCY_DOTS }).map((_, i) => (
									<span
										key={i}
										className={cn(
											"size-2 rounded-[2px]",
											i < frequency ? "bg-acc" : "bg-surf-3",
										)}
									/>
								))}
							</span>
						</span>
					</div>
				</div>

				<button
					type="button"
					onClick={play}
					disabled={!isAvailable}
					aria-label={t("vocabulary.wordDetail.playAudio")}
					className={cn(
						"flex size-11 shrink-0 items-center justify-center rounded-full",
						"border-hairline border-acc/15 bg-acc-bg",
						"transition-colors duration-150",
						"hover:bg-acc hover:text-white",
						"disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-acc-bg",
						"max-md:size-[38px]",
					)}
				>
					<Volume2 className="size-4 text-acc transition-colors hover:[&]:text-white" strokeWidth={1.6} />
				</button>
			</div>
		</section>
	);
};
