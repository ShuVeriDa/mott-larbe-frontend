"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { LemmaSearchResult } from "../api";

interface LemmaResultItemProps {
	lemma: LemmaSearchResult;
	selected: boolean;
	onSelect: () => void;
}

export const LemmaResultItem = ({
	lemma,
	selected,
	onSelect,
}: LemmaResultItemProps) => {
	const handleClick = () => onSelect();

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex w-full items-center gap-2 rounded-base px-3 py-2 text-left transition-colors",
				selected ? "bg-acc/10" : "hover:bg-surf-2",
			)}
		>
			<div className="min-w-0 flex-1">
				<span className="text-[13px] font-semibold text-t-1">
					{lemma.baseForm}
				</span>
				{lemma.partOfSpeech && (
					<span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide text-t-3">
						{lemma.partOfSpeech}
					</span>
				)}
				{lemma.translation && (
					<div className="truncate text-[12px] text-t-3">{lemma.translation}</div>
				)}
			</div>
			{selected && (
				<CheckIcon className="size-4 shrink-0 text-acc" strokeWidth={2} />
			)}
		</button>
	);
};
