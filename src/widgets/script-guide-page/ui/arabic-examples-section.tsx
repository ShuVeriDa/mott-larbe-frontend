"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { CSSProperties } from "react";
import { ARABIC_EXAMPLES } from "../lib/arabic-data";
import { GuideSection } from "./guide-section";

const ARABIC_FONT: CSSProperties = {
	fontFamily: "var(--font-scheherazade), 'Amiri', serif",
};

export const ArabicExamplesSection = () => {
	const { t } = useI18n();

	return (
		<GuideSection
			id="arabic-examples"
			title={t("scriptGuide.arabic.examplesTitle")}
		>
			<div className="overflow-x-auto rounded-card border border-bd-1 [&::-webkit-scrollbar]:h-0">
				<table
					className="w-full border-collapse text-[12.5px]"
					aria-label={t("scriptGuide.arabic.examplesTitle")}
				>
					<thead>
						<tr className="border-b border-bd-1 bg-surf-2 text-left">
							<th className="px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("scriptGuide.colCyrillic")}
							</th>
							<th className="px-3.5 py-2.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("scriptGuide.col1922")}
							</th>
							<th className="px-3.5 py-2.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("scriptGuide.col20")}
							</th>
							<th className="px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("scriptGuide.colMeaning")}
							</th>
						</tr>
					</thead>
					<tbody>
						{ARABIC_EXAMPLES.map(row => (
							<tr
								key={row.cyr}
								className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
							>
								<td className="px-3.5 py-2.5 text-t-1">{row.cyr}</td>
								<td
									className="px-3.5 py-3 text-right text-xl text-t-3"
									dir="rtl"
									lang="ar"
									style={ARABIC_FONT}
								>
									{row.ar1922}
								</td>
								<td
									className="px-3.5 py-3 text-right text-xl font-medium text-t-1"
									dir="rtl"
									lang="ar"
									style={ARABIC_FONT}
								>
									{row.ar20}
								</td>
								<td className="px-3.5 py-2.5 text-t-2">{t(row.meaningKey)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</GuideSection>
	);
};
