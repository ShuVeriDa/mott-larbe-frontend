"use client";

import type { FeedbackThread } from "@/entities/feedback";
import { useFeedbackThreads } from "@/entities/feedback";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useState } from 'react';
import { FeedbackChat } from "./feedback-chat";
import { FeedbackNewThreadModal } from "./feedback-new-thread-modal";
import { FeedbackListSkeleton } from "./feedback-skeleton";
import { FeedbackThreadList } from "./feedback-thread-list";

export const FeedbackPage = () => {
	const { t } = useI18n();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useFeedbackThreads();
	const threads = data?.pages.flatMap(p => p.items) ?? [];

	const handleSelectThread = (thread: FeedbackThread) => {
		setActiveId(thread.id);
		setIsChatVisible(true);
	};

	const handleBack = () => {
		setIsChatVisible(false);
	};

	const handleNewThread = () => {
		setIsModalOpen(true);
	};

	const handleModalSuccess = (threadId: string) => {
		setIsModalOpen(false);
		setActiveId(threadId);
		setIsChatVisible(true);
	};

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) fetchNextPage();
	};

	const userInitials = "У";

		const handleClose: NonNullable<ComponentProps<typeof FeedbackNewThreadModal>["onClose"]> = () => setIsModalOpen(false);
return (
		<>
			{/* Topbar — mobile "New" button */}
			<div className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-sm:px-4">
				<span className="flex-1 text-[13.5px] font-semibold text-t-1">
					{t("feedback.pageTitle")}
				</span>
				{/* Mobile-only new button in topbar */}
				<button
					type="button"
					onClick={handleNewThread}
					className="hidden h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)] transition-opacity hover:opacity-[0.88] max-sm:flex"
				>
					<svg
						viewBox="0 0 14 14"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						className="size-[11px]"
					>
						<path d="M7 2v10M2 7h10" />
					</svg>
					{t("feedback.new")}
				</button>
			</div>

			{/* Main layout */}
			<div className="relative flex min-h-0 flex-1 overflow-hidden">
				{/* Thread list */}
				{isPending ? (
					<div className="w-[280px] shrink-0 border-r border-bd-1 bg-surf max-sm:absolute max-sm:inset-0 max-sm:w-full">
						<div className="shrink-0 border-b border-bd-1 px-4 pb-2.5 pt-3.5">
							<div className="mb-2.5 h-3 w-28 animate-pulse rounded-sm bg-surf-3" />
							<div className="h-[30px] animate-pulse rounded-base bg-surf-3" />
						</div>
						<FeedbackListSkeleton />
					</div>
				) : (
					<FeedbackThreadList
						threads={threads}
						activeId={activeId}
						isMobileVisible={isChatVisible}
						hasNextPage={!!hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						t={t}
						onSelect={handleSelectThread}
						onNewThread={handleNewThread}
						onLoadMore={handleLoadMore}
					/>
				)}

				{/* Chat panel */}
				{activeId ? (
					<FeedbackChat
						key={activeId}
						threadId={activeId}
						userInitials={userInitials}
						isMobileVisible={isChatVisible}
						t={t}
						onBack={handleBack}
					/>
				) : (
					<div className="flex flex-1 flex-col items-center justify-center gap-2 max-sm:hidden">
						<div className="flex size-12 items-center justify-center rounded-xl bg-surf-2">
							<svg
								viewBox="0 0 20 20"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.4"
								className="size-6 text-t-3"
							>
								<path d="M16 14H11l-4 3V14H4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 4 2.5h12A1.5 1.5 0 0 1 17.5 4v8.5A1.5 1.5 0 0 1 16 14z" />
							</svg>
						</div>
						<p className="text-[13px] text-t-3">{t("feedback.selectThread")}</p>
					</div>
				)}
			</div>

			{/* Modal */}
			<FeedbackNewThreadModal
				isOpen={isModalOpen}
				t={t}
				onClose={handleClose}
				onSuccess={handleModalSuccess}
			/>
		</>
	);
};
