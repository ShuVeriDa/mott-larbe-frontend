"use client";

import { usePhraseReviewStats } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

interface StatRowProps {
	label: string;
	value: number;
	dotColor: string;
}

const StatRow = ({ label, value, dotColor }: StatRowProps) => (
	<div className="flex items-center justify-between gap-2">
		<div className="flex items-center gap-1.5">
			<span className={`size-2 shrink-0 rounded-full ${dotColor}`} aria-hidden="true" />
			<Typography tag="span" className="text-[11.5px] text-t-2">
				{label}
			</Typography>
		</div>
		<Typography tag="span" className="text-[11.5px] font-semibold tabular-nums text-t-1">
			{value}
		</Typography>
	</div>
);

export const PhraseStatsCard = () => {
	const { t, lang } = useI18n();
	const { data, isLoading } = usePhraseReviewStats();

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.phrases.title")}
				</Typography>
				<Link
					href={`/${lang}/phrasebook/review`}
					className="text-[11px] text-acc hover:underline"
				>
					{t("statistics.phrases.reviewLink")} →
				</Link>
			</header>

			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="h-2.5 w-20 animate-pulse rounded bg-surf-3" />
							<div className="h-2.5 w-8 animate-pulse rounded bg-surf-3" />
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-2">
					<StatRow label={t("statistics.phrases.due")}      value={data?.dueCount ?? 0}      dotColor="bg-amb" />
					<StatRow label={t("statistics.phrases.learning")} value={data?.learningCount ?? 0} dotColor="bg-acc" />
					<StatRow label={t("statistics.phrases.known")}    value={data?.knownCount ?? 0}    dotColor="bg-grn" />
					<div className="border-t border-bd-1 pt-2">
						<StatRow label={t("statistics.phrases.streak")} value={data?.streak ?? 0} dotColor="bg-pur" />
					</div>
				</div>
			)}
		</section>
	);
};
