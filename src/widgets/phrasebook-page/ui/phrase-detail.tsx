"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Phrase, PhraseWord } from "@/entities/phrasebook";
import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { SectionLabel } from "@/shared/ui/section-label";
import { Check, Plus } from "lucide-react";
import { PhraseWordToken } from "./phrase-word-token";
import { useAddPhraseWords } from "../model/use-add-phrase-words";
import { toast } from "sonner";

interface PhraseDetailProps {
	phrase: Phrase;
}

export const PhraseDetail = ({ phrase }: PhraseDetailProps) => {
	const { t } = useI18n();
	const [addedToVocab, setAddedToVocab] = useState(false);
	const { mutate: addWords, isPending } = useAddPhraseWords();

	const handleWordClick = (word: PhraseWord) => {
		toast.success(
			t("phrasebook.detail.wordAdded", {
				word: word.original,
				trans: word.translation,
			}),
		);
	};

	const wordsToAdd = phrase.words.length > 0
		? phrase.words
		: [{ id: phrase.id, original: phrase.original, translation: phrase.translation, position: 0 }];

	const handleAddAllToVocab = () => {
		if (addedToVocab || isPending) return;
		addWords(wordsToAdd, {
			onSuccess: () => {
				setAddedToVocab(true);
				toast.success(t("phrasebook.detail.allWordsAdded"));
			},
		});
	};

	return (
		<motion.div
			className="border-t border-bd-1 px-3.5 py-3 flex flex-col gap-2.5"
			variants={variants.fadeUp}
			initial="hidden"
			animate="visible"
			exit="exit"
		>
			{phrase.words.length > 0 && (
				<div>
					<SectionLabel className="mb-1.5">
						{t("phrasebook.detail.wordBreakdown")}
					</SectionLabel>
					<div className="flex flex-wrap gap-1.5">
						{phrase.words.map((word) => (
							<PhraseWordToken
								key={word.id}
								word={word}
								onClick={handleWordClick}
							/>
						))}
					</div>
				</div>
			)}

			{phrase.examples.length > 0 && (
				<div>
					<SectionLabel className="mb-1.5">
						{t("phrasebook.detail.examples")}
					</SectionLabel>
					<div className="flex flex-col gap-1.5">
						{phrase.examples.map((ex) => (
							<div
								key={ex.id}
								className="px-2.5 py-1.5 bg-surf-2 rounded-base"
							>
								<div className="text-[12.5px] font-medium text-t-1">
									{ex.phrase}
								</div>
								<div className="text-[11.5px] text-t-2 mt-0.5">
									{ex.translation}
								</div>
								{ex.context && (
									<div className="text-[11px] text-t-3 mt-0.5 italic">
										{ex.context}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					onClick={handleAddAllToVocab}
					disabled={addedToVocab || isPending}
					className={
						addedToVocab
							? "inline-flex items-center gap-1 h-[26px] px-2.5 bg-surf-3 text-t-3 rounded-base text-[11.5px] font-semibold cursor-default"
							: "inline-flex items-center gap-1 h-[26px] px-2.5 bg-grn-bg text-grn-t rounded-base text-[11.5px] font-semibold cursor-pointer hover:opacity-80 transition-opacity"
					}
				>
					{addedToVocab ? (
						<>
							<Check className="size-[11px]" />
							{t("phrasebook.detail.addedToVocab")}
						</>
					) : (
						<>
							<Plus className="size-[11px]" />
							{t("phrasebook.detail.addToVocab")}
						</>
					)}
				</Button>
				<span className="text-[11px] text-t-3">
					{t("phrasebook.detail.addToVocabHint")}
				</span>
			</div>
		</motion.div>
	);
};
