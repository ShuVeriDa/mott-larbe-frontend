import type { SVGProps } from 'react';
const baseProps: SVGProps<SVGSVGElement> = {
	viewBox: "0 0 16 16",
	fill: "none",
	className: "size-[14px] shrink-0",
};

export const AppearanceIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.35" />
		<path
			d="M8 1.5v13M1.5 8h13"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
		/>
	</svg>
);

export const LearningIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<path
			d="M2 12L5 5l3 6 2.5-4 2.5 4"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M2 14h12"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
		/>
	</svg>
);

export const ReaderIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<path
			d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9z"
			stroke="currentColor"
			strokeWidth="1.35"
		/>
		<path
			d="M5 5.5h6M5 8h4M5 10.5h5"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
		/>
	</svg>
);

export const NotificationsIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<path
			d="M8 1.5A4.5 4.5 0 0 0 3.5 6v3.5l-1 1.5h11l-1-1.5V6A4.5 4.5 0 0 0 8 1.5z"
			stroke="currentColor"
			strokeWidth="1.35"
		/>
		<path
			d="M6.5 12.5a1.5 1.5 0 0 0 3 0"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
		/>
	</svg>
);

export const ShortcutsIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<rect x="1.5" y="3.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.35" />
		<rect x="1.5" y="9.5" width="3" height="3" rx="1" stroke="currentColor" strokeWidth="1.35" />
		<rect x="6.5" y="9.5" width="3" height="3" rx="1" stroke="currentColor" strokeWidth="1.35" />
		<rect x="9.5" y="3.5" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.35" />
		<rect x="11.5" y="9.5" width="3" height="3" rx="1" stroke="currentColor" strokeWidth="1.35" />
	</svg>
);

export const SessionsIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<rect x="2" y="2" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.35" />
		<path
			d="M5 13.5h6M8 11v2.5"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
		/>
	</svg>
);

export const DataIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<ellipse cx="8" cy="4.5" rx="5.5" ry="2" stroke="currentColor" strokeWidth="1.35" />
		<path
			d="M2.5 4.5v3c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2v-3"
			stroke="currentColor"
			strokeWidth="1.35"
		/>
		<path
			d="M2.5 7.5v3c0 1.1 2.46 2 5.5 2s5.5-.9 5.5-2v-3"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
		/>
	</svg>
);

export const PhoneIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<rect x="3.5" y="1.5" width="9" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.35" />
		<circle cx="8" cy="12" r=".8" fill="currentColor" />
	</svg>
);

export const LaptopIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg {...baseProps} {...props}>
		<rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.35" />
		<path
			d="M5 14h6M8 12.5V14"
			stroke="currentColor"
			strokeWidth="1.35"
			strokeLinecap="round"
		/>
	</svg>
);
