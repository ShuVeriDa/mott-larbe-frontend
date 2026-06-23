"use client";
import { ease, duration } from "@/shared/lib/animation";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";

export interface AccuracyRowProps {
	label: string;
	value: string | number;
	dotColor?: string;
	statColor?: string;
	percent?: number;
	barColor?: string;
}

export const AccuracyRow = ({
	label,
	value,
	dotColor,
	statColor,
	percent,
	barColor,
}: AccuracyRowProps) => (
	<div>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-1.5 text-[11px] text-t-2">
				{dotColor ? <span className={`size-[7px] shrink-0 rounded-full ${dotColor}`} /> : null}
				{label}
			</div>
			<Typography tag="span" className={`text-[11px] font-semibold ${statColor ?? "text-t-1"}`}>
				{value}
			</Typography>
		</div>
		{typeof percent === "number" && barColor ? (
			<div className="mt-1 h-1 overflow-hidden rounded-[2px] bg-surf-3">
				<motion.div
					className={`h-full rounded-[2px] ${barColor}`}
					initial={{ width: 0 }}
					animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
					transition={{ duration: duration.slow, ease: ease.enter, delay: 0.1 }}
				/>
			</div>
		) : null}
	</div>
);
