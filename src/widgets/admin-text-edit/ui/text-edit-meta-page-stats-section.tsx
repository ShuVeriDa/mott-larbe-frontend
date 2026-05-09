"use client";

import { Typography } from "@/shared/ui/typography";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import type { PageContent } from "../model/use-admin-text-edit-page";

interface Props {
	pages: PageContent[];
	pageTokenCounts: number[];
	sectionTitle: string;
	pageLabel: string;
	tokenCountSuffix: string;
	wordsSuffix: string;
}

export const TextEditMetaPageStatsSection = ({
	pages,
	pageTokenCounts,
	sectionTitle,
	pageLabel,
	tokenCountSuffix,
	wordsSuffix,
}: Props) => {
	const maxWordCount = Math.max(...pages.map(p => p.wordCount), 1);

	return (
		<MetaSection title={sectionTitle}>
			{pages.map((page, i) => {
				const tc = pageTokenCounts[i] ?? 0;
				return (
					<div key={i} className={i > 0 ? "mt-2" : ""}>
						<div className="mb-1 flex justify-between text-[11px]">
							<Typography tag="span" className="text-t-3">
								{pageLabel.replace("{n}", String(i + 1))}
							</Typography>
							<Typography tag="span" className="font-medium text-t-2">
								{tc > 0
									? `${tc} ${tokenCountSuffix} · ${page.wordCount} ${wordsSuffix}`
									: `${page.wordCount} ${wordsSuffix}`}
							</Typography>
						</div>
						<div className="h-1 overflow-hidden rounded-full bg-surf-3">
							<div
								className="h-full rounded-full bg-acc transition-all"
								style={{ width: `${Math.min(100, Math.round((page.wordCount / maxWordCount) * 100))}%` }}
							/>
						</div>
					</div>
				);
			})}
		</MetaSection>
	);
};
