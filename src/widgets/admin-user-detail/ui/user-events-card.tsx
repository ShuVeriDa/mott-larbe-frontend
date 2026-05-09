"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { EventsTab } from "../model/use-admin-user-detail-page";
import type { useAdminUserEvents, useAdminUserEventsSummary } from "@/entities/admin-user/model/use-admin-user-events";
import type { useAdminUserSessions } from "@/entities/admin-user/model/use-admin-user-sessions";
import type { FetchUserEventsQuery, UserEventType } from "@/entities/admin-user";
import { UserEventsFeed } from "./user-events-feed";
import { UserEventsSummaryTab } from "./user-events-summary";
import { UserSessionsTab } from "./user-sessions-tab";

interface UserEventsCardProps {
	eventsTab: EventsTab;
	setEventsTab: (tab: EventsTab) => void;
	events: ReturnType<typeof useAdminUserEvents>;
	eventsSummary: ReturnType<typeof useAdminUserEventsSummary>;
	sessions: ReturnType<typeof useAdminUserSessions>;
	eventsFilter: FetchUserEventsQuery;
	onEventTypeChange: (type: UserEventType | "") => void;
	onEventPeriodChange: (period: FetchUserEventsQuery["period"]) => void;
	onEventsLoadMore: () => void;
}

export const UserEventsCard = ({
	eventsTab,
	setEventsTab,
	events,
	eventsSummary,
	sessions,
	eventsFilter,
	onEventTypeChange,
	onEventPeriodChange,
	onEventsLoadMore,
}: UserEventsCardProps) => {
	const { t } = useI18n();
	const tabs: { key: EventsTab; label: string }[] = [
		{ key: "feed", label: t("admin.userDetail.events.feedTab") },
		{ key: "summary", label: t("admin.userDetail.events.summaryTab") },
		{ key: "sessions", label: t("admin.userDetail.events.sessionsTab") },
	];

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex flex-wrap items-center gap-1.5 border-b border-bd-1 px-3.5 py-3">
				<span className="text-[13px] font-semibold text-t-1">
					{t("admin.userDetail.events.title")}
				</span>
				<div className="flex gap-0.5 ml-auto max-sm:order-2 max-sm:w-full">
					{tabs.map(({ key, label }) => {
					  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setEventsTab(key);
					  return (
						<button
							key={key}
							onClick={handleClick}
							className={cn(
								"h-[26px] rounded-[6px] border-none px-2.5 text-[12px] transition-colors",
								eventsTab === key
									? "bg-surf-3 font-medium text-t-1"
									: "bg-transparent text-t-3 hover:bg-surf-3 hover:text-t-2",
							)}
						>
							{label}
						</button>
					);
					})}
				</div>
			</div>

			{eventsTab === "feed" && (
				<UserEventsFeed
					events={events.data?.items ?? []}
					total={events.data?.total ?? 0}
					isLoading={events.isLoading}
					filter={eventsFilter}
					onTypeChange={onEventTypeChange}
					onPeriodChange={onEventPeriodChange}
					onLoadMore={onEventsLoadMore}
				/>
			)}

			{eventsTab === "summary" && (
				<UserEventsSummaryTab
					summary={eventsSummary.data}
					isLoading={eventsSummary.isLoading}
				/>
			)}

			{eventsTab === "sessions" && <UserSessionsTab sessions={sessions} />}
		</div>
	);
};
