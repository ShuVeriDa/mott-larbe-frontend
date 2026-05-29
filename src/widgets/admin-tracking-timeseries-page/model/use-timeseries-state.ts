"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { AnalyticsMetric, AnalyticsGranularity } from "@/features/admin-analytics";

const METRICS: AnalyticsMetric[] = [
	"pageviews",
	"uniqueVisitors",
	"sessions",
	"totalEvents",
	"bounceRate",
	"avgSessionSec",
];

const GRANULARITIES: AnalyticsGranularity[] = ["day", "week", "month"];

const isMetric = (v: string | null): v is AnalyticsMetric =>
	METRICS.includes(v as AnalyticsMetric);

const isGranularity = (v: string | null): v is AnalyticsGranularity =>
	GRANULARITIES.includes(v as AnalyticsGranularity);

export const useTimeseriesState = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const rawMetric = searchParams.get("metric");
	const rawGran = searchParams.get("gran");
	const rawCompare = searchParams.get("compare");

	const metric: AnalyticsMetric = isMetric(rawMetric) ? rawMetric : "pageviews";
	const granularity: AnalyticsGranularity = isGranularity(rawGran) ? rawGran : "day";
	const compare = rawCompare === "1";

	const update = (patch: Record<string, string>) => {
		const params = new URLSearchParams(searchParams.toString());
		for (const [k, v] of Object.entries(patch)) params.set(k, v);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const setMetric = (m: AnalyticsMetric) => update({ metric: m });
	const setGranularity = (g: AnalyticsGranularity) => update({ gran: g });
	const setCompare = (v: boolean) => update({ compare: v ? "1" : "0" });

	return { metric, granularity, compare, setMetric, setGranularity, setCompare, METRICS, GRANULARITIES };
};
