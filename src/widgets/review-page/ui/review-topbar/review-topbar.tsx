"use client";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export type ReviewSystem = "sm2" | "deck";

export interface ReviewTopbarProps {
	system: ReviewSystem;
	dueCount: number | null;
	deckCount: number | null;
	onChange: (system: ReviewSystem) => void;
}

export const ReviewTopbar = ({
	system,
	dueCount,
	deckCount,
	onChange,
}: ReviewTopbarProps) => {
	const { t } = useI18n();

		const handleClick: NonNullable<ComponentProps<typeof TabButton>["onClick"]> = () => onChange("sm2");
	const handleClick2: NonNullable<ComponentProps<typeof TabButton>["onClick"]> = () => onChange("deck");
return (
		<header className="flex shrink-0 items-center gap-2.5 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-3.5 max-md:py-2.5">
			<svg
				viewBox="0 0 15 15"
				fill="none"
				className="size-3.5 shrink-0 text-t-3 max-md:hidden"
				aria-hidden="true"
			>
				<rect
					x="2.5"
					y="3.5"
					width="10"
					height="8"
					rx="1.5"
					stroke="currentColor"
					strokeWidth="1.2"
				/>
				<path
					d="M5 3.5V2.5M10 3.5V2.5M2.5 7h10"
					stroke="currentColor"
					strokeWidth="1.2"
					strokeLinecap="round"
				/>
			</svg>
			<Typography
				tag="h1"
				className="whitespace-nowrap text-[13.5px] font-semibold text-t-1 max-md:hidden"
			>
				{t("review.pageTitle")}
			</Typography>

			<div
				role="tablist"
				aria-label={t("review.tabs.aria")}
				className="flex gap-0.5 rounded-base border-hairline border-bd-2 bg-surf-2 p-0.5 max-md:flex-1"
			>
				<TabButton
					label={t("review.tabs.sm2")}
					count={dueCount}
					active={system === "sm2"}
					onClick={handleClick}
				/>
				<TabButton
					label={t("review.tabs.deck")}
					count={deckCount}
					active={system === "deck"}
					onClick={handleClick2}
				/>
			</div>

			<Typography
				tag="span"
				className="ml-auto whitespace-nowrap text-[11.5px] text-t-3 max-lg:hidden"
			>
				{t("review.hint")}
			</Typography>
		</header>
	);
};

interface TabButtonProps {
	label: string;
	count: number | null;
	active: boolean;
	onClick: () => void;
}

const TabButton = ({ label, count, active, onClick }: TabButtonProps) => (
	<Button
		role="tab"
		aria-selected={active}
		onClick={onClick}
		className={cn(
			"flex h-[26px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[6px] border-0 px-2.5 text-[12px] font-medium transition-colors duration-150 max-md:flex-1 max-md:justify-center",
			active
				? "bg-surf font-semibold text-t-1 shadow-sm"
				: "bg-transparent text-t-3 hover:text-t-2",
		)}
	>
		{label}
		{count !== null && count > 0 ? (
			<Typography tag="span"
				className={cn(
					"rounded-[3px] px-1.5 py-px text-[10px] font-bold",
					active
						? "bg-acc-bg text-acc-t"
						: "bg-amb-bg text-amb-t",
				)}
			>
				{count}
			</Typography>
		) : null}
	</Button>
);
