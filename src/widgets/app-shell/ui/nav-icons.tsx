import type { SVGProps } from 'react';
import {
	LayoutGrid,
	TrendingUp,
	AlignLeft,
	Clock,
	Star,
	Globe,
	BookOpen,
} from 'lucide-react';

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
	<LayoutGrid className="size-[15px] shrink-0" {...(props as object)} />
);

export const TextsIcon = (props: SVGProps<SVGSVGElement>) => (
	<TrendingUp className="size-[15px] shrink-0" {...(props as object)} />
);

export const VocabularyIcon = (props: SVGProps<SVGSVGElement>) => (
	<AlignLeft className="size-[15px] shrink-0" {...(props as object)} />
);

export const ReviewIcon = (props: SVGProps<SVGSVGElement>) => (
	<Clock className="size-[15px] shrink-0" {...(props as object)} />
);

export const ProgressIcon = (props: SVGProps<SVGSVGElement>) => (
	<Star className="size-[15px] shrink-0" {...(props as object)} />
);

export const ChechenIcon = (props: SVGProps<SVGSVGElement>) => (
	<Globe className="size-[15px] shrink-0" {...(props as object)} />
);

export const GrammarIcon = (props: SVGProps<SVGSVGElement>) => (
	<BookOpen className="size-[15px] shrink-0" {...(props as object)} />
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
