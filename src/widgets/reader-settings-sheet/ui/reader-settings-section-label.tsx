"use client";

import { cn } from "@/shared/lib/cn";
import { SectionLabel } from "@/shared/ui/section-label";

export interface ReaderSettingsSectionLabelProps {
	label: string;
	compact: boolean;
}

export const ReaderSettingsSectionLabel = ({
	label,
	compact,
}: ReaderSettingsSectionLabelProps) => (
	<SectionLabel className={compact ? "mb-1" : "mb-2"}>
		{label}
	</SectionLabel>
);
