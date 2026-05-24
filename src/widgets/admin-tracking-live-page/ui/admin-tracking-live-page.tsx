"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import type { Dictionary, Locale } from "@/i18n/locales";
import { LIVE_EVENT_TYPES } from "@/features/admin-analytics";
import type { AnalyticsLiveEventType } from "@/features/admin-analytics";
import { AnalyticsTabs } from "@/widgets/admin-tracking-overview-page";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { useLiveState } from "../model/use-live-state";
import { formatLiveTime, countryCodeToFlag, deviceIcon, eventBadgeClass } from "../lib/format-live";
import type { ComponentProps } from "react";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingLivePageProps {
	lang: Locale;
	dict: TrackingDict;
}

export const AdminTrackingLivePage = ({ lang, dict }: AdminTrackingLivePageProps) => {
	const { events, filter, paused, realtime, handleTogglePause, handleClear, handleFilterChange } =
		useLiveState();

	const handleFilterAll: ComponentProps<"button">["onClick"] = () => handleFilterChange(null);
	const handleFilterType = (type: AnalyticsLiveEventType) =>
		handleFilterChange(filter === type ? null : type);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">{dict.live.title}</h1>
				</div>

				<div className="ml-auto flex items-center gap-1.5 text-[12px] text-t-2">
					<span className="relative flex size-1.5">
						<span className="absolute inline-flex size-full animate-ping rounded-full bg-grn opacity-75" />
						<span className="relative inline-flex size-1.5 rounded-full bg-grn" />
					</span>
					<span className="font-medium text-t-1">
						{realtime.data?.count ?? "—"}
					</span>
					<span>{dict.realtime.online}</span>
				</div>

				<div className="flex items-center gap-1.5">
					<Button
						onClick={handleTogglePause}
						title={paused ? dict.live.resume : dict.live.pause}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
					>
						{paused ? dict.live.resume : dict.live.pause}
					</Button>
					<Button
						onClick={handleClear}
						title={dict.live.clear}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
					>
						{dict.live.clear}
					</Button>
				</div>
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="live" dict={dict.tabs} />

				<div className="mt-4 mb-3.5 flex flex-wrap gap-1">
					<Button
						onClick={handleFilterAll}
						title={dict.live.all}
						className={cn(
							"h-[26px] rounded-md px-2.5 text-[11.5px] font-medium transition-all",
							filter === null
								? "bg-acc-bg text-acc-t"
								: "text-t-3 hover:text-t-2",
						)}
					>
						{dict.live.all}
					</Button>
					{LIVE_EVENT_TYPES.map((type) => {
						const handleClick: ComponentProps<"button">["onClick"] = () => handleFilterType(type);
						const label = dict.live.eventTypes[type as keyof typeof dict.live.eventTypes] ?? type;
						return (
							<Button
								key={type}
								onClick={handleClick}
								title={label}
								className={cn(
									"h-[26px] rounded-md px-2.5 text-[11.5px] font-medium transition-all",
									filter === type
										? "bg-acc-bg text-acc-t"
										: "text-t-3 hover:text-t-2",
								)}
							>
								{label}
							</Button>
						);
					})}
				</div>

				<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
					<Table aria-label={dict.live.title}>
						<TableHeader>
							<TableRow className="border-b border-bd-1">
								<TableHead className="w-20 px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									{dict.live.time}
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2">
									{dict.live.event}
								</TableHead>
								<TableHead className="px-3.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2 hidden md:table-cell">
									{dict.live.page}
								</TableHead>
								<TableHead className="w-10 px-3.5 py-[10px] text-center text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2 hidden lg:table-cell">
									{dict.live.device}
								</TableHead>
								<TableHead className="w-10 px-3.5 py-[10px] text-center text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 bg-surf-2 hidden lg:table-cell">
									{dict.live.country}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{events.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="px-4 py-10 text-center text-[12px] text-t-3">
										{dict.live.noEvents}
									</TableCell>
								</TableRow>
							) : (
								events.map((event) => (
									<TableRow
										key={event.id}
										className={cn(
											"border-b border-bd-1 transition-colors last:border-0",
											(event as { _justIn?: boolean })._justIn
												? "bg-acc-bg"
												: "hover:bg-surf-2",
										)}
									>
										<TableCell className="px-3.5 py-[10px] font-mono text-[11px] text-t-3">
											{formatLiveTime(event.createdAt)}
										</TableCell>
										<TableCell className="px-3.5 py-[10px]">
											<span
												className={cn(
													"inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
													eventBadgeClass(event.eventType),
												)}
											>
												{dict.live.eventTypes[event.eventType as keyof typeof dict.live.eventTypes] ?? event.eventType}
											</span>
										</TableCell>
										<TableCell className="px-3.5 py-[10px] hidden md:table-cell">
											<span className="font-mono text-[11px] text-t-3 truncate max-w-xs block">
												{event.path ?? "—"}
											</span>
										</TableCell>
										<TableCell className="px-3.5 py-[10px] text-center hidden lg:table-cell">
											<span title={event.device ?? undefined}>{deviceIcon(event.device)}</span>
										</TableCell>
										<TableCell className="px-3.5 py-[10px] text-center hidden lg:table-cell">
											{countryCodeToFlag(event.country)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};
