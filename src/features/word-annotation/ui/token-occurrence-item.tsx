"use client";

import { Checkbox } from "@/shared/ui/checkbox";
import { Typography } from "@/shared/ui/typography";
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
			<Typography tag="span" className="text-[12px] leading-normal text-t-2">
				{occurrence.before ? (
					<Typography tag="span" className="text-t-3">{occurrence.before} </Typography>
				) : null}
				<Typography tag="span" className="font-semibold text-t-1">{occurrence.word}</Typography>
				{occurrence.after ? (
					<Typography tag="span" className="text-t-3"> {occurrence.after}</Typography>
				) : null}
			</Typography>
		</label>
	);
};
