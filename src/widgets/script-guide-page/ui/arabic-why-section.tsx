"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { CSSProperties } from "react";
import { GuideSection } from "./guide-section";

const ARABIC_FONT: CSSProperties = {
	fontFamily: "var(--font-scheherazade), 'Amiri', serif",
};

export const ArabicWhySection = () => {
	const { t, dict } = useI18n();

	const arabicSection = (
		(dict as Record<string, unknown>)?.scriptGuide as Record<string, unknown>
	)?.arabic as Record<string, unknown>;
	const items = Array.isArray(arabicSection?.what20items)
		? (arabicSection.what20items as string[])
		: [];

	return (
		<GuideSection id="arabic-why" title={t("scriptGuide.arabic.whyTitle")}>
			<div className="space-y-4 text-sm text-t-2 leading-relaxed">
				<Typography tag="h3" className="font-semibold text-t-1">
					{t("scriptGuide.arabic.whyPersonalTitle")}
				</Typography>
				<hr className="border-bd-1" />
				<Typography tag="p">{t("scriptGuide.arabic.whyAuthorNote")}</Typography>

				<hr className="border-bd-1" />
				<Typography tag="h3" className="font-semibold text-t-1">
					{t("scriptGuide.arabic.why1922Title")}
				</Typography>
				<Typography tag="p">{t("scriptGuide.arabic.why1922")}</Typography>

				<hr className="border-bd-1" />
				<Typography tag="h3" className="font-semibold text-t-1">
					{t("scriptGuide.arabic.whyNotDirectTitle")}
				</Typography>
				<Typography tag="p">{t("scriptGuide.arabic.whyNotDirect")}</Typography>

				<hr className="border-bd-1" />
				<Typography tag="h3" className="font-semibold text-t-1">
					{t("scriptGuide.arabic.what20Title")}
				</Typography>
				<Typography tag="p">
					{t("scriptGuide.arabic.what20")}{" "}
					<span className="text-xl align-middle" lang="ar" style={ARABIC_FONT}>
						ڥ ڗ چ ﮃ ݗ ࢰ
					</span>
				</Typography>
				<div className="rounded-card border border-bd-1 bg-surf-2/50 px-4 py-3 space-y-2.5">
					{items.map(item => (
						<Typography key={item} tag="p" size="sm">
							{item}
						</Typography>
					))}
				</div>

				<hr className="border-bd-1" />
				<Typography tag="h3" className="font-semibold text-t-1">
					{t("scriptGuide.arabic.whyDisclaimerTitle")}
				</Typography>
				<Typography tag="p">{t("scriptGuide.arabic.whyDisclaimer")}</Typography>
			</div>
		</GuideSection>
	);
};
