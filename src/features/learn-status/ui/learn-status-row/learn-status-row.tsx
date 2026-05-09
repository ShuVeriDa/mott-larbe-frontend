"use client";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { LearningLevel } from "@/shared/types";
import { useUpdateLearnStatus } from "../../model";

const LEVELS: LearningLevel[] = ["NEW", "LEARNING", "KNOWN"];

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
}

export const LearnStatusRow = ({
	lemmaId,
	tokenId,
	textId,
	current,
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
			{LEVELS.map((level) => {
				const isActive = level === active;
								const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => handleSelect(level);
return (
					<Button
						key={level}
						disabled={isPending}
						onClick={handleClick}
						className={cn(
							"flex h-[30px] flex-1 items-center justify-center rounded-base",
							"border-hairline border-bd-1 bg-surf-2 text-[11px] font-semibold",
							"transition-all duration-150",
							"hover:border-bd-2 hover:text-t-1 disabled:opacity-60",
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
