"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { CalendarDays } from "lucide-react";
import { TabButton } from "./tab-button";

export type ReviewSystem = "sm2" | "deck" | "phrases";

export interface ReviewTopbarProps {
	system: ReviewSystem;
	dueCount: number | null;
	deckCount: number | null;
	phraseCount: number | null;
	onChange: (system: ReviewSystem) => void;
}

export const ReviewTopbar = ({
	system,
	dueCount,
	deckCount,
	phraseCount,
	onChange,
}: ReviewTopbarProps) => {
	const { t } = useI18n();

	const handleClickSm2 = () => onChange("sm2");
	const handleClickDeck = () => onChange("deck");
	const handleClickPhrases = () => onChange("phrases");

	return (
		<header className="flex shrink-0 items-center gap-2.5 border-b-[0.5px] border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-3 max-md:py-2">
			<CalendarDays className="size-3.5 shrink-0 text-t-3 max-md:hidden" aria-hidden="true" />
			<Typography
				tag="h1"
				className="whitespace-nowrap text-[13.5px] font-semibold text-t-1 max-md:hidden"
			>
				{t("review.pageTitle")}
			</Typography>

			<div
				role="tablist"
				aria-label={t("review.tabs.aria")}
				className="flex min-w-0 gap-0.5 rounded-base border-[0.5px] border-bd-2 bg-surf-2 p-0.5 max-md:flex-1"
			>
				<TabButton
					label={t("review.tabs.sm2")}
					count={dueCount}
					active={system === "sm2"}
					onClick={handleClickSm2}
				/>
				<TabButton
					label={t("review.tabs.deck")}
					count={deckCount}
					active={system === "deck"}
					onClick={handleClickDeck}
				/>
				<TabButton
					label={t("review.tabs.phrases")}
					count={phraseCount}
					active={system === "phrases"}
					onClick={handleClickPhrases}
				/>
			</div>

			<Typography
				tag="span"
				className="ml-auto whitespace-nowrap text-[11.5px] text-t-3 max-lg:hidden"
			>
				{t("review.hint")}
			</Typography>
		</header>
	);
};
