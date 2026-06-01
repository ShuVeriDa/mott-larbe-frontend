import type { CefrLevel } from "@/shared/types";

const COVER_COLORS: Record<string, { bg: string; stroke: string }> = {
	A: { bg: "bg-grn-bg", stroke: "text-grn-t" },
	B: { bg: "bg-pur-bg", stroke: "text-pur-t" },
	C: { bg: "bg-red-bg", stroke: "text-red-t" },
};

interface RelatedCoverProps {
	level: CefrLevel | null;
}

export const RelatedCover = ({ level }: RelatedCoverProps) => {
	const colors = level
		? (COVER_COLORS[level] ?? COVER_COLORS.A)
		: COVER_COLORS.A;
	return (
		<div
			className={`w-[26px] h-[36px] rounded-[4px] border border-bd-1 shrink-0 flex items-center justify-center ${colors.bg}`}
		>
			<svg
				width="11"
				height="11"
				viewBox="0 0 14 14"
				fill="none"
				className={colors.stroke}
			>
				<path
					d="M2 10L7 3l5 7"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4 8h6"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
				/>
			</svg>
		</div>
	);
};
