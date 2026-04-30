import type { SVGProps } from "react";
import { cn } from "@/shared/lib/cn";

export const BrandMark = ({
	className,
	...props
}: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 52 64"
		role="img"
		aria-hidden="true"
		className={cn("shrink-0", className)}
		{...props}
	>
		<rect
			x="2"
			y="4"
			width="48"
			height="56"
			rx="3.5"
			ry="3.5"
			fill="none"
			stroke="var(--t-3)"
			strokeWidth="2"
			opacity="0.5"
		/>
		<rect
			x="2"
			y="4"
			width="12"
			height="56"
			rx="3.5"
			ry="3.5"
			fill="var(--acc-bg)"
			stroke="var(--acc)"
			strokeOpacity="0.4"
			strokeWidth="1"
		/>
		<line
			x1="19"
			y1="20"
			x2="42"
			y2="20"
			stroke="var(--t-4)"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<line
			x1="19"
			y1="30"
			x2="38"
			y2="30"
			stroke="var(--t-4)"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<rect
			x="19"
			y="37"
			width="18"
			height="8"
			rx="2"
			fill="var(--acc-bg)"
			stroke="var(--acc)"
			strokeOpacity="0.6"
			strokeWidth="1"
		/>
		<line
			x1="22"
			y1="41"
			x2="34"
			y2="41"
			stroke="var(--acc)"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<line
			x1="19"
			y1="50"
			x2="40"
			y2="50"
			stroke="var(--t-4)"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path d="M36 0 L36 14 L40 10.5 L44 14 L44 0" fill="var(--acc)" opacity="0.7" />
	</svg>
);
