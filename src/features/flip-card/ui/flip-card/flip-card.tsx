"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import type { ReactNode } from "react";

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
		className={cn("w-full max-w-[520px] mb-3.5", className)}
		style={{ perspective: "1000px" }}
	>
		{/* Desktop: 3D flip animation with absolute positioning */}
		<Button
			onClick={onFlip}
			aria-pressed={flipped}
			className={cn(
				"relative w-full min-h-[205px] cursor-pointer outline-none max-md:hidden",
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
					"rounded-hero border-[0.5px] border-bd-2 bg-surf p-7 shadow-md min-h-[205px]",
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
					"rounded-hero border-[0.5px] border-bd-2 bg-surf px-7 pt-5 pb-7 shadow-md min-h-[205px]",
				)}
				style={{
					backfaceVisibility: "hidden",
					WebkitBackfaceVisibility: "hidden",
					transform: "rotateY(180deg)",
				}}
			>
				{back}
			</div>
		</Button>

		{/* Mobile: simple show/hide, height grows with content */}
		<button
			type="button"
			onClick={onFlip}
			aria-pressed={flipped}
			className="hidden w-full cursor-pointer outline-none max-md:block"
		>
			<div
				className={cn(
					"w-full rounded-hero border-[0.5px] border-bd-2 bg-surf shadow-md",
					flipped
						? "flex flex-col items-start px-5 pt-4 pb-5"
						: "flex flex-col items-center justify-center p-5 min-h-[160px]",
				)}
			>
				{flipped ? back : front}
			</div>
		</button>
	</div>
);
