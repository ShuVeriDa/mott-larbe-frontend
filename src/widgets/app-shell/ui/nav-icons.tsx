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

export const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 18 18"
		fill="none"
		className="size-[15px] shrink-0"
		{...props}
	>
		<path
			d="M3 14L9 4l6 10"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M5.5 10h7"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);
