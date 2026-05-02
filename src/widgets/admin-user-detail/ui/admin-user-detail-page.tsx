"use client";

import { useAdminUserDetailPage } from "../model/use-admin-user-detail-page";
import { UserDetailTopbar } from "./user-detail-topbar";
import { UserHeroCard } from "./user-hero-card";
import { UserMiniStats } from "./user-mini-stats";
import { UserSubscriptionCard } from "./user-subscription-card";
import { UserEventsCard } from "./user-events-card";
import { UserFeatureFlagsCard } from "./user-feature-flags-card";

interface AdminUserDetailPageProps {
	userId: string;
}

export const AdminUserDetailPage = ({ userId }: AdminUserDetailPageProps) => {
	const {
		detail,
		roles,
		events,
		eventsSummary,
		subscription,
		sessions,
		featureFlags,
		mutations,
		eventsTab,
		setEventsTab,
		eventsFilter,
		handleEventTypeChange,
		handleEventPeriodChange,
		handleEventsLoadMore,
	} = useAdminUserDetailPage(userId);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
			<UserDetailTopbar user={detail.data} mutations={mutations} />

			<div className="px-[22px] py-[18px] pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-16">
				<div className="grid grid-cols-[260px_1fr] items-start gap-3.5 max-[700px]:grid-cols-1">

					{/* ── Left column ── */}
					<UserHeroCard
						user={detail.data}
						isLoading={detail.isLoading}
						mutations={mutations}
						roleMutations={roles}
						sessions={sessions}
					/>

					{/* ── Right column ── */}
					<div className="flex flex-col gap-3">
						<UserMiniStats
							stats={detail.data?.learningStats}
							isLoading={detail.isLoading}
						/>

						<UserSubscriptionCard subscription={subscription} />

						<UserEventsCard
							eventsTab={eventsTab}
							setEventsTab={setEventsTab}
							events={events}
							eventsSummary={eventsSummary}
							sessions={sessions}
							eventsFilter={eventsFilter}
							onEventTypeChange={handleEventTypeChange}
							onEventPeriodChange={handleEventPeriodChange}
							onEventsLoadMore={handleEventsLoadMore}
						/>

						<UserFeatureFlagsCard featureFlags={featureFlags} />
					</div>
				</div>
			</div>
		</div>
	);
};
