"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { LATIN_ALPHABET } from "../lib/latin-data";
import { GuideSection } from "./guide-section";

export const LatinAlphabetSection = () => {
	const { t } = useI18n();

	return (
		<GuideSection
			id="latin-alphabet"
			title={t("scriptGuide.latin.alphabetTitle")}
		>
			<div className="overflow-x-auto rounded-card border border-bd-1 [&::-webkit-scrollbar]:h-0">
				<table
					className="w-full border-collapse text-[12.5px]"
					aria-label={t("scriptGuide.latin.alphabetTitle")}
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
								{t("scriptGuide.colIpa")}
							</th>
						</tr>
					</thead>
					<tbody>
						{LATIN_ALPHABET.map(row => (
							<tr
								key={row.cyrillic}
								className={cn(
									"border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2",
									row.trap && "bg-amb-bg/50",
								)}
							>
								<td className="px-3.5 py-2.5 text-t-1">{row.cyrillic}</td>
								<td className="px-3.5 py-2.5 font-medium text-t-1">
									{row.latin}
									{row.trap && (
										<span
											className="ml-2 text-[10.5px] font-semibold text-amb-t"
											role="img"
											aria-label={t("scriptGuide.trapWarning")}
										>
											⚠
										</span>
									)}
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
