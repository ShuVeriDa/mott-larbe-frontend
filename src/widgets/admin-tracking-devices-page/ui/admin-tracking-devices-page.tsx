"use client";

import { AdminCard } from "@/shared/ui/admin-card";
import { useState } from "react";
import { useAdminAnalyticsUaBreakdown, useAnalyticsRange, useInvalidateAdminAnalytics } from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/types";
import type { AnalyticsUaKind as UaKind } from "@/features/admin-analytics";
import { AnalyticsTabs } from "@/widgets/admin-tracking-overview-page";
import { AnalyticsToolbar } from "@/widgets/admin-tracking-overview-page";
import { Button } from "@/shared/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { cn } from "@/shared/lib/cn";
import type { ComponentProps } from "react";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingDevicesPageProps {
	lang: Locale;
	dict: TrackingDict;
}

const UA_KINDS: { key: UaKind; label: keyof TrackingDict["devices"] }[] = [
	{ key: "device", label: "device" },
	{ key: "browser", label: "browser" },
	{ key: "os", label: "os" },
];

export const AdminTrackingDevicesPage = ({ lang, dict }: AdminTrackingDevicesPageProps) => {
	const [kind, setKind] = useState<UaKind>("device");
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;
	const invalidate = useInvalidateAdminAnalytics();

	const query = useAdminAnalyticsUaBreakdown(kind, { from: range.from, to: range.to });
	const items = query.data?.items ?? [];

	const handleKindChange = (k: UaKind) => setKind(k);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">{dict.devices.title}</h1>
				</div>
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="devices" dict={dict.tabs} />

				<div className="mt-4 mb-4">
					<AnalyticsToolbar rangeState={rangeState} dict={dict.toolbar} onRefresh={invalidate} />
				</div>

				<div className="mb-3.5 flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5 w-fit">
					{UA_KINDS.map(({ key, label }) => {
						const handleClick: ComponentProps<"button">["onClick"] = () => handleKindChange(key);
						return (
							<Button
								key={key}
								onClick={handleClick}
								title={dict.devices[label] as string}
								className={cn(
									"h-[26px] rounded-md px-3 text-[11.5px] font-medium transition-all",
									kind === key ? "bg-surf text-t-1 shadow-sm" : "text-t-2 hover:text-t-1",
								)}
							>
								{dict.devices[label] as string}
							</Button>
						);
					})}
				</div>

				<AdminCard>
					<Table aria-label={dict.devices.title}>
						<TableHeader>
							<TableRow className="border-b border-bd-1">
								<TableHead className="px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									{dict.devices[kind === "device" ? "device" : kind === "browser" ? "browser" : "os"] as string}
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									{dict.devices.visitors}
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									{dict.devices.share}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{query.isLoading
								? Array.from({ length: 8 }).map((_, i) => (
										<TableRow key={i} className="border-b border-bd-1">
											<TableCell className="px-3.5 py-[10px]">
												<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right">
												<div className="ml-auto h-3 w-16 animate-pulse rounded bg-surf-3" />
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right">
												<div className="ml-auto h-3 w-12 animate-pulse rounded bg-surf-3" />
											</TableCell>
										</TableRow>
									))
								: items.map((item) => (
										<TableRow
											key={item.key}
											className="border-b border-bd-1 transition-colors last:border-0 hover:bg-surf-2"
										>
											<TableCell className="px-3.5 py-[10px] text-[12.5px] font-medium text-t-1">
												{item.key}
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right font-mono text-[12px] text-t-3">
												{item.visitors.toLocaleString()}
											</TableCell>
											<TableCell className="px-3.5 py-[10px] text-right font-mono text-[12px] text-t-3">
												{(item.share * 100).toFixed(1)}%
											</TableCell>
										</TableRow>
									))}
							{!query.isLoading && items.length === 0 && (
								<TableRow>
									<TableCell colSpan={3} className="px-4 py-10 text-center text-[12px] text-t-3">
										{dict.devices.noData}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</AdminCard>
			</div>
		</div>
	);
};
