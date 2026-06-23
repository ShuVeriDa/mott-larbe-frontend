"use client";

import { Typography } from "@/shared/ui/typography";

import type { FeedbackThread } from "@/entities/feedback";
import { Button } from "@/shared/ui/button";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { Plus } from "lucide-react";
import { ComponentProps, useRef } from "react";
import { FeedbackEmpty } from "./feedback-empty";
import { FeedbackThreadItem } from "./feedback-thread-item";

type Translator = (key: string) => string;

interface FeedbackThreadListProps {
	threads: FeedbackThread[];
	activeId: string | null;
	isMobileVisible: boolean;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
	t: Translator;
	onSelect: (thread: FeedbackThread) => void;
	onNewThread: () => void;
	onLoadMore: () => void;
}

export const FeedbackThreadList = ({
	threads,
	activeId,
	isMobileVisible,
	hasNextPage,
	isFetchingNextPage,
	t,
	onSelect,
	onNewThread,
	onLoadMore,
}: FeedbackThreadListProps) => {
	const sentinelRef = useRef<HTMLDivElement>(null);
	useInfiniteScroll(sentinelRef, onLoadMore, { hasNextPage, isFetchingNextPage });

	return (
		<div
			className={[
				"flex w-[300px] shrink-0 flex-col border-r border-bd-1 bg-surf transition-transform duration-300",
				"max-sm:absolute max-sm:inset-0 max-sm:w-full max-sm:border-r-0",
				isMobileVisible ? "max-sm:-translate-x-full" : "max-sm:translate-x-0",
			].join(" ")}
		>
			<div className="shrink-0 border-b border-bd-1 px-4 pb-3 pt-4">
				<Typography tag="h2" className="mb-3 text-[13px] font-semibold text-t-1">
					{t("feedback.myThreads")}
				</Typography>
				<Button
					onClick={onNewThread}
					title={t("feedback.newThread")}
					className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-acc text-[13px] font-semibold text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)] transition-opacity hover:opacity-[0.88]"
				>
					<Plus className="size-3" />
					{t("feedback.newThread")}
				</Button>
			</div>

			<div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-0">
				{threads.length === 0 ? (
					<FeedbackEmpty t={t} onNewThread={onNewThread} />
				) : (
					<>
						{threads.map(thread => {
							const handleClick: NonNullable<
								ComponentProps<typeof FeedbackThreadItem>["onClick"]
							> = () => onSelect(thread);
							return (
								<FeedbackThreadItem
									key={thread.id}
									thread={thread}
									isActive={thread.id === activeId}
									t={t}
									onClick={handleClick}
								/>
							);
						})}
						{hasNextPage && (
							<div ref={sentinelRef} className="flex justify-center py-3">
								{isFetchingNextPage && (
									<div className="size-3 animate-spin rounded-full border-2 border-acc border-t-transparent" />
								)}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};
