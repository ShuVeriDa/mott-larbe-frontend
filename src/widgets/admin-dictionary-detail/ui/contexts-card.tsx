"use client";

import { Typography } from "@/shared/ui/typography";

import { ComponentProps } from 'react';
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictContextItem } from "@/entities/dictionary";

interface ContextsCardProps {
	items: AdminDictContextItem[] | undefined;
	total: number;
	lang: string;
	isLoading: boolean;
}

export const ContextsCard = ({ items, total, lang, isLoading }: ContextsCardProps) => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.contexts")}
				</Typography>
				{!isLoading && (
					<Typography tag="span" className="text-[11.5px] text-t-3">
						{total} {t("admin.dictionaryDetail.usages")}
					</Typography>
				)}
			</div>

			{isLoading ? (
				<div className="flex flex-col">
					{[0, 1, 2].map((i) => (
						<div key={i} className="border-b border-bd-1 px-4 py-3 last:border-b-0">
							<div className="mb-1.5 h-3.5 w-full animate-pulse rounded bg-surf-3" />
							<div className="h-2.5 w-32 animate-pulse rounded bg-surf-3" />
						</div>
					))}
				</div>
			) : !items || items.length === 0 ? (
				<div className="px-4 py-6 text-center text-[12.5px] text-t-3">
					{t("admin.dictionaryDetail.noContexts")}
				</div>
			) : (
				<div>
					{items.map((ctx) => {
					  const handleClick: NonNullable<ComponentProps<typeof Link>["onClick"]> = (e) => e.stopPropagation();
					  return (
						<div
							key={ctx.id}
							className="cursor-pointer border-b border-bd-1 px-4 py-[11px] transition-colors hover:bg-surf-2 last:border-b-0"
						>
							<div
								className="mb-1 text-[12.5px] leading-[1.55] text-t-2 [&_b]:font-semibold [&_b]:text-t-1"
								dangerouslySetInnerHTML={{ __html: ctx.snippet }}
							/>
							<div className="flex items-center gap-1.5 text-[11px] text-t-3">
								<svg width="10" height="10" viewBox="0 0 16 16" fill="none">
									<path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
								</svg>
								<Link
									href={`/${lang}/texts/${ctx.textId}`}
									className="text-acc-t hover:underline"
									onClick={handleClick}
								>
									{ctx.textTitle}
								</Link>
							</div>
						</div>
					);
					})}
				</div>
			)}

			<div className="border-t border-bd-1 px-4 py-2.5">
				<Typography tag="span" className="text-[11.5px] text-t-3">
					{t("admin.dictionaryDetail.contextsNote")}
				</Typography>
			</div>
		</div>
	);
};
