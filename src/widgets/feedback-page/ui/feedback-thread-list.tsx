"use client";

import { useEffect, useRef } from "react";
import type { FeedbackThread } from "@/entities/feedback";
import { FeedbackThreadItem } from "./feedback-thread-item";
import { FeedbackEmpty } from "./feedback-empty";

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
	const onLoadMoreRef = useRef(onLoadMore);
	onLoadMoreRef.current = onLoadMore;

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) onLoadMoreRef.current();
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			className={[
				"flex w-[280px] shrink-0 flex-col border-r border-bd-1 bg-surf transition-transform duration-280",
				"max-sm:absolute max-sm:inset-0 max-sm:w-full max-sm:border-r-0",
				isMobileVisible ? "max-sm:-translate-x-full" : "max-sm:translate-x-0",
			].join(" ")}
		>
			<div className="shrink-0 border-b border-bd-1 px-4 pb-2.5 pt-3.5">
				<p className="mb-2.5 text-xs font-semibold text-t-1">
					{t("feedback.myThreads")}
				</p>
				<button
					type="button"
					onClick={onNewThread}
					className="flex h-[30px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-base bg-acc text-[12px] font-semibold text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)] transition-opacity hover:opacity-[0.88]"
				>
					<svg
						viewBox="0 0 14 14"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						className="size-3"
					>
						<path d="M7 2v10M2 7h10" />
					</svg>
					{t("feedback.newThread")}
				</button>
			</div>

			<div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-0">
				{threads.length === 0 ? (
					<FeedbackEmpty t={t} onNewThread={onNewThread} />
				) : (
					<>
						{threads.map((thread) => (
							<FeedbackThreadItem
								key={thread.id}
								thread={thread}
								isActive={thread.id === activeId}
								t={t}
								onClick={() => onSelect(thread)}
							/>
						))}
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
