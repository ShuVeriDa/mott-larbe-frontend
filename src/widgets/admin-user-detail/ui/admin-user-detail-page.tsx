"use client";import { ComponentProps, useState } from 'react';
import { useAdminUserDetailPage } from "../model/use-admin-user-detail-page";
import { UserDetailTopbar } from "./user-detail-topbar";
import { UserHeroCard } from "./user-hero-card";
import { UserMiniStats } from "./user-mini-stats";
import { UserSubscriptionCard } from "./user-subscription-card";
import { UserEventsCard } from "./user-events-card";
import { UserFeatureFlagsCard } from "./user-feature-flags-card";
import { AddSubscriptionModal } from "@/widgets/admin-subscriptions-page/ui/add-subscription-modal";

interface AdminUserDetailPageProps {
	userId: string;
}

export const AdminUserDetailPage = ({ userId }: AdminUserDetailPageProps) => {
	const [showAddSubscription, setShowAddSubscription] = useState(false);

	const {
		detail,
		roles,
		events,
		eventsSummary,
		subscription,
		sessions,
		featureFlags,
		mutations,
		subscriptionMutations,
		eventsTab,
		setEventsTab,
		eventsFilter,
		handleEventTypeChange,
		handleEventPeriodChange,
		handleEventsLoadMore,
	} = useAdminUserDetailPage(userId);

		const handleClose: NonNullable<ComponentProps<typeof AddSubscriptionModal>["onClose"]> = () => setShowAddSubscription(false);
	const handleManageSubscription: NonNullable<ComponentProps<typeof UserHeroCard>["onManageSubscription"]> = () => setShowAddSubscription(true);
	const handleManage: NonNullable<ComponentProps<typeof UserSubscriptionCard>["onManage"]> = () => setShowAddSubscription(true);
return (
		<div className="flex min-h-0 flex-1 flex-col">
			<UserDetailTopbar user={detail.data} mutations={mutations} />

			{showAddSubscription && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
					<div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-bd-1 bg-surf shadow-2xl">
						<AddSubscriptionModal
							mutations={subscriptionMutations}
							initialEmail={detail.data?.email}
							onClose={handleClose}
						/>
					</div>
				</div>
			)}

			<div className="overflow-y-auto px-[22px] py-[18px] pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-16">
				<div className="grid grid-cols-[260px_1fr] items-start gap-3.5 max-[700px]:grid-cols-1">

					{/* ── Left column ── */}
					<UserHeroCard
						user={detail.data}
						isLoading={detail.isLoading}
						mutations={mutations}
						roleMutations={roles}
						sessions={sessions}
						onManageSubscription={handleManageSubscription}
					/>

					{/* ── Right column ── */}
					<div className="flex flex-col gap-3">
						<UserMiniStats
							stats={detail.data?.learningStats}
							isLoading={detail.isLoading}
						/>

						<UserSubscriptionCard subscription={subscription} onManage={handleManage} />

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
