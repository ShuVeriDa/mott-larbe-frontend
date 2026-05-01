"use client";

import { useI18n } from "@/shared/lib/i18n";

export const WordPanelLoader = () => {
	const { t } = useI18n();
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center gap-2 p-6"
			role="status"
			aria-live="polite"
		>
			<div className="size-5 animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
			<div className="text-[12px] text-t-3">
				{t("reader.panel.loading")}
			</div>
		</div>
	);
};
