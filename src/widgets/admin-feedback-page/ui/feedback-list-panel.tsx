"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import type { AdminFeedbackThread, AdminFeedbackTab, FeedbackType } from "@/entities/feedback";
import { FeedbackListItem } from "./feedback-list-item";

type Translator = (key: string) => string;

const TAB_KEYS: { key: AdminFeedbackTab; label: string }[] = [
	{ key: "OPEN", label: "admin.feedback.tabs.open" },
	{ key: "ALL", label: "admin.feedback.tabs.all" },
	{ key: "CLOSED", label: "admin.feedback.tabs.closed" },
];

const TYPE_FILTERS: { key: FeedbackType | "all"; label: string }[] = [
	{ key: "all", label: "admin.feedback.filters.allTypes" },
	{ key: "QUESTION", label: "admin.feedback.filters.QUESTION" },
	{ key: "BUG", label: "admin.feedback.filters.BUG" },
	{ key: "IDEA", label: "admin.feedback.filters.IDEA" },
	{ key: "COMPLAINT", label: "admin.feedback.filters.COMPLAINT" },
];

interface FeedbackListPanelProps {
	threads: AdminFeedbackThread[];
	activeId: string | null;
	tab: AdminFeedbackTab;
	typeFilter: FeedbackType | "all";
	search: string;
	openCount: number;
	isLoading: boolean;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
	isMobileVisible: boolean;
	t: Translator;
	onTabChange: (tab: AdminFeedbackTab) => void;
	onTypeChange: (type: FeedbackType | "all") => void;
	onSearchChange: (value: string) => void;
	onSelect: (thread: AdminFeedbackThread) => void;
	onLoadMore: () => void;
}

export const FeedbackListPanel = ({
	threads,
	activeId,
	tab,
	typeFilter,
	search,
	openCount,
	isLoading,
	isFetchingNextPage,
	hasNextPage,
	isMobileVisible,
	t,
	onTabChange,
	onTypeChange,
	onSearchChange,
	onSelect,
	onLoadMore,
}: FeedbackListPanelProps) => {
	const sentinelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					onLoadMore();
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, onLoadMore]);

		const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.target.value);
return (
		<div
			className={cn(
				"flex w-[300px] shrink-0 flex-col border-r border-bd-1 bg-surf transition-colors",
				"max-md:w-[260px]",
				isMobileVisible ? "max-sm:hidden" : "max-sm:flex max-sm:w-full",
			)}
		>
			{/* Header: tabs + search */}
			<div className="shrink-0 border-b border-bd-1 px-3.5 pb-2.5 pt-3">
				{/* Tabs */}
				<div className="mb-2.5 flex gap-0.5 rounded-lg border border-bd-1 bg-surf-2 p-0.5">
					{TAB_KEYS.map(({ key, label }) => {
					  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onTabChange(key);
					  return (
						<button
							key={key}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex flex-1 items-center justify-center gap-1 rounded-md py-[5px] text-[11.5px] font-medium transition-all",
								tab === key
									? "bg-surf font-semibold text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07)]"
									: "text-t-2 hover:text-t-1",
							)}
						>
							{t(label)}
							{key === "OPEN" && openCount > 0 && (
								<span
									className={cn(
										"rounded-[3px] px-1 py-px text-[9.5px] font-bold",
										tab === "OPEN"
											? "bg-acc-bg text-acc-t"
											: "bg-red-bg text-red-t",
									)}
								>
									{openCount}
								</span>
							)}
						</button>
					);
					})}
				</div>

				{/* Search */}
				<div className="relative">
					<svg
						viewBox="0 0 16 16"
						fill="none"
						className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3"
					>
						<circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" />
						<path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					</svg>
					<input
						value={search}
						onChange={handleChange}
						placeholder={t("admin.feedback.searchPlaceholder")}
						className="h-[30px] w-full rounded-base border border-bd-1 bg-surf-2 pl-[30px] pr-2.5 text-[12px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc"
					/>
				</div>
			</div>

			{/* Type filters */}
			<div className="scrollbar-none flex shrink-0 gap-1.5 overflow-x-auto border-b border-bd-1 px-3.5 py-2">
				{TYPE_FILTERS.map(({ key, label }) => {
				  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onTypeChange(key);
				  return (
					<button
						key={key}
						type="button"
						onClick={handleClick}
						className={cn(
							"h-6 shrink-0 rounded-[5px] border px-2 text-[11px] font-medium transition-all",
							typeFilter === key
								? "border-acc bg-acc-bg font-semibold text-acc-t"
								: "border-bd-2 text-t-2 hover:bg-surf-2 hover:text-t-1",
						)}
					>
						{t(label)}
					</button>
				);
				})}
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-0">
				{isLoading ? (
					<ListSkeleton />
				) : threads.length === 0 ? (
					<div className="px-4 py-6 text-center text-[12px] text-t-3">
						{t("admin.feedback.noTickets")}
					</div>
				) : (
					<>
						{threads.map((thread) => {
						  const handleClick: NonNullable<React.ComponentProps<typeof FeedbackListItem>["onClick"]> = () => onSelect(thread);
						  return (
							<FeedbackListItem
								key={thread.id}
								thread={thread}
								isActive={thread.id === activeId}
								t={t}
								onClick={handleClick}
							/>
						);
						})}
						{/* Infinite scroll sentinel */}
						<div ref={sentinelRef} className="h-px" />
						{isFetchingNextPage && (
							<div className="flex justify-center py-3">
								<div className="size-4 animate-spin rounded-full border-2 border-bd-2 border-t-acc" />
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

const ListSkeleton = () => (
	<>
		{Array.from({ length: 5 }).map((_, i) => (
			<div key={i} className="border-b border-bd-1 px-3.5 py-[11px]">
				<div className="mb-[5px] flex items-center gap-1.5">
					<div className="size-[22px] animate-pulse rounded-full bg-surf-3" />
					<div className="h-3 flex-1 animate-pulse rounded bg-surf-3" />
					<div className="h-2.5 w-8 animate-pulse rounded bg-surf-3" />
				</div>
				<div className="mb-1 h-3 w-3/4 animate-pulse rounded bg-surf-3" />
				<div className="mb-1.5 h-2.5 animate-pulse rounded bg-surf-3" />
				<div className="h-4 w-16 animate-pulse rounded bg-surf-3" />
			</div>
		))}
	</>
);
