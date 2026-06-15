"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { SectionLabel } from "@/shared/ui/section-label";

interface NavSectionProps {
	labelKey: string;
	isCompactMode?: boolean;
}

export const NavSection = ({ labelKey, isCompactMode = false }: NavSectionProps) => {
	const { t } = useI18n();

	return (
		<SectionLabel
			className={cn(
				"px-3.5 pb-0.5 pt-3 mb-0 transition-opacity duration-200",
				isCompactMode && "max-[899px]:px-0 max-[899px]:py-0 max-[899px]:opacity-0",
			)}
		>
			{t(labelKey)}
		</SectionLabel>
	);
};
