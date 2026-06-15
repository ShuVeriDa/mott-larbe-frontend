import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import type { Locale } from "@/i18n/types";

interface TabsDict {
	overview: string;
	timeseries: string;
	pages: string;
	wordClicks: string;
	referrers: string;
	devices: string;
	geography: string;
	live: string;
}

interface AnalyticsTabsProps {
	lang: Locale;
	active: string;
	dict: TabsDict;
}

const TABS = [
	{ key: "overview", suffix: "" },
	{ key: "timeseries", suffix: "/timeseries" },
	{ key: "pages", suffix: "/pages" },
	{ key: "wordClicks", suffix: "/word-clicks" },
	{ key: "referrers", suffix: "/referrers" },
	{ key: "devices", suffix: "/devices" },
	{ key: "geography", suffix: "/geography" },
	{ key: "live", suffix: "/live" },
] as const;

export const AnalyticsTabs = ({ lang, active, dict }: AnalyticsTabsProps) => (
	<div className="mb-3.5 overflow-x-auto [&::-webkit-scrollbar]:h-0">
		<div className="flex w-fit rounded-[9px] bg-surf-2 p-[3px]">
			{TABS.map((tab) => (
				<Link
					key={tab.key}
					href={`/${lang}/admin/tracking${tab.suffix}`}
					className={cn(
						"flex cursor-pointer items-center whitespace-nowrap rounded-[6px] px-3 py-1 text-[12px] font-medium transition-colors",
						active === tab.key
							? "bg-surf text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]"
							: "text-t-3 hover:text-t-2",
					)}
				>
					{dict[tab.key as keyof TabsDict]}
				</Link>
			))}
		</div>
	</div>
);
