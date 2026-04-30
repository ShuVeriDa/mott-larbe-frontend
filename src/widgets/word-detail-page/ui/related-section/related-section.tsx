"use client";

import Link from "next/link";
import { CefrBadge } from "@/entities/dictionary";
import type { DetailRelated } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { CardSection } from "../card-section";

export interface RelatedSectionProps {
	related: DetailRelated[];
	lang: string;
}

export const RelatedSection = ({ related, lang }: RelatedSectionProps) => {
	const { t } = useI18n();

	if (related.length === 0) return null;

	return (
		<CardSection title={t("vocabulary.wordDetail.sections.related")}>
			<ul className="flex flex-wrap gap-1.5 max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-1">
				{related.map((rel) => {
					const typeLabel = t(
						`vocabulary.wordDetail.related.types.${rel.type}`,
					);
					return (
						<li key={`${rel.lemmaId}-${rel.type}`} className="shrink-0">
							<Link
								href={`/${lang}/vocabulary?search=${encodeURIComponent(rel.baseForm)}`}
								className="flex items-center gap-1.5 rounded-[8px] border-hairline border-bd-1 bg-surf-2 px-2.5 py-1.5 transition-colors duration-150 hover:border-bd-2"
								title={typeLabel}
							>
								<span className="font-display text-[13px] italic text-t-1">
									{rel.baseForm}
								</span>
								{rel.translation ? (
									<span className="text-[11.5px] text-t-3">
										{rel.translation}
									</span>
								) : null}
								{rel.level ? <CefrBadge level={rel.level} /> : null}
							</Link>
						</li>
					);
				})}
			</ul>
		</CardSection>
	);
};
