"use client";

import { Typography } from "@/shared/ui/typography";

import type { TextPageResponse } from "@/entities/text";
import { useI18n } from "@/shared/lib/i18n";
import { LANG_TAG } from "@/shared/lib/lang-tag";

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
					<Typography
						tag="span"
						className={`${badgeClass} bg-amb-bg text-amb-t`}
					>
						{data.level}
					</Typography>
				) : null}
				<Typography tag="span" className={`${badgeClass} bg-surf-3 text-t-2`}>
					{LANG_TAG[data.language]}
				</Typography>
				{data.tags?.map(tag => (
					<Typography
						key={tag.id}
						tag="span"
						className="inline-flex items-center gap-1 rounded-full border border-bd-2 bg-surf px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-t-2 transition-colors"
					>
						{/* <span aria-hidden="true" className="size-1 rounded-full bg-t-4" /> */}
						{tag.name}
					</Typography>
				))}
			</div>
			<Typography
				tag="h1"
				className="mb-2.5 font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.35] tracking-[-0.3px] text-t-1"
			>
				{data.title}
			</Typography>
			<div className="flex flex-wrap items-center gap-2">
				{data.author ? (
					<Typography tag="span" className="text-[12px] text-t-2">
						{data.author}
					</Typography>
				) : null}
				{data.author ? (
					<Typography
						tag="span"
						aria-hidden="true"
						className="size-0.5 rounded-full bg-t-4"
					/>
				) : null}
				<Typography tag="span" className="text-[12px] text-t-3">
					{t("reader.body.byline", {
						count: data.wordCount,
						current: currentPage,
						total: data.totalPages,
					})}
				</Typography>
			</div>
		</header>
	);
};
