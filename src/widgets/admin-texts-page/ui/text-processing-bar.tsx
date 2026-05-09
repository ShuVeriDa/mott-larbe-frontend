"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { ProcessingStatus } from "@/entities/admin-text";

interface TextProcessingBarProps {
	status: ProcessingStatus;
	progress: number;
}

export const TextProcessingBar = ({ status, progress }: TextProcessingBarProps) => {
	const { t } = useI18n();

	if (status === "IDLE" && progress === 0) {
		return <Typography tag="span" className="text-[11px] text-t-4">—</Typography>;
	}

	if (status === "RUNNING") {
		return (
			<div className="flex items-center gap-1.5">
				<div className="h-1 min-w-[40px] flex-1 overflow-hidden rounded-full bg-surf-3">
					<div
						className="h-full rounded-full bg-amb transition-all"
						style={{ width: `${progress}%` }}
					/>
				</div>
				<Typography tag="span" className="inline-flex shrink-0 items-center gap-1 rounded bg-amb-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-amb-t">
					<Typography tag="span" className="relative flex size-[7px] shrink-0">
						<Typography tag="span" className="absolute inline-flex size-full animate-ping rounded-full bg-amb opacity-50" />
						<Typography tag="span" className="relative inline-flex size-[7px] rounded-full bg-amb" />
					</Typography>
					{progress}%
				</Typography>
			</div>
		);
	}

	if (status === "ERROR") {
		return (
			<div className="flex items-center gap-1.5">
				<div className="h-1 min-w-[40px] flex-1 overflow-hidden rounded-full bg-surf-3">
					<div
						className="h-full rounded-full bg-red transition-all"
						style={{ width: `${progress}%` }}
					/>
				</div>
				<Typography tag="span" className="shrink-0 text-[11px] text-red-t">
					{t("admin.texts.processing.error")}
				</Typography>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-1.5">
			<div className="h-1 min-w-[40px] flex-1 overflow-hidden rounded-full bg-surf-3">
				<div className="h-full w-full rounded-full bg-grn" />
			</div>
			<Typography tag="span" className="shrink-0 text-[11px] text-t-3">100%</Typography>
		</div>
	);
};
