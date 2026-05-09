"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import type { TopUnknownWord } from "@/entities/admin-analytics";

interface AnalyticsTopWordsProps {
	words?: TopUnknownWord[];
	isLoading?: boolean;
}

export const AnalyticsTopWords = ({
	words,
	isLoading,
}: AnalyticsTopWordsProps) => {
	const { t } = useI18n();
	const params = useParams();
	const lang = params?.lang as string;

	return (
		<div className="rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between px-4 pt-3.5 pb-3">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.topWords.title")}
				</Typography>
				<Link
					href={`/${lang}/admin/unknown-words`}
					className="text-[11.5px] text-acc hover:underline"
				>
					{t("admin.analytics.topWords.viewAll")}
				</Link>
			</div>

			{isLoading || !words
				? Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-2 border-t border-bd-1 px-4 py-1.5"
						>
							<div className="h-3 w-4 animate-pulse rounded bg-surf-3" />
							<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
							<div className="flex-1">
								<div className="h-1.5 animate-pulse rounded-full bg-surf-3" />
							</div>
							<div className="h-3 w-8 animate-pulse rounded bg-surf-3" />
						</div>
					))
				: words.map((word) => (
						<div
							key={word.rank}
							className="flex items-center gap-2 border-t border-bd-1 px-4 py-1.5"
						>
							<Typography tag="span" className="w-4 shrink-0 text-right text-[10.5px] font-semibold text-t-3">
								{word.rank}
							</Typography>
							<Typography tag="span" className="min-w-[110px] shrink-0 text-[12.5px] font-medium text-t-1 max-sm:min-w-[80px]">
								{word.word}
							</Typography>
							<div className="flex-1">
								<div className="h-[5px] overflow-hidden rounded-full bg-surf-3">
									<div
										className="h-full rounded-full bg-acc opacity-70"
										style={{ width: `${word.percentOfTop}%` }}
									/>
								</div>
							</div>
							<Typography tag="span" className="min-w-[36px] shrink-0 text-right text-[11.5px] font-medium text-t-2">
								{word.count}×
							</Typography>
						</div>
					))}
		</div>
	);
};
