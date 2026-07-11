"use client";

import { type ComponentProps, type MouseEvent, type ReactNode, type Ref, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { useLongPress } from "@/shared/lib/long-press";
import { useTokenRangeSelectionStore } from "@/shared/lib/token-range-selection";
import { tokenStatusClass } from "../../lib/status-class";
import type { TextToken } from "../../api";

export interface ArticleTokenProps {
	token: TextToken;
	displayText?: string;
	active?: boolean;
	inRange?: boolean;
	onSelect: (token: TextToken, event: MouseEvent<HTMLSpanElement>) => void;
	onLongPress?: (token: TextToken) => void;
	onRangeTap?: (token: TextToken) => void;
	ref?: Ref<HTMLSpanElement>;
	children?: ReactNode;
}

export const ArticleToken = ({
	token,
	displayText,
	active,
	inRange,
	onSelect,
	onLongPress,
	onRangeTap,
	ref,
	children,
}: ArticleTokenProps) => {
	const [justLockedIn, setJustLockedIn] = useState(false);

	const handleTokenLongPress = () => {
		setJustLockedIn(true);
		onLongPress?.(token);
	};

	const longPress = useLongPress({
		onLongPress: onLongPress ? handleTokenLongPress : undefined,
	});

	const handleAnimationEnd = () => setJustLockedIn(false);

	// Selection-mode state is read live from the store, not from a prop — a
	// prop reflects the last completed render, but the browser's synthesized
	// click after a long-press's pointerup can reach this handler before
	// React re-renders, so a prop-based check risks reading stale (false)
	// state and firing the wrong action.
	const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
		event.stopPropagation();
		if (useTokenRangeSelectionStore.getState().isActive) {
			onRangeTap?.(token);
			return;
		}
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
			onPointerDown={longPress.onPointerDown}
			onPointerMove={longPress.onPointerMove}
			onPointerUp={longPress.onPointerUp}
			onPointerCancel={longPress.onPointerCancel}
			onAnimationEnd={handleAnimationEnd}
			className={cn(
				"cursor-pointer rounded px-px transition-all duration-150 ease-out select-text",
				"hover:bg-acc-bg hover:text-acc-t",
				tokenStatusClass(token.userStatus),
				active && "bg-acc-bg text-acc-t",
				inRange && "bg-acc-bg text-acc-t",
				longPress.isPressing && "scale-[1.03] duration-300",
				justLockedIn && "animate-[token-lock-in_0.28s_ease-out]",
			)}
		>
			{displayText ?? token.original}{children}
</span>
	);
};

ArticleToken.displayName = "ArticleToken";
