"use client";

import { MouseEvent } from "react";
import type { Phrase } from "@/entities/phrasebook";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { useSavePhrase } from "@/features/save-phrase";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { toast } from "sonner";
import { PhraseActionButton } from "./phrase-action-button";
import { PhraseDetail } from "./phrase-detail";

const LANG_DOT_COLOR: Record<string, string> = {
	che: "#e53935",
	ru: "#3b82f6",
	ar: "#f59e0b",
	en: "#22c55e",
};

interface PhraseCardProps {
	phrase: Phrase;
}

export const PhraseCard = ({ phrase }: PhraseCardProps) => {
	const { t } = useI18n();
	const { openPhraseId, toggleOpenPhraseId } = usePhrasebookFilters();
	const { mutate: toggleSave, isPending } = useSavePhrase();
	const isOpen = openPhraseId === phrase.id;

	const handleToggle = () => toggleOpenPhraseId(phrase.id);

	const handleSave = (e: MouseEvent) => {
		e.stopPropagation();
		if (isPending) return;
		toggleSave(phrase.id);
	};

	const handleCopy = (e: MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard
			.writeText(phrase.original)
			.then(() => toast.success(t("phrasebook.card.copied")))
			.catch(() => {});
	};

	const dotColor = LANG_DOT_COLOR[phrase.lang] ?? LANG_DOT_COLOR.che;

	return (
		<article
			className={cn(
				"bg-surf border-[0.5px] rounded-[10px] overflow-hidden cursor-pointer",
				"transition-[border-color,box-shadow] duration-150",
				isOpen
					? "border-bd-2"
					: "border-bd-1 hover:border-bd-2 hover:shadow-sm",
			)}
		>
			<div
				className="flex items-start gap-3 px-3.5 py-3"
				onClick={handleToggle}
				role="button"
				aria-expanded={isOpen}
			>
				<span
					className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
					style={{ backgroundColor: dotColor }}
					aria-label={phrase.lang.toUpperCase()}
				/>
				<div className="flex-1 min-w-0">
					<div className="text-[14.5px] font-semibold text-t-1 mb-0.5 leading-[1.35]">
						{phrase.original}
					</div>
					{phrase.transliteration && (
						<div className="text-[11.5px] text-t-3 mb-1 italic">
							{phrase.transliteration}
						</div>
					)}
					<div className="text-[12.5px] text-t-2 leading-[1.4]">
						{phrase.translation}
					</div>
				</div>
				<div
					className="flex items-center gap-1 shrink-0"
					onClick={e => e.stopPropagation()}
					role="presentation"
				>
					<PhraseActionButton
						onClick={handleSave}
						active={phrase.saved}
						title={
							phrase.saved
								? t("phrasebook.card.unsave")
								: t("phrasebook.card.save")
						}
					>
						<svg
							viewBox="0 0 16 16"
							fill={phrase.saved ? "currentColor" : "none"}
							stroke="currentColor"
							strokeWidth="1.5"
							className="w-3 h-3"
						>
							<path d="M3 2h10v12l-5-3-5 3V2z" />
						</svg>
					</PhraseActionButton>
					<PhraseActionButton
						onClick={handleCopy}
						title={t("phrasebook.card.copy")}
					>
						<svg
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="w-3 h-3"
						>
							<rect x="5" y="5" width="8" height="9" rx="1.5" />
							<path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v8A1.5 1.5 0 0 0 3.5 13H5" />
						</svg>
					</PhraseActionButton>
				</div>
			</div>

			{isOpen && <PhraseDetail phrase={phrase} />}
		</article>
	);
};

