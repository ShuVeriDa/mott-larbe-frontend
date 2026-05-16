"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import type { TokenOccurrence } from "../api/types";

interface TokenOccurrenceItemProps {
	occurrence: TokenOccurrence;
	checked: boolean;
	onToggle: (tokenId: string) => void;
}

export const TokenOccurrenceItem = ({
	occurrence,
	checked,
	onToggle,
}: TokenOccurrenceItemProps) => {
	const handleCheckedChange = () => onToggle(occurrence.tokenId);

	return (
		<label className="flex cursor-pointer items-start gap-2.5 px-3 py-2 transition-colors hover:bg-surf-2">
			<Checkbox
				checked={checked}
				onCheckedChange={handleCheckedChange}
				className="mt-0.5 shrink-0"
			/>
			<span className="text-[12px] leading-normal text-t-2">
				{occurrence.before ? (
					<span className="text-t-3">{occurrence.before} </span>
				) : null}
				<span className="font-semibold text-t-1">{occurrence.word}</span>
				{occurrence.after ? (
					<span className="text-t-3"> {occurrence.after}</span>
				) : null}
			</span>
		</label>
	);
};
