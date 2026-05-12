"use client";

import { cn } from "@/shared/lib/cn";

export interface ReaderSettingsSectionLabelProps {
	label: string;
	compact: boolean;
}

export const ReaderSettingsSectionLabel = ({
	label,
	compact,
}: ReaderSettingsSectionLabelProps) => (
	<div
		className={cn(
			"text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3",
			compact ? "mb-1" : "mb-2",
		)}
	>
		{label}
	</div>
);
