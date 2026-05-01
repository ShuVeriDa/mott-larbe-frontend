"use client";

import { useI18n } from "@/shared/lib/i18n";

export interface ReaderProgressBarProps {
	progress: number;
}

export const ReaderProgressBar = ({ progress }: ReaderProgressBarProps) => {
	const { t } = useI18n();
	const value = Math.max(0, Math.min(100, Math.round(progress)));

	return (
		<div className="mb-7" aria-live="polite">
			<div className="mb-2 flex justify-between">
				<span className="text-[11px] text-t-3">
					{t("reader.body.progress")}
				</span>
				<span className="text-[11px] font-semibold text-acc tabular-nums">
					{value}%
				</span>
			</div>
			<div
				role="progressbar"
				aria-valuenow={value}
				aria-valuemin={0}
				aria-valuemax={100}
				className="h-[3px] overflow-hidden rounded-full bg-surf-3"
			>
				<div
					className="h-full rounded-full bg-acc transition-[width] duration-300"
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	);
};
