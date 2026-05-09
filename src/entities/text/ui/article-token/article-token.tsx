"use client";
import { ComponentProps, forwardRef, type MouseEvent } from 'react';
import { cn } from "@/shared/lib/cn";
import { tokenStatusClass } from "../../lib/status-class";
import type { TextToken } from "../../api";

export interface ArticleTokenProps {
	token: TextToken;
	active?: boolean;
	onSelect: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
}

export const ArticleToken = forwardRef<HTMLSpanElement, ArticleTokenProps>(
	({ token, active, onSelect }, ref) => {
		const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
			event.stopPropagation();
			onSelect(token, event);
		};

				const handleKeyDown: NonNullable<ComponentProps<"span">["onKeyDown"]> = (event) => {
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
			</span>
		);
	},
);

ArticleToken.displayName = "ArticleToken";
