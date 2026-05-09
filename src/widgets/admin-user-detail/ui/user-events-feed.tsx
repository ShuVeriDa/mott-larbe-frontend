"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { UserEvent, UserEventType, FetchUserEventsQuery } from "@/entities/admin-user";
import { cn } from "@/shared/lib/cn";

const EVENT_ICON_CONFIG: Record<
	string,
	{ bgClass: string; icon: React.ReactNode }
> = {
	OPEN_TEXT: {
		bgClass: "bg-acc-bg text-acc-t",
		icon: (
			<svg viewBox="0 0 16 16" fill="none">
				<path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
			</svg>
		),
	},
	ADD_TO_DICTIONARY: {
		bgClass: "bg-grn-bg text-grn-t",
		icon: (
			<svg viewBox="0 0 16 16" fill="none">
				<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
		),
	},
	FAIL_LOOKUP: {
		bgClass: "bg-red-bg text-red-t",
		icon: (
			<svg viewBox="0 0 16 16" fill="none">
				<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
				<path d="M8 5v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
		),
	},
	REVIEW_SESSION: {
		bgClass: "bg-pur-bg text-pur-t",
		icon: (
			<svg viewBox="0 0 16 16" fill="none">
				<rect x="2" y="5" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
				<path d="M4 5V4a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
			</svg>
		),
	},
};

const DEFAULT_EVENT_CONFIG = {
	bgClass: "bg-surf-3 text-t-3",
	icon: (
		<svg viewBox="0 0 16 16" fill="none">
			<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
		</svg>
	),
};

const getEventMeta = (event: UserEvent): string => {
	const m = event.meta;
	if (!m) return "";
	if (typeof m.title === "string") return m.title;
	if (typeof m.word === "string") return `«${m.word}»`;
	if (typeof m.normalized === "string") return `«${m.normalized}» — слово не найдено`;
	return "";
};

const formatTime = (iso: string) =>
	new Date(iso).toLocaleString("ru-RU", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});

const FILTERABLE_TYPES: UserEventType[] = [
	"OPEN_TEXT",
	"ADD_TO_DICTIONARY",
	"FAIL_LOOKUP",
	"REVIEW_SESSION",
	"CLICK_WORD",
];

interface UserEventsFeedProps {
	events: UserEvent[];
	total: number;
	isLoading: boolean;
	filter: FetchUserEventsQuery;
	onTypeChange: (type: UserEventType | "") => void;
	onPeriodChange: (period: FetchUserEventsQuery["period"]) => void;
	onLoadMore: () => void;
}

export const UserEventsFeed = ({
	events,
	total,
	isLoading,
	filter,
	onTypeChange,
	onPeriodChange,
	onLoadMore,
}: UserEventsFeedProps) => {
	const { t } = useI18n();
	const shown = events.length;
	const hasMore = shown < total;

		const handleChange: NonNullable<React.ComponentProps<"select">["onChange"]> = (e) => onTypeChange(e.target.value as UserEventType | "");
	const handleChange2: NonNullable<React.ComponentProps<"select">["onChange"]> = (e) =>
						onPeriodChange(e.target.value as FetchUserEventsQuery["period"]);
return (
		<>
			<div className="flex items-center gap-1.5 border-b border-bd-1 px-3.5 py-2.5">
				<select
					value={filter.type ?? ""}
					onChange={handleChange}
					className="h-[26px] appearance-none rounded-[6px] border border-bd-2 bg-surf px-2 pr-5 text-[11.5px] text-t-2 outline-none focus:border-acc"
				>
					<option value="">{t("admin.userDetail.events.allTypes")}</option>
					{FILTERABLE_TYPES.map((type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</select>
				<select
					value={filter.period ?? "all"}
					onChange={handleChange2
					}
					className="h-[26px] appearance-none rounded-[6px] border border-bd-2 bg-surf px-2 pr-5 text-[11.5px] text-t-2 outline-none focus:border-acc"
				>
					<option value="7d">{t("admin.userDetail.events.last7days")}</option>
					<option value="30d">{t("admin.userDetail.events.last30days")}</option>
					<option value="all">{t("admin.userDetail.events.allTime")}</option>
				</select>
			</div>

			<div>
				{isLoading
					? Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-start gap-2.5 border-b border-bd-1 px-3.5 py-2">
								<div className="mt-0.5 size-[26px] shrink-0 animate-pulse rounded-base bg-surf-3" />
								<div className="flex-1 space-y-1">
									<div className="h-3 w-28 animate-pulse rounded bg-surf-3" />
									<div className="h-2.5 w-48 animate-pulse rounded bg-surf-3" />
								</div>
								<div className="h-2.5 w-16 animate-pulse rounded bg-surf-3" />
							</div>
						))
					: events.map((event) => {
							const cfg = EVENT_ICON_CONFIG[event.type] ?? DEFAULT_EVENT_CONFIG;
							const meta = getEventMeta(event);
							return (
								<div
									key={event.id}
									className="flex items-start gap-2.5 border-b border-bd-1 px-3.5 py-2 transition-colors last:border-b-0 hover:bg-surf-2"
								>
									<div
										className={cn(
											"mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-base",
											cfg.bgClass,
										)}
									>
										<span className="size-[13px] [&>svg]:h-full [&>svg]:w-full">
											{cfg.icon}
										</span>
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-[12px] font-semibold text-t-1">
											{event.type}
										</div>
										{meta && (
											<div className="truncate text-[11px] text-t-3">{meta}</div>
										)}
									</div>
									<div className="mt-0.5 shrink-0 text-[11px] text-t-4">
										{formatTime(event.createdAt)}
									</div>
								</div>
							);
						})}
			</div>

			{hasMore && !isLoading && (
				<div className="flex justify-center border-t border-bd-1 p-2.5">
					<button
						onClick={onLoadMore}
						className="border-none bg-transparent text-[12px] text-acc-t transition-opacity hover:opacity-70"
					>
						{t("admin.userDetail.events.loadMore", { count: Math.min(25, total - shown) })}
					</button>
				</div>
			)}
		</>
	);
};
