"use client";

import { type ComponentProps, type MouseEvent, type ReactNode, type Ref } from "react";
import { cn } from "@/shared/lib/cn";
import { tokenStatusClass } from "../../lib/status-class";
import type { TextToken } from "../../api";

export interface ArticleTokenProps {
	token: TextToken;
	displayText?: string;
	active?: boolean;
	onSelect: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
	ref?: Ref<HTMLSpanElement>;
	children?: ReactNode;
}

export const ArticleToken = ({ token, displayText, active, onSelect, ref, children }: ArticleTokenProps) => {
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
		<span
			ref={ref}
			role="button"
			tabIndex={0}
			aria-label={token.original}
			data-token-id={token.id}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"cursor-pointer rounded px-px transition-colors duration-100 select-text",
				"hover:bg-acc-bg hover:text-acc-t",
				tokenStatusClass(token.userStatus),
				active && "bg-acc-bg text-acc-t",
			)}
		>
			{displayText ?? token.original}{children}
</span>
	);
};

ArticleToken.displayName = "ArticleToken";
