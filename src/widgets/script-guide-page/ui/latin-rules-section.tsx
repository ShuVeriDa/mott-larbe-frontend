"use client";

import { useI18n } from "@/shared/lib/i18n";
import { GuideSection } from "./guide-section";

export const LatinRulesSection = () => {
	const { t } = useI18n();

	return (
		<GuideSection
			id="latin-rules"
			title={t("scriptGuide.latin.keyRules")}
		>
			<ul className="space-y-2.5 text-sm text-t-2">
				<li>
					<span className="font-semibold text-acc-t dark:text-acc">J j = Ӏ</span>
					{" — "}
					{t("scriptGuide.latin.jRule")}
				</li>
				<li>
					<span className="font-semibold text-acc-t dark:text-acc">Y y = Й</span>
					{" — "}
					{t("scriptGuide.latin.yRule")}
				</li>
				<li>
					<span className="font-medium text-t-1">Ä / Ö / Ü</span>
					{" — "}
					{t("scriptGuide.latin.umlauts")}
				</li>
				<li>
					<span className="font-medium text-t-1">Ŋ ŋ</span>
					{" — "}
					{t("scriptGuide.latin.nasal")}
				</li>
				<li>
					<span className="font-medium text-t-1">Ie ie / Uo uo</span>
					{" — "}
					{t("scriptGuide.latin.diphthongs")}
				</li>
			</ul>
		</GuideSection>
	);
};
