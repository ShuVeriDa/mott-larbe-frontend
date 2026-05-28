"use client";

import { useGeminiFallbackStore } from "@/features/ai-word-lookup";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { AlertTriangle } from "lucide-react";

export const GeminiLimitBanner = () => {
	const showPersistentBanner = useGeminiFallbackStore(s => s.showPersistentBanner);
	const { t } = useI18n();

	if (!showPersistentBanner) return null;

	return (
		<div className="flex items-start gap-2 border-b-[0.5px] border-amber-500/20 bg-amber-500/8 px-3.5 py-2.5">
			<AlertTriangle
				className="mt-0.5 size-3.5 shrink-0 text-amber-500"
				strokeWidth={1.6}
			/>
			<Typography tag="p" className="text-[11.5px] text-amber-700 dark:text-amber-400">
				{t("aiTranslation.fallback.persistentBanner")}
			</Typography>
		</div>
	);
};
