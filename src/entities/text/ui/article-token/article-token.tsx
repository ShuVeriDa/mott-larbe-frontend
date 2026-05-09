"use client";

import { Typography } from "@/shared/ui/typography";
import { ComponentProps, type MouseEvent, type Ref } from "react";
import { cn } from "@/shared/lib/cn";
import { tokenStatusClass } from "../../lib/status-class";
import type { TextToken } from "../../api";

export interface ArticleTokenProps {
	token: TextToken;
	active?: boolean;
	onSelect: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
	ref?: Ref<HTMLSpanElement>;
}

export const ArticleToken = ({ token, active, onSelect, ref }: ArticleTokenProps) => {
	const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
		event.stopPropagation();
		onSelect(token, event);
	};

	const handleKeyDown: NonNullable<ComponentProps<"span">["onKeyDown"]> = event => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onSelect(token, event as unknown as MouseEvent<HTMLSpanElement>);
		}
	};

	return (
		<Typography tag="span"
			ref={ref}
			role="button"
			tabIndex={0}
			aria-label={token.text}
			data-token-id={token.id}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"cursor-pointer rounded px-px transition-colors duration-100",
				"hover:bg-acc-bg hover:text-acc-t",
				tokenStatusClass(token.userStatus),
				active && "bg-acc-bg text-acc-t",
			)}
		>
			{token.text}
		</Typography>
	);
};

ArticleToken.displayName = "ArticleToken";
