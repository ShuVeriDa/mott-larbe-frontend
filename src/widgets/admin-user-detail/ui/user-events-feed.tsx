"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type {
	FetchUserEventsQuery,
	UserEvent,
	UserEventType,
} from "@/entities/admin-user";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Select } from "@/shared/ui/select";
import { AlertCircle, AlignLeft, Circle, Lock, Plus } from "lucide-react";
import { ComponentProps, ReactNode } from "react";

const EVENT_ICON_CONFIG: Record<string, { bgClass: string; icon: ReactNode }> =
	{
		OPEN_TEXT: {
			bgClass: "bg-acc-bg text-acc-t",
			icon: <AlignLeft className="size-full" />,
		},
		ADD_TO_DICTIONARY: {
			bgClass: "bg-grn-bg text-grn-t",
			icon: <Plus className="size-full" />,
		},
		FAIL_LOOKUP: {
			bgClass: "bg-red-bg text-red-t",
			icon: <AlertCircle className="size-full" />,
		},
		REVIEW_SESSION: {
			bgClass: "bg-pur-bg text-pur-t",
			icon: <Lock className="size-full" />,
		},
	};

const DEFAULT_EVENT_CONFIG = {
	bgClass: "bg-surf-3 text-t-3",
	icon: <Circle className="size-full" />,
};

const getEventMeta = (event: UserEvent): string => {
	const m = event.meta;
	if (!m) return "";
	if (typeof m.title === "string") return m.title;
	if (typeof m.word === "string") return `«${m.word}»`;
	if (typeof m.normalized === "string")
		return `«${m.normalized}» — слово не найдено`;
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

	const handleChange: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		onTypeChange(e.currentTarget.value as UserEventType | "");
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		onPeriodChange(e.currentTarget.value as FetchUserEventsQuery["period"]);
	return (
		<>
			<div className="flex items-center gap-1.5 border-b border-bd-1 px-3.5 py-2.5">
				<Select
					value={filter.type ?? ""}
					onChange={handleChange}
					wrapperClassName="w-auto"
					className="h-[26px] bg-surf text-t-2 text-[11.5px] rounded-[6px]"
				>
					<option value="">{t("admin.userDetail.events.allTypes")}</option>
					{FILTERABLE_TYPES.map(type => (
						<option key={type} value={type}>
							{t(`admin.userDetail.events.eventType.${type}`)}
						</option>
					))}
				</Select>
				<Select
					value={filter.period ?? "all"}
					onChange={handleChange2}
					wrapperClassName="w-auto"
					className="h-[26px] bg-surf text-t-2 text-[11.5px] rounded-[6px]"
				>
					<option value="7d">{t("admin.userDetail.events.last7days")}</option>
					<option value="30d">{t("admin.userDetail.events.last30days")}</option>
					<option value="all">{t("admin.userDetail.events.allTime")}</option>
				</Select>
			</div>

			<div>
				{isLoading
					? Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="flex items-start gap-2.5 border-b border-bd-1 px-3.5 py-2"
							>
								<div className="mt-0.5 size-[26px] shrink-0 animate-pulse rounded-base bg-surf-3" />
								<div className="flex-1 space-y-1">
									<div className="h-3 w-28 animate-pulse rounded bg-surf-3" />
									<div className="h-2.5 w-48 animate-pulse rounded bg-surf-3" />
								</div>
								<div className="h-2.5 w-16 animate-pulse rounded bg-surf-3" />
							</div>
						))
					: events.map(event => {
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
										<Typography
											tag="span"
											className="size-[13px] [&>svg]:h-full [&>svg]:w-full"
										>
											{cfg.icon}
										</Typography>
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-[12px] font-semibold text-t-1">
											{t(`admin.userDetail.events.eventType.${event.type}`)}
										</div>
										{meta && (
											<div className="truncate text-[11px] text-t-3">
												{meta}
											</div>
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
					<Button
						onClick={onLoadMore}
						className="border-none bg-transparent text-[12px] text-acc-t transition-opacity hover:opacity-70"
					>
						{t("admin.userDetail.events.loadMore", {
							count: Math.min(25, total - shown),
						})}
					</Button>
				</div>
			)}
		</>
	);
};
