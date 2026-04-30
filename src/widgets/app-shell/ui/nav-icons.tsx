import type { SVGProps } from "react";

const baseProps: SVGProps<SVGSVGElement> = {
	viewBox: "0 0 16 16",
	fill: "none",
	className: "size-[15px] shrink-0",
};

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<rect
			x="2"
			y="2"
			width="5"
			height="5"
			rx="1.5"
			stroke="currentColor"
			strokeWidth="1.3"
		/>
		<rect
			x="9"
			y="2"
			width="5"
			height="5"
			rx="1.5"
			stroke="currentColor"
			strokeWidth="1.3"
		/>
		<rect
			x="2"
			y="9"
			width="5"
			height="5"
			rx="1.5"
			stroke="currentColor"
			strokeWidth="1.3"
		/>
		<rect
			x="9"
			y="9"
			width="5"
			height="5"
			rx="1.5"
			stroke="currentColor"
			strokeWidth="1.3"
		/>
	</svg>
);

export const TextsIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<path
			d="M2 12l3-8 3 5 2-3 2 6"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const VocabularyIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<path
			d="M3 5h10M3 8h7M3 11h5"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
		/>
	</svg>
);

export const ReviewIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
		<path
			d="M8 5.5v3l1.5 1.5"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
		/>
	</svg>
);

export const ProgressIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<path
			d="M8 2l1.5 3.5L13 6l-2.5 2.5.5 3.5L8 10l-3 2 .5-3.5L3 6l3.5-.5z"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinejoin="round"
		/>
	</svg>
);

export const ChechenIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
		<path
			d="M8 2.5C6.5 4.5 6.5 11.5 8 13.5M5.5 4.5C7 5.5 9 5.5 10.5 4.5M5.5 11.5C7 10.5 9 10.5 10.5 11.5M2.5 8h11"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinecap="round"
		/>
	</svg>
);

export const GrammarIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<path
			d="M3 4h6M3 8h4M3 12h5M10 7l4-4-4-4M14 7v5a2 2 0 01-2 2H4"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const accAlpha = (pct: number) =>
	`color-mix(in srgb, var(--acc) ${pct}%, transparent)`;

export const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 52 64"
		fill="none"
		width="30"
		height="36"
		xmlns="http://www.w3.org/2000/svg"
		className="shrink-0"
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
			strokeWidth="1.5"
			opacity="0.5"
		/>
		<rect
			x="2"
			y="4"
			width="11"
			height="56"
			rx="3.5"
			ry="3.5"
			fill={accAlpha(12)}
			stroke={accAlpha(25)}
			strokeWidth="0.8"
		/>
		<line
			x1="5"
			y1="12"
			x2="10"
			y2="12"
			stroke={accAlpha(25)}
			strokeWidth="0.8"
		/>
		<line
			x1="5"
			y1="52"
			x2="10"
			y2="52"
			stroke={accAlpha(25)}
			strokeWidth="0.8"
		/>
		<line
			x1="15"
			y1="8"
			x2="15"
			y2="56"
			stroke="var(--bd-2)"
			strokeWidth="0.7"
		/>
		<line
			x1="19"
			y1="18"
			x2="44"
			y2="18"
			stroke="var(--t-4)"
			strokeWidth="1.2"
			strokeLinecap="round"
		/>
		<line
			x1="19"
			y1="24"
			x2="40"
			y2="24"
			stroke="var(--t-4)"
			strokeWidth="1.2"
			strokeLinecap="round"
		/>
		<line
			x1="19"
			y1="30"
			x2="42"
			y2="30"
			stroke="var(--t-4)"
			strokeWidth="1.2"
			strokeLinecap="round"
		/>
		<rect
			x="19"
			y="35"
			width="16"
			height="7"
			rx="1.5"
			fill={accAlpha(12)}
			stroke={accAlpha(40)}
			strokeWidth="0.6"
		/>
		<line
			x1="21"
			y1="38.5"
			x2="33"
			y2="38.5"
			stroke="var(--acc)"
			strokeWidth="1.3"
			strokeLinecap="round"
		/>
		<line
			x1="38"
			y1="38.5"
			x2="44"
			y2="38.5"
			stroke="var(--t-4)"
			strokeWidth="1.2"
			strokeLinecap="round"
		/>
		<line
			x1="19"
			y1="44"
			x2="43"
			y2="44"
			stroke="var(--t-4)"
			strokeWidth="1.2"
			strokeLinecap="round"
		/>
		<line
			x1="19"
			y1="50"
			x2="36"
			y2="50"
			stroke="var(--t-4)"
			strokeWidth="1.2"
			strokeLinecap="round"
		/>
		<path
			d="M38 0 L38 12 L41 9.5 L44 12 L44 0"
			fill="var(--acc)"
			opacity="0.75"
		/>
	</svg>
);
