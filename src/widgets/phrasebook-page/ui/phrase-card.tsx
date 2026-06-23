"use client";

import { MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "@/shared/lib/animation";
import { getPhraseTranslation, type Phrase } from "@/entities/phrasebook";
import { useTranslationLanguageStore } from "@/features/ai-word-lookup";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { useSavePhrase } from "@/features/save-phrase";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Checkbox } from "@/shared/ui/checkbox";
import { Bookmark, Copy } from "lucide-react";
import { toast } from "sonner";
import { PhraseActionButton } from "./phrase-action-button";
import { PhraseDetail } from "./phrase-detail";

const LANG_DOT_COLOR: Record<string, string> = {
	CHE: "#e53935",
	RU: "#3b82f6",
	AR: "#f59e0b",
	EN: "#22c55e",
};

interface PhraseCardProps {
	phrase: Phrase;
	selectionMode: boolean;
	selected: boolean;
}

export const PhraseCard = ({ phrase, selectionMode, selected }: PhraseCardProps) => {
	const { t } = useI18n();
	const targetLanguage = useTranslationLanguageStore(s => s.targetLanguage);
	const translation = getPhraseTranslation(phrase, targetLanguage);
	const { openPhraseId, toggleOpenPhraseId, toggleSelectPhrase } = usePhrasebookFilters();
	const { mutate: toggleSave, isPending } = useSavePhrase();
	const isOpen = openPhraseId === phrase.id;

	const handleToggle = () => {
		if (selectionMode) {
			toggleSelectPhrase(phrase.id);
		} else {
			toggleOpenPhraseId(phrase.id);
		}
	};

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
		<motion.article
			variants={variants.fadeIn}
			initial="hidden"
			animate="visible"
			className={cn(
				"bg-surf border-[0.5px] rounded-[10px] overflow-hidden cursor-pointer",
				"transition-[border-color,box-shadow,transform] duration-150 ease-out",
				"[@media(hover:hover)]:hover:-translate-y-px",
				selected
					? "border-primary"
					: isOpen
						? "border-bd-2"
						: "border-bd-1 hover:border-bd-2 hover:shadow-sm",
			)}
		>
			<div
				className="flex items-start gap-3 px-3.5 py-3"
				onClick={handleToggle}
				role="button"
				aria-expanded={selectionMode ? undefined : isOpen}
				aria-pressed={selectionMode ? selected : undefined}
			>
				{selectionMode ? (
					<Checkbox
						checked={selected}
						onCheckedChange={() => toggleSelectPhrase(phrase.id)}
						onClick={e => e.stopPropagation()}
						aria-label={selected ? t("phrasebook.selection.deselect") : t("phrasebook.selection.select")}
						className="shrink-0 mt-px"
					/>
				) : (
					<span
						className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]"
						style={{ backgroundColor: dotColor }}
						aria-label={phrase.lang}
					/>
				)}
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
						{translation}
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
						<Bookmark className="size-3" fill={phrase.saved ? "currentColor" : "none"} />
					</PhraseActionButton>
					<PhraseActionButton
						onClick={handleCopy}
						title={t("phrasebook.card.copy")}
					>
						<Copy className="size-3" />
					</PhraseActionButton>
				</div>
			</div>

			<AnimatePresence>
				{!selectionMode && isOpen && <PhraseDetail phrase={phrase} />}
			</AnimatePresence>
		</motion.article>
	);
};

