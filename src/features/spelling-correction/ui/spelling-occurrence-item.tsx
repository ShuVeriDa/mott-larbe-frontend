"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import { Typography } from "@/shared/ui/typography";
import type { SpellingOccurrence } from "../model/types";
import { parseCorrectForm } from "@/entities/spelling-dictionary";

interface SpellingOccurrenceItemProps {
	occurrence: SpellingOccurrence;
	checked: boolean;
	onToggle: (index: number) => void;
}

export const SpellingOccurrenceItem = ({
	occurrence,
	checked,
	onToggle,
}: SpellingOccurrenceItemProps) => {
	const handleCheckedChange = () => onToggle(occurrence.index);

	return (
		<label className="flex cursor-pointer items-start gap-2.5 px-4 py-2.5 transition-colors hover:bg-surf-2">
			<Checkbox
				checked={checked}
				onCheckedChange={handleCheckedChange}
				className="mt-0.5 shrink-0"
			/>
			<Typography tag="span" className="min-w-0 text-[12.5px] leading-snug text-t-2">
				{occurrence.before ? (
					<Typography tag="span" className="text-t-3">{occurrence.before} </Typography>
				) : null}
				<Typography tag="span" className="font-semibold text-rose-600 line-through">
					{occurrence.originalText}
				</Typography>
				<Typography tag="span" className="mx-1.5 text-t-4">→</Typography>
				<Typography tag="span" className="font-semibold text-t-1">
					{parseCorrectForm(occurrence.correctForm).map((node, i) =>
						node.superscript ? <sup key={i}>{node.text}</sup> : <span key={i}>{node.text}</span>
					)}
				</Typography>
				{occurrence.after ? (
					<Typography tag="span" className="text-t-3"> {occurrence.after}</Typography>
				) : null}
			</Typography>
		</label>
	);
};
