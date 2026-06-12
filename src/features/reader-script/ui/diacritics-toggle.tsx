"use client";

import { useI18n } from "@/shared/lib/i18n/use-i18n";
import { Button } from "@/shared/ui/button";
import { useReaderScript } from "../model";

export const DiacriticsToggle = () => {
	const { t } = useI18n();
	const { script, showDiacritics, setShowDiacritics } = useReaderScript();

	if (script !== "ARABIC") return null;

	const handleToggle = () => setShowDiacritics(!showDiacritics);

	return (
		<Button
			variant="ghost"
			size="default"
			onClick={handleToggle}
			aria-pressed={showDiacritics}
			aria-label={t("reader.settings.script.diacritics")}
		>
			{showDiacritics
				? t("reader.settings.script.diacriticsHide")
				: t("reader.settings.script.diacriticsShow")}
		</Button>
	);
};
