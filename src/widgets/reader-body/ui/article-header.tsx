"use client";

import type { TextPageResponse } from "@/entities/text";
import { useI18n } from "@/shared/lib/i18n";

const badgeClass =
	"inline-flex items-center rounded px-[7px] py-0.5 text-[10px] font-bold";

export interface ArticleHeaderProps {
	data: TextPageResponse;
	currentPage: number;
}

export const ArticleHeader = ({ data, currentPage }: ArticleHeaderProps) => {
	const { t } = useI18n();

	return (
		<header className="mb-7 border-b border-hairline border-bd-1 pb-6">
			<div className="mb-3 flex flex-wrap gap-1.5">
				{data.level ? (
					<span className={`${badgeClass} bg-amb-bg text-amb-t`}>
						{data.level}
					</span>
				) : null}
				<span className={`${badgeClass} bg-surf-3 text-t-2`}>
					{data.language}
				</span>
			</div>
			<h1 className="mb-2.5 font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.35] tracking-[-0.3px] text-t-1">
				{data.title}
			</h1>
			<div className="flex flex-wrap items-center gap-2">
				{data.author ? (
					<span className="text-[12px] text-t-2">{data.author}</span>
				) : null}
				{data.author ? (
					<span aria-hidden="true" className="size-0.5 rounded-full bg-t-4" />
				) : null}
				<span className="text-[12px] text-t-3">
					{t("reader.body.byline", {
						count: data.wordCount,
						current: currentPage,
						total: data.totalPages,
					})}
				</span>
			</div>
		</header>
	);
};
