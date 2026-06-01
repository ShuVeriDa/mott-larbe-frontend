"use client";
import type { StatsPeriod, WordsPerDayPoint } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface PerDayChartProps {
	wordsPoints: WordsPerDayPoint[];
	phrasesPoints: WordsPerDayPoint[];
	period?: StatsPeriod;
}

type Tab = "words" | "phrases";

const formatLabel = (date: string, period?: StatsPeriod, lang?: string): string => {
	const d = new Date(date);
	if (period === "year" || period === "all") {
		return new Intl.DateTimeFormat(lang ?? "ru", { month: "short", timeZone: "UTC" }).format(d);
	}
	return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export const PerDayChart = ({
	wordsPoints,
	phrasesPoints,
	period,
}: PerDayChartProps) => {
	const { t, lang } = useI18n();
	const [tab, setTab] = useState<Tab>("words");

	const handleTabWords = () => setTab("words");
	const handleTabPhrases = () => setTab("phrases");

	const isWords = tab === "words";
	const rawPoints = isWords ? wordsPoints : phrasesPoints;

	const data = rawPoints.map(p => ({
		label: formatLabel(p.date, period, lang),
		count: p.count,
	}));

	const isEmpty = rawPoints.every(p => p.count === 0);

	const periodMetaKey: Record<string, string> = {
		week: "metaWeek",
		month: "metaMonth",
		year: "metaYear",
		all: "metaAll",
	};
	const metaKey = periodMetaKey[period ?? "month"] ?? "metaMonth";

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4">
			<header className="mb-3 flex flex-wrap items-center justify-between gap-1">
				<div role="tablist" className="flex items-center gap-0.5 rounded-base bg-surf-2 p-0.5">
					<button
						role="tab"
						aria-selected={isWords}
						onClick={handleTabWords}
						className={`min-w-0 rounded-[5px] px-2.5 py-1 text-[11px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 ${
							isWords ? "bg-surf text-t-1 shadow-sm" : "text-t-3 hover:text-t-2"
						}`}
					>
						{t("statistics.words.title")}
					</button>
					<button
						role="tab"
						aria-selected={!isWords}
						onClick={handleTabPhrases}
						className={`min-w-0 rounded-[5px] px-2.5 py-1 text-[11px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 ${
							!isWords
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-3 hover:text-t-2"
						}`}
					>
						{t("statistics.phrases.title")}
					</button>
				</div>
				<Typography tag="span" className="shrink-0 text-[11px] text-t-3">
					{isWords
						? t(`statistics.perDay.${metaKey}`)
						: t(`statistics.perDayPhrases.${metaKey}`)}
				</Typography>
			</header>

			{isEmpty ? (
				<div className="flex h-[120px] items-center justify-center text-[11px] text-t-3">
					{isWords
						? t("statistics.perDay.empty")
						: t("statistics.perDayPhrases.empty")}
				</div>
			) : (
				<div role="img" aria-label={isWords ? t("statistics.perDay.meta") : t("statistics.perDayPhrases.meta")}>
				<ResponsiveContainer width="100%" height={120}>
					<AreaChart
						data={data}
						margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
					>
						<defs>
							<linearGradient id="perDayWordsGrad" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--acc)" stopOpacity={0.3} />
								<stop offset="95%" stopColor="var(--acc)" stopOpacity={0.02} />
							</linearGradient>
							<linearGradient
								id="perDayPhrasesGrad"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop offset="5%" stopColor="var(--grn)" stopOpacity={0.3} />
								<stop offset="95%" stopColor="var(--grn)" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="0"
							stroke="var(--bd-1)"
							vertical={false}
						/>
						<XAxis
							dataKey="label"
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
							interval="preserveStartEnd"
						/>
						<YAxis
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
							allowDecimals={false}
						/>
						<Tooltip
							contentStyle={{
								background: "var(--surf)",
								border: "0.5px solid var(--bd-2)",
								borderRadius: 8,
								fontSize: 12,
								color: "var(--t-1)",
							}}
							labelStyle={{ color: "var(--t-3)", fontSize: 11 }}
							cursor={{ stroke: "var(--bd-2)", strokeWidth: 1 }}
						/>
						<Area
							dataKey="count"
							name={
								isWords
									? t("statistics.perDay.meta")
									: t("statistics.perDayPhrases.meta")
							}
							stroke={isWords ? "var(--acc)" : "var(--grn)"}
							strokeWidth={1.5}
							fill={
								isWords ? "url(#perDayWordsGrad)" : "url(#perDayPhrasesGrad)"
							}
							dot={false}
							activeDot={{ r: 4, fill: isWords ? "var(--acc)" : "var(--grn)" }}
							type="monotone"
						/>
					</AreaChart>
				</ResponsiveContainer>
				</div>
			)}
		</section>
	);
};
