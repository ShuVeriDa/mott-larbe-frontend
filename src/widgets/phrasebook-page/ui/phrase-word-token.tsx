"use client";

import type { PhraseWord } from "@/entities/phrasebook";
import { cn } from "@/shared/lib/cn";

interface PhraseWordTokenProps {
	word: PhraseWord;
	onClick: (word: PhraseWord) => void;
}

export const PhraseWordToken = ({ word, onClick }: PhraseWordTokenProps) => {
	const handleClick = () => onClick(word);

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"bg-surf-2 border-[0.5px] border-bd-1 rounded-base",
				"px-2 py-1 text-center cursor-pointer",
				"transition-colors duration-100",
				"hover:border-acc hover:bg-acc-bg [&:hover_.token-orig]:text-acc-t",
			)}
		>
			<div className="token-orig text-[12.5px] font-semibold text-t-1 leading-tight">
				{word.original}
			</div>
			<div className="text-[10.5px] text-t-3 leading-tight">
				{word.translation}
			</div>
		</button>
	);
};
