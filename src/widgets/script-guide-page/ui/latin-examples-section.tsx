"use client";

import { useI18n } from "@/shared/lib/i18n";
import { LATIN_EXAMPLES } from "../lib/latin-data";
import { GuideSection } from "./guide-section";

export const LatinExamplesSection = () => {
	const { t } = useI18n();

	return (
		<GuideSection
			id="latin-examples"
			title={t("scriptGuide.latin.examplesTitle")}
		>
			<div className="overflow-x-auto rounded-card border border-bd-1 [&::-webkit-scrollbar]:h-0">
				<table
					className="w-full border-collapse text-[12.5px]"
					aria-label={t("scriptGuide.latin.examplesTitle")}
				>
					<thead>
						<tr className="border-b border-bd-1 bg-surf-2 text-left">
							<th className="px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("scriptGuide.colCyrillic")}
							</th>
							<th className="px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("scriptGuide.colLatin")}
							</th>
							<th className="px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("scriptGuide.colMeaning")}
							</th>
						</tr>
					</thead>
					<tbody>
						{LATIN_EXAMPLES.map(row => (
							<tr
								key={row.cyr}
								className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
							>
								<td className="px-3.5 py-2.5 text-t-1">{row.cyr}</td>
								<td className="px-3.5 py-2.5 font-medium text-t-1">{row.latin}</td>
								<td className="px-3.5 py-2.5 text-t-2">{t(row.meaningKey)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</GuideSection>
	);
};
