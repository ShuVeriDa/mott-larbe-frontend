"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export interface FlipCardProps {
	flipped: boolean;
	onFlip: () => void;
	front: ReactNode;
	back: ReactNode;
	className?: string;
}

export const FlipCard = ({
	flipped,
	onFlip,
	front,
	back,
	className,
}: FlipCardProps) => (
	<div
		className={cn(
			"w-full max-w-[520px] mb-3.5",
			className,
		)}
		style={{ perspective: "1000px" }}
	>
		<button
			type="button"
			onClick={onFlip}
			aria-pressed={flipped}
			className={cn(
				"relative w-full min-h-[205px] cursor-pointer outline-none",
				"transition-transform duration-[440ms] [transform-style:preserve-3d]",
				"focus-visible:[&_.flip-face]:ring-2 focus-visible:[&_.flip-face]:ring-acc/40",
			)}
			style={{
				transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
				transformStyle: "preserve-3d",
			}}
		>
			<div
				className={cn(
					"flip-face absolute inset-0 flex flex-col items-center justify-center",
					"rounded-hero border-hairline border-bd-2 bg-surf p-7 shadow-md",
					"max-md:p-5 min-h-[205px] max-md:min-h-[185px]",
				)}
				style={{
					backfaceVisibility: "hidden",
					WebkitBackfaceVisibility: "hidden",
				}}
			>
				{front}
			</div>
			<div
				className={cn(
					"flip-face absolute inset-0 flex flex-col items-start justify-start",
					"rounded-hero border-hairline border-bd-2 bg-surf px-7 pt-5 pb-7 shadow-md",
					"max-md:px-5 max-md:pt-4 max-md:pb-5 min-h-[205px] max-md:min-h-[185px]",
				)}
				style={{
					backfaceVisibility: "hidden",
					WebkitBackfaceVisibility: "hidden",
					transform: "rotateY(180deg)",
				}}
			>
				{back}
			</div>
		</button>
	</div>
);
