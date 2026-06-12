"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Bot } from "lucide-react";

export const AiDisclaimer = () => {
	const { t } = useI18n();
	return (
		<div className="flex items-start gap-1.5 px-3.5 py-2 border-t-[0.5px] border-bd-1">
			<Bot className="mt-px size-3 shrink-0 text-t-4" strokeWidth={1.5} />
			<p className="text-[10.5px] leading-[1.4] text-t-4">
				{t("aiTranslation.disclaimer")}
			</p>
		</div>
	);
};
