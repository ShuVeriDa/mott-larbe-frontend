import type { ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export type FeatureIconColor =
	| "acc"
	| "grn"
	| "pur"
	| "amb"
	| "red"
	| "neutral";

const ICON_BG: Record<FeatureIconColor, string> = {
	acc: "bg-acc-bg text-acc-t",
	grn: "bg-grn-bg text-grn-t",
	pur: "bg-pur-bg text-pur-t",
	amb: "bg-amb-bg text-amb-t",
	red: "bg-red-bg text-red-t",
	neutral: "bg-surf-3 text-t-1",
};

interface FeatureCardProps {
	title: string;
	description: string;
	icon: ReactNode;
	iconColor: FeatureIconColor;
}

export const FeatureCard = ({
	title,
	description,
	icon,
	iconColor,
}: FeatureCardProps) => (
	<article className="rounded-[12px] border-hairline border-bd-2 bg-surf p-[22px] pb-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-bd-3 max-[640px]:p-5">
		<div
			className={cn(
				"mb-4 flex h-[38px] w-[38px] items-center justify-center rounded-[9px]",
				ICON_BG[iconColor],
			)}
		>
			{icon}
		</div>
		<Typography
			tag="h3"
			className="mb-1.5 font-display text-[20px] font-semibold tracking-[-0.3px] text-t-1"
		>
			{title}
		</Typography>
		<Typography className="text-[13.5px] leading-[1.55] text-t-2">
			{description}
		</Typography>
	</article>
);
