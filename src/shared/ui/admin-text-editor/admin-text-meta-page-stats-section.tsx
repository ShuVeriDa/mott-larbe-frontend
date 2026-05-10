"use client";

import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import { Typography } from "@/shared/ui/typography";

interface PageStatsItem {
	wordCount: number;
}

interface AdminTextMetaPageStatsSectionProps {
	pages: PageStatsItem[];
	sectionTitle: string;
	pageLabel: string;
	wordsSuffix: string;
	pageTokenCounts?: number[];
	tokenCountSuffix?: string;
}

export const AdminTextMetaPageStatsSection = ({
	pages,
	sectionTitle,
	pageLabel,
	wordsSuffix,
	pageTokenCounts,
	tokenCountSuffix,
}: AdminTextMetaPageStatsSectionProps) => {
	const maxWordCount = Math.max(...pages.map(page => page.wordCount), 1);
	const showTokenCounts = Boolean(pageTokenCounts && tokenCountSuffix);

	return (
		<MetaSection title={sectionTitle}>
			{pages.map((page, index) => {
				const tokenCount = pageTokenCounts?.[index] ?? 0;
				const pageWordsLabel = `${page.wordCount} ${wordsSuffix}`;
				const statsLabel =
					showTokenCounts && tokenCount > 0
						? `${tokenCount} ${tokenCountSuffix} · ${pageWordsLabel}`
						: pageWordsLabel;

				return (
					<div key={index} className={index > 0 ? "mt-2" : ""}>
						<div className="mb-1 flex justify-between text-[11px]">
							<Typography tag="span" className="text-t-3">
								{pageLabel.replace("{n}", String(index + 1))}
							</Typography>
							<Typography tag="span" className="font-medium text-t-2">
								{statsLabel}
							</Typography>
						</div>
						<div className="h-1 overflow-hidden rounded-full bg-surf-3">
							<div
								className="h-full rounded-full bg-acc transition-all"
								style={{
									width: `${Math.min(
										100,
										Math.round((page.wordCount / maxWordCount) * 100),
									)}%`,
								}}
							/>
						</div>
					</div>
				);
			})}
		</MetaSection>
	);
};
