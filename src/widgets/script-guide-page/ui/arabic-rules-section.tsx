"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { CSSProperties } from "react";
import { GuideSection } from "./guide-section";

const ARABIC_FONT: CSSProperties = {
	fontFamily: "var(--font-scheherazade), 'Amiri', serif",
};

export const ArabicRulesSection = () => {
	const { t } = useI18n();

	return (
		<GuideSection
			id="arabic-rules"
			title={t("scriptGuide.arabic.keyRules")}
		>
			<ul className="space-y-2.5 text-sm text-t-2">
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.rtl")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.rtlDesc")}
				</li>
				<li>
					<span className="inline-flex items-baseline gap-2">
						<span className="text-2xl leading-none text-t-1" style={ARABIC_FONT}>
							ب۬
						</span>
						<span className="font-mono text-xs text-t-3">U+06EC</span>
					</span>
					{" — "}
					{t("scriptGuide.arabic.softSignDescPre")}
					<span className="text-xl leading-none text-t-1" style={ARABIC_FONT}>
						{" "}۬{" "}
					</span>
					{t("scriptGuide.arabic.softSignDescPost")}
				</li>
				<li>
					<span className="inline-flex items-baseline gap-2">
						<span className="text-2xl leading-none text-t-1" style={ARABIC_FONT}>
							بٗ
						</span>
						<span className="font-mono text-xs text-t-3">U+0657</span>
					</span>
					{" — "}
					{t("scriptGuide.arabic.invertedDammaDescPre")}
					<span className="text-xl leading-none text-t-1" style={ARABIC_FONT}>
						{" "}ٗ{" "}
					</span>
					{t("scriptGuide.arabic.invertedDammaDescPost")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.diacriticsOptional")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.diacriticsOptionalDesc")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.nasalization")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.nasalizationDescPre")}
					<span
						className="text-xl leading-none text-t-1 mx-1"
						style={ARABIC_FONT}
					>
						ـً ـٍ ـٌ
					</span>
					{t("scriptGuide.arabic.nasalizationDescMid")}
					<span
						className="text-xl leading-none text-t-1 mx-1"
						style={ARABIC_FONT}
					>
						ۨ
					</span>
					{t("scriptGuide.arabic.nasalizationDescPost")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.wordStart")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.wordStartDesc")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.doubling")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.doublingDesc")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.diphthongs")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.diphthongsDesc")}
					<span
						className="text-xl leading-none text-t-1 mx-1"
						style={ARABIC_FONT}
					>
						ضُؤٗ
					</span>
					{t("scriptGuide.arabic.diphthongsDesc2")}
					<span
						className="text-xl leading-none text-t-1 mx-1"
						style={ARABIC_FONT}
					>
						لِئِ۬لَا
					</span>
					{". "}
					{t("scriptGuide.arabic.diphthongsVsLong")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.hamza")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.hamzaDesc")}
					{" "}
					{t("scriptGuide.arabic.hamzaHierarchy")}
					{" "}
					{t("scriptGuide.arabic.hamzaExample")}
					{" "}
					<span
						className="text-xl leading-none text-t-1 mx-1"
						style={ARABIC_FONT}
					>
						بِئْنَا
					</span>
					{"."}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.pVsF")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.pVsFDesc")}
					<span
						className="text-xl leading-none text-t-1 mx-1"
						style={ARABIC_FONT}
					>
						فِكْر
					</span>
					{t("scriptGuide.arabic.pVsFDesc2")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.vSound")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.vSoundDesc")}
				</li>
				<li>
					<span className="font-medium text-t-1">
						{t("scriptGuide.arabic.stress")}
					</span>
					{" — "}
					{t("scriptGuide.arabic.stressDesc")}
				</li>
			</ul>
		</GuideSection>
	);
};
