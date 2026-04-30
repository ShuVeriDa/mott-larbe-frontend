"use client";

import { useI18n } from "@/shared/lib/i18n";

export interface MasteryRingProps {
	percent: number;
	known: number;
	total: number;
}

const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const MasteryRing = ({ percent, known, total }: MasteryRingProps) => {
	const { t } = useI18n();
	const clamped = Math.min(100, Math.max(0, percent));
	const offset = CIRCUMFERENCE * (1 - clamped / 100);

	return (
		<div className="flex flex-col items-center gap-2.5">
			<div className="relative size-[76px]">
				<svg
					width={76}
					height={76}
					viewBox="0 0 76 76"
					className="-rotate-90"
					aria-hidden="true"
				>
					<circle
						cx={38}
						cy={38}
						r={RADIUS}
						fill="none"
						strokeWidth={6}
						className="stroke-surf-3"
					/>
					<circle
						cx={38}
						cy={38}
						r={RADIUS}
						fill="none"
						strokeWidth={6}
						strokeLinecap="round"
						strokeDasharray={CIRCUMFERENCE}
						strokeDashoffset={offset}
						className="stroke-grn transition-[stroke-dashoffset] duration-500"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="font-display text-[20px] leading-none text-t-1">
						{clamped}%
					</span>
					<span className="mt-px text-[9px] uppercase tracking-[0.5px] text-t-3">
						{t("vocabulary.studied")}
					</span>
				</div>
			</div>
			<p className="text-center text-xs leading-snug text-t-2">
				{t("vocabulary.masteryLabel", { known, total })}
			</p>
		</div>
	);
};
