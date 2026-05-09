"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { LEARNING_LEVELS, type LearningLevel } from "@/shared/types";
import { useUpdateWord } from "../../model";

const ACTIVE_CLASS: Record<LearningLevel, string> = {
	NEW: "bg-surf-3 border-bd-2 text-t-1",
	LEARNING: "bg-amb-bg border-amb/20 text-amb-t",
	KNOWN: "bg-grn-bg border-grn/20 text-grn-t",
};

const LABEL_KEY: Record<LearningLevel, string> = {
	NEW: "vocabulary.statusCard.new",
	LEARNING: "vocabulary.statusCard.learning",
	KNOWN: "vocabulary.statusCard.known",
};

export interface StatusButtonsProps {
	wordId: string;
	current: LearningLevel;
}

export const StatusButtons = ({ wordId, current }: StatusButtonsProps) => {
	const { t } = useI18n();
	const { mutate, isPending } = useUpdateWord();

	return (
		<div className="mb-2 flex gap-1">
			{LEARNING_LEVELS.map((level) => {
				const active = current === level;
								const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = (e) => {
							e.stopPropagation();
							mutate({ id: wordId, body: { learningLevel: level }, previousLevel: current });
						};
return (
					<button
						key={level}
						type="button"
						disabled={isPending || active}
						onClick={handleClick}
						className={cn(
							"flex-1 rounded-md px-1.5 py-1 text-[10.5px] font-semibold transition-all duration-100",
							"border-hairline cursor-pointer text-center font-[inherit]",
							"focus-visible:ring-2 focus-visible:ring-acc/40 outline-none",
							"disabled:cursor-default",
							active
								? ACTIVE_CLASS[level]
								: "bg-surf-2 border-bd-1 text-t-2 hover:border-bd-2 hover:text-t-1",
						)}
					>
						{t(LABEL_KEY[level])}
					</button>
				);
			})}
		</div>
	);
};
