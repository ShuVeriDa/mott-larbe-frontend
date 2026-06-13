"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { CSSProperties } from "react";
import { CONSONANTS } from "../lib/arabic-data";
import { GuideSection } from "./guide-section";

const ARABIC_FONT: CSSProperties = {
	fontFamily: "var(--font-scheherazade), 'Amiri', serif",
};

export const ArabicConsonantsSection = () => {
	const { t } = useI18n();

	return (
		<GuideSection
			id="arabic-consonants"
			title={t("scriptGuide.arabic.consonantsTitle")}
		>
			<div className="overflow-x-auto rounded-card border border-bd-1 [&::-webkit-scrollbar]:h-0">
				<table
					className="w-full border-collapse text-[12.5px]"
					aria-label={t("scriptGuide.arabic.consonantsTitle")}
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
								{t("scriptGuide.colIpa")}
							</th>
						</tr>
					</thead>
					<tbody>
						{CONSONANTS.map(row => (
							<tr
								key={row.cyrillic}
								className={cn(
									"border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2",
									row.changed && "bg-amb-bg/50",
								)}
							>
								<td className="px-3.5 py-2.5 text-t-1">{row.cyrillic}</td>
								<td
									className="px-3.5 py-3 text-right text-xl text-t-3"
									dir="rtl"
									lang="ar"
									style={ARABIC_FONT}
								>
									{row.ar1922}
								</td>
								<td
									className={cn(
										"px-3.5 py-3 text-right text-xl",
										row.changed ? "font-semibold text-t-1" : "text-t-1",
									)}
									dir="rtl"
									lang="ar"
									style={ARABIC_FONT}
								>
									{row.ar20}
								</td>
								<td className="px-3.5 py-2.5 font-mono text-[11px] text-t-3">
									{row.ipa}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</GuideSection>
	);
};
