"use client";

import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { Fragment, type MouseEvent } from "react";
import type { TextToken } from "../../api";
import { tokenizeContent } from "../../lib/tokenize-content";
import { ArticleToken } from "../article-token";

export interface ArticleTokenizedProps {
	contentRaw: string;
	tokens: readonly TextToken[];
	activeTokenId?: string | null;
	onSelectToken: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
	className?: string;
}

export const ArticleTokenized = ({
	contentRaw,
	tokens,
	activeTokenId,
	onSelectToken,
	className,
}: ArticleTokenizedProps) => {
	const paragraphs = tokenizeContent(contentRaw, tokens);

	return (
		<div
			className={cn(
				"font-display text-t-1",
				"max-w-[680px] mx-auto",
				className,
			)}
			style={{
				fontSize: "var(--reader-font-size, 16px)",
				lineHeight: "var(--reader-line-height, 1.85)",
			}}
		>
			{paragraphs.map((para, idx) => (
				<Typography
					tag="p"
					key={idx}
					className="mb-5 last:mb-0 tracking-[0.01em]"
				>
					{para.segments.map((segment, segIdx) => {
						if (segment.kind === "text") {
							return <Fragment key={segIdx}>{segment.value}</Fragment>;
						}
						return (
							<ArticleToken
								key={segment.token.id}
								token={segment.token}
								active={activeTokenId === segment.token.id}
								onSelect={onSelectToken}
							/>
						);
					})}
				</Typography>
			))}
		</div>
	);
};
