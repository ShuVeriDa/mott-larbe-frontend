"use client";

import type { DeckDailyWordCount } from "@/entities/deck";
import { useDeckSettings, useUpdateDeckSettings } from "@/entities/deck";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useState } from "react";

const DAILY_OPTIONS: DeckDailyWordCount[] = [3, 5, 10];
const NUMBERED_DECKS_OPTIONS = [1, 2, 3, 4, 5] as const;
const DECK_MAX_SIZE_MIN = 10;
const DECK_MAX_SIZE_MAX = 500;

interface DeckSettingsFormProps {
	onSaved?: () => void;
}

export const DeckSettingsForm = ({ onSaved }: DeckSettingsFormProps) => {
	const { t } = useI18n();
	const { data: settings } = useDeckSettings();
	const { mutate: updateSettings, isPending } = useUpdateDeckSettings();

	const [dailyWordCount, setDailyWordCount] = useState<DeckDailyWordCount>(
		() => settings?.dailyWordCount ?? 5,
	);
	const [deckMaxSize, setDeckMaxSize] = useState(
		() => settings?.deckMaxSize ?? 90,
	);
	const [dailyNumberedDecks, setDailyNumberedDecks] = useState(
		() => settings?.dailyNumberedDecks ?? 1,
	);
	const [savedFlash, setSavedFlash] = useState(false);

	const isDirty =
		settings &&
		(dailyWordCount !== settings.dailyWordCount ||
			deckMaxSize !== settings.deckMaxSize ||
			dailyNumberedDecks !== settings.dailyNumberedDecks);

	const handleDailySelect = (value: number) =>
		setDailyWordCount(value as DeckDailyWordCount);

	const handleDeckMaxSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = parseInt(e.currentTarget.value, 10);
		if (!isNaN(raw)) {
			setDeckMaxSize(
				Math.min(DECK_MAX_SIZE_MAX, Math.max(DECK_MAX_SIZE_MIN, raw)),
			);
		}
	};

	const handleDailyNumberedDecksSelect = (value: number) =>
		setDailyNumberedDecks(value);

	const handleSave = () => {
		updateSettings(
			{ dailyWordCount, deckMaxSize, dailyNumberedDecks },
			{
				onSuccess: () => {
					setSavedFlash(true);
					setTimeout(() => {
						setSavedFlash(false);
						onSaved?.();
					}, 1000);
				},
			},
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<div>
				<div className="mb-1.5 text-[12px] text-t-2">
					{t("review.deck.intro.settings.dailyWordCount")}
				</div>
				<div className="flex gap-2">
					{DAILY_OPTIONS.map(n => (
						<OptionButton
							key={n}
							value={n}
							selected={dailyWordCount === n}
							onSelect={handleDailySelect}
						/>
					))}
				</div>
			</div>

			<div>
				<div className="mb-1.5 text-[12px] text-t-2">
					{t("review.deck.intro.settings.dailyNumberedDecks")}
				</div>
				<div className="flex gap-2">
					{NUMBERED_DECKS_OPTIONS.map(n => (
						<OptionButton
							key={n}
							value={n}
							selected={dailyNumberedDecks === n}
							onSelect={handleDailyNumberedDecksSelect}
						/>
					))}
				</div>
			</div>

			<div>
				<div className="mb-1.5 text-[12px] text-t-2">
					{t("review.deck.intro.settings.deckMaxSize")}
				</div>
				<Input
					type="number"
					min={DECK_MAX_SIZE_MIN}
					max={DECK_MAX_SIZE_MAX}
					value={deckMaxSize}
					onChange={handleDeckMaxSizeChange}
					className="h-8 w-24 rounded-base border-[0.5px] border-bd-2 bg-surf px-2 text-[13px] text-t-1 outline-none focus:border-acc"
				/>
				<div className="mt-1 text-[11px] text-t-3">
					{t("review.deck.intro.settings.deckMaxSizeHint")}
				</div>
			</div>

			<Button
				variant="action"
				onClick={handleSave}
				disabled={isPending || !isDirty}
				className="w-full"
			>
				{isPending
					? t("review.deck.intro.settings.saving")
					: savedFlash
						? t("review.deck.intro.settings.saved")
						: t("review.deck.intro.settings.save")}
			</Button>
		</div>
	);
};

interface OptionButtonProps {
	value: number;
	selected: boolean;
	onSelect: (value: number) => void;
}

const OptionButton = ({ value, selected, onSelect }: OptionButtonProps) => {
	const handleClick = () => onSelect(value);

	return (
		<button
			type="button"
			onClick={handleClick}
			className={`flex h-8 w-10 items-center justify-center rounded-base border-[0.5px] text-[13px] font-semibold transition-colors ${
				selected
					? "border-acc bg-acc-bg text-acc"
					: "border-bd-2 bg-surf text-t-2 hover:border-bd-1 hover:text-t-1"
			}`}
		>
			{value}
		</button>
	);
};
