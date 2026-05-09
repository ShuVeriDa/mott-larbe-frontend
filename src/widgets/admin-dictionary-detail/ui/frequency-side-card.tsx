"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictFrequencyStats } from "@/entities/dictionary";

interface FrequencySideCardProps {
	data: AdminDictFrequencyStats | undefined;
	isLoading: boolean;
}

export const FrequencySideCard = ({ data, isLoading }: FrequencySideCardProps) => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			<div className="border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.frequencyCard")}
				</Typography>
			</div>

			{isLoading ? (
				<div className="px-4 py-3.5">
					<div className="mb-1.5 h-2.5 w-28 animate-pulse rounded bg-surf-3" />
					<div className="mb-1.5 h-1.5 w-full animate-pulse rounded-full bg-surf-3" />
					<div className="flex justify-between">
						<div className="h-2.5 w-4 animate-pulse rounded bg-surf-3" />
						<div className="h-2.5 w-24 animate-pulse rounded bg-surf-3" />
					</div>
				</div>
			) : !data ? null : (
				<>
					<div className="px-4 py-3.5">
						<div className="mb-1.5 text-[11px] text-t-3">
							{t("admin.dictionaryDetail.corpusFrequency")}
						</div>
						<div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-surf-3">
							<div
								className="h-full rounded-full bg-gradient-to-r from-acc to-[#5a8af8] transition-all duration-500"
								style={{
									width: `${data.maxFrequency > 0 ? Math.round((data.frequency / data.maxFrequency) * 100) : 0}%`,
								}}
							/>
						</div>
						<div className="flex justify-between text-[11px] text-t-3">
							<Typography tag="span">0</Typography>
							<Typography tag="span">
								<Typography tag="strong" className="text-t-2">{data.frequency.toLocaleString("ru-RU")}</Typography>{" "}
								/ {data.maxFrequency.toLocaleString("ru-RU")} {t("admin.dictionaryDetail.max")}
							</Typography>
						</div>
					</div>
					<div className="px-4 pb-3.5 text-[11.5px] leading-[1.5] text-t-3">
						{t("admin.dictionaryDetail.rankInfo", {
							rank: data.rank,
							coverage: Math.round(data.textCoverage * 100),
						})}
					</div>
				</>
			)}
		</div>
	);
};
