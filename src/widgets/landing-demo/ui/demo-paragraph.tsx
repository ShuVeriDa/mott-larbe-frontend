"use client";

import {
	DemoToken,
	type DemoTokenStatus,
} from "@/features/landing-demo-reader";
import { Typography } from "@/shared/ui/typography";

export interface DemoTokenSpec {
	word: string;
	display: string;
	status: DemoTokenStatus;
}

interface DemoParagraphProps {
	tokens: (string | DemoTokenSpec)[];
	activeWord: string | null;
	onSelect: (word: string, el: HTMLElement) => void;
}

export const DemoParagraph = ({
	tokens,
	activeWord,
	onSelect,
}: DemoParagraphProps) => (
	<Typography>
		{tokens.map((part, i) => {
			if (typeof part === "string")
				return <Typography tag="span" key={`s-${i}`}>{part}</Typography>;
			return (
				<DemoToken
					key={`t-${part.word}-${i}`}
					word={part.word}
					status={part.status}
					active={activeWord === part.word}
					onSelect={onSelect}
				>
					{part.display}
				</DemoToken>
			);
		})}
	</Typography>
);
