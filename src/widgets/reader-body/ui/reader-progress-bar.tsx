"use client";

import { useI18n } from "@/shared/lib/i18n";

export interface ReaderProgressBarProps {
	progress: number;
}

export const ReaderProgressBar = ({ progress }: ReaderProgressBarProps) => {
	const { t } = useI18n();
	const value = Math.max(0, Math.min(100, Math.round(progress)));

	return (
		<div
			className="pointer-events-none absolute inset-y-0 left-0 hidden select-none min-[768px]:flex"
			aria-live="polite"
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label={t("reader.body.progress")}
		>
			{/* Track */}
			<div className="relative flex h-full w-[2px] items-end bg-bd-1">
				{/* Fill — grows from bottom */}
				<div
					className="w-full origin-bottom bg-acc/40 transition-transform duration-500 ease-out motion-reduce:transition-none"
					style={{
						height: "100%",
						transform: `scaleY(${value / 100})`,
					}}
				/>
				{/* Marker dot + label */}
				<div
					className="absolute left-1/2 -translate-x-1/2 transition-[bottom] duration-500 ease-out motion-reduce:transition-none"
					style={{ bottom: `${value}%` }}
				>
					<div className="size-[5px] -translate-x-[1.5px] rounded-full bg-acc" />
					<span
						className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tabular-nums text-acc/70"
						aria-hidden="true"
					>
						{value}%
					</span>
				</div>
			</div>
		</div>
	);
};
