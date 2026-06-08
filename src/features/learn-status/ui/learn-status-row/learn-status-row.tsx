"use client";

import { Button } from "@/shared/ui/button";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { LearningLevel } from "@/shared/types";
import { LEARNING_LEVELS } from "@/shared/types";
import { ComponentProps } from "react";
import { useUpdateLearnStatus } from "../../model";

const ACTIVE_CLASS: Record<LearningLevel, string> = {
	NEW: "bg-surf-3 border-bd-2 text-t-2",
	LEARNING: "bg-amb-bg border-amb/30 text-amb-t",
	KNOWN: "bg-grn-bg border-grn/30 text-grn-t",
};

export interface LearnStatusRowProps {
	lemmaId: string;
	tokenId?: string;
	textId?: string;
	current: LearningLevel | null;
	compact?: boolean;
}

export const LearnStatusRow = ({
	lemmaId,
	tokenId,
	textId,
	current,
	compact = false,
}: LearnStatusRowProps) => {
	const { t } = useI18n();
	const { mutate, isPending, variables } = useUpdateLearnStatus();
	const optimistic = isPending ? variables?.status : null;
	const active = optimistic ?? current;

	const handleSelect = (status: LearningLevel) => {
		if (status === active) return;
		mutate({ lemmaId, status, tokenId, textId });
	};

	return (
		<div className="flex gap-1.5">
			{LEARNING_LEVELS.map(level => {
				const isActive = level === active;
				const handleClick: NonNullable<
					ComponentProps<"button">["onClick"]
				> = () => handleSelect(level);
				return (
					<Button
						key={level}
						disabled={isPending}
						onClick={handleClick}
						title={t(`reader.learnStatus.${level}`)}
						className={cn(
							"flex flex-1 items-center justify-center rounded-base",
							"border-[0.5px] border-bd-1 bg-surf-2 font-semibold",
							"transition-all duration-150",
							"hover:border-bd-2 hover:text-t-1 disabled:opacity-60",
							compact ? "h-[26px] text-[11px]" : "h-[30px] text-[11px]",
							isActive ? ACTIVE_CLASS[level] : "text-t-2",
						)}
					>
						{t(`reader.learnStatus.${level}`)}
					</Button>
				);
			})}
		</div>
	);
};
