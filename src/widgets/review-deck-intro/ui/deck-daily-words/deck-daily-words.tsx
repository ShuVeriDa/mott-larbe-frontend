"use client";

import type { DeckDailyWord } from "@/entities/deck";
import { deckApi, deckKeys, useDeckDaily } from "@/entities/deck";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const DeckDailyWords = () => {
	const { t } = useI18n();
	const { data: words, isLoading } = useDeckDaily();
	const queryClient = useQueryClient();

	const [addingAll, setAddingAll] = useState(false);
	const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
	const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

	const visibleWords = words?.filter(w => !addedIds.has(w.lemmaId)) ?? [];

	const handleAdd = async (lemmaId: string) => {
		setAddingIds(prev => new Set(prev).add(lemmaId));
		try {
			await deckApi.addWord(lemmaId);
			setAddedIds(prev => new Set(prev).add(lemmaId));
			queryClient.invalidateQueries({ queryKey: deckKeys.stats() });
			queryClient.invalidateQueries({ queryKey: deckKeys.daily() });
		} finally {
			setAddingIds(prev => {
				const next = new Set(prev);
				next.delete(lemmaId);
				return next;
			});
		}
	};

	const handleAddAll = async () => {
		if (!words?.length) return;
		setAddingAll(true);
		try {
			for (const word of words) {
				if (!addedIds.has(word.lemmaId)) {
					await deckApi.addWord(word.lemmaId);
					setAddedIds(prev => new Set(prev).add(word.lemmaId));
				}
			}
			queryClient.invalidateQueries({ queryKey: deckKeys.stats() });
			queryClient.invalidateQueries({ queryKey: deckKeys.daily() });
		} finally {
			setAddingAll(false);
		}
	};

	if (isLoading) return null;

	if (!visibleWords.length) {
		return (
			<div className="w-full max-w-[500px] rounded-card border-[0.5px] border-bd-2 bg-surf px-4 py-3.5 text-center shadow-sm">
				<div className="mb-0.5 text-[13px] font-semibold text-t-2">
					{t("review.deck.intro.daily.empty")}
				</div>
				<div className="text-[11px] text-t-3">
					{t("review.deck.intro.daily.emptyHint")}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-[500px] rounded-card border-[0.5px] border-bd-2 bg-surf px-4 py-3.5 shadow-sm">
			<div className="mb-2.5 flex items-center justify-between gap-2">
				<div>
					<Typography tag="h2" className="text-[13px] font-semibold text-t-1">
						{t("review.deck.intro.daily.title")}
					</Typography>
					<div className="text-[11px] text-t-3">
						{t("review.deck.intro.daily.subtitle")}
					</div>
				</div>
				<Button variant="outline" onClick={handleAddAll} disabled={addingAll}>
					{addingAll
						? t("review.deck.intro.daily.adding")
						: t("review.deck.intro.daily.addAll")}
				</Button>
			</div>

			<ul className="flex flex-col gap-1">
				{visibleWords.map(word => (
					<DailyWordRow
						key={word.lemmaId}
						word={word}
						isAdding={addingIds.has(word.lemmaId)}
						onAdd={handleAdd}
					/>
				))}
			</ul>
		</div>
	);
};

interface DailyWordRowProps {
	word: DeckDailyWord;
	isAdding: boolean;
	onAdd: (lemmaId: string) => void;
}

const DailyWordRow = ({ word, isAdding, onAdd }: DailyWordRowProps) => {
	const { t } = useI18n();

	const handleClick = () => onAdd(word.lemmaId);

	return (
		<li className="flex items-center justify-between gap-3 rounded-base px-1 py-1.5">
			<div className="min-w-0 flex-1">
				<span className="text-[13px] font-semibold text-t-1">{word.word}</span>
				{word.translation ? (
					<span className="ml-2 text-[12px] text-t-3">{word.translation}</span>
				) : null}
			</div>
			<Button
				variant="outline"
				onClick={handleClick}
				disabled={isAdding}
				className="shrink-0"
			>
				{isAdding
					? t("review.deck.intro.daily.adding")
					: t("review.deck.intro.daily.add")}
			</Button>
		</li>
	);
};
