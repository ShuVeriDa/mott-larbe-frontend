"use client";

import type { PhraseReviewStats } from "@/entities/phrasebook";
import type { UseQueryResult } from "@tanstack/react-query";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { PhraseStatRow } from "./phrase-stat-row";

interface PhraseStatsCardProps {
	phraseStats: UseQueryResult<PhraseReviewStats>;
}

export const PhraseStatsCard = ({ phraseStats }: PhraseStatsCardProps) => {
	const { t, lang } = useI18n();
	const { data, isLoading } = phraseStats;

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 gap-1 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.phrases.title")}
				</Typography>
				<Link
					href={`/${lang}/review`}
					className="text-[11px] text-acc hover:underline"
				>
					{t("statistics.phrases.reviewLink")} →
				</Link>
			</header>

			{isLoading ? (
				<div className="flex flex-col gap-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between">
							<div className="h-2.5 w-20 animate-pulse motion-reduce:animate-none rounded bg-surf-3" />
							<div className="h-2.5 w-8 animate-pulse motion-reduce:animate-none rounded bg-surf-3" />
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-2">
					<PhraseStatRow
						label={t("statistics.phrases.due")}
						value={data?.dueCount ?? 0}
						dotColor="bg-amb"
					/>
					<PhraseStatRow
						label={t("statistics.phrases.learning")}
						value={data?.learningCount ?? 0}
						dotColor="bg-acc"
					/>
					<PhraseStatRow
						label={t("statistics.phrases.known")}
						value={data?.knownCount ?? 0}
						dotColor="bg-grn"
					/>
					<div className="border-t border-bd-1 pt-2">
						<PhraseStatRow
							label={t("statistics.phrases.streak")}
							value={data?.streak ?? 0}
							dotColor="bg-pur"
						/>
					</div>
				</div>
			)}
		</section>
	);
};
