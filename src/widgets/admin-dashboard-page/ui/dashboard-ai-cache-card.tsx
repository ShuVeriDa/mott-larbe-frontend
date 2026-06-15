"use client";

import { AdminCard } from "@/shared/ui/admin-card";
import type { AdminDashboardAiCache } from "@/entities/admin-dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DashboardAiCacheCardProps {
	aiCache: AdminDashboardAiCache;
}

export const DashboardAiCacheCard = ({
	aiCache,
}: DashboardAiCacheCardProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	return (
		<AdminCard>
			<div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2.5">
				<div className="flex items-center gap-1.5">
					<Sparkles className="size-3.5 text-pur-t" strokeWidth={1.6} />
					<Typography tag="span" className="text-[13px] font-semibold text-t-1">
						{t("aiTranslation.admin.widget.title")}
					</Typography>
				</div>
				<Link
					href={`/${params.lang}/admin/unknown-words?section=aiCache`}
					className="text-[11.5px] text-acc hover:underline"
				>
					{t("aiTranslation.admin.widget.goToQueue")} →
				</Link>
			</div>

			<div className="grid grid-cols-3 gap-px border-t-[0.5px] border-bd-1 bg-bd-1">
				<div className="bg-surf px-4 py-3">
					<div className="mb-0.5 text-[11px] text-t-3">
						{t("aiTranslation.admin.widget.pending")}
					</div>
					<div
						className={
							aiCache.pending > 0
								? "text-[20px] font-bold text-red-t"
								: "text-[20px] font-bold text-t-1"
						}
					>
						{aiCache.pending.toLocaleString("ru-RU")}
					</div>
				</div>
				<div className="bg-surf px-4 py-3">
					<div className="mb-0.5 text-[11px] text-t-3">
						{t("aiTranslation.admin.widget.approvedWeek")}
					</div>
					<div className="text-[20px] font-bold text-grn">
						{aiCache.approvedThisWeek.toLocaleString("ru-RU")}
					</div>
				</div>
				<div className="bg-surf px-4 py-3">
					<div className="mb-0.5 text-[11px] text-t-3">
						{t("aiTranslation.admin.widget.notExported")}
					</div>
					<div
						className={
							aiCache.approvedNotExported > 0
								? "text-[20px] font-bold text-amber-500"
								: "text-[20px] font-bold text-t-1"
						}
					>
						{aiCache.approvedNotExported.toLocaleString("ru-RU")}
					</div>
				</div>
			</div>

			{aiCache.topWords.length > 0 && (
				<div className="border-t-[0.5px] border-bd-1 px-4 py-3">
					<SectionLabel>
						{t("aiTranslation.admin.widget.topWords")}
					</SectionLabel>
					<div className="flex flex-col gap-1.5">
						{aiCache.topWords.slice(0, 5).map((w, i) => (
							<div
								key={`${w.lemma}-${i}`}
								className="flex items-center justify-between gap-2"
							>
								<div className="min-w-0">
									<span className="text-[12.5px] font-medium text-t-1">
										{w.lemma}
									</span>
									{w.translation && (
										<span className="ml-1.5 text-[11.5px] text-t-3">
											{w.translation}
										</span>
									)}
								</div>
								<span className="shrink-0 text-[11px] text-t-3">
									×{w.requestCount}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</AdminCard>
	);
};

export const DashboardAiCacheCardSkeleton = () => (
	<AdminCard>
		<div className="flex items-center justify-between px-4 py-3">
			<div className="h-4 w-24 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="grid grid-cols-3 gap-px border-t-[0.5px] border-bd-1 bg-bd-1">
			<div className="bg-surf px-4 py-3">
				<div className="mb-1 h-3 w-16 animate-pulse rounded bg-surf-3" />
				<div className="h-6 w-10 animate-pulse rounded bg-surf-3" />
			</div>
			<div className="bg-surf px-4 py-3">
				<div className="mb-1 h-3 w-16 animate-pulse rounded bg-surf-3" />
				<div className="h-6 w-10 animate-pulse rounded bg-surf-3" />
			</div>
			<div className="bg-surf px-4 py-3">
				<div className="mb-1 h-3 w-16 animate-pulse rounded bg-surf-3" />
				<div className="h-6 w-10 animate-pulse rounded bg-surf-3" />
			</div>
		</div>
	</AdminCard>
);
