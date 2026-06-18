"use client";

import type { Notification } from "@/entities/notification";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { BellOff } from "lucide-react";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
	notifications: Notification[];
	isLoading: boolean;
	onRead: (id: string) => void;
	onReadAll: () => void;
}

const SKELETON_COUNT = 4;

export const NotificationList = ({
	notifications,
	isLoading,
	onRead,
	onReadAll,
}: NotificationListProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-1 p-2">
				{Array.from({ length: SKELETON_COUNT }).map((_, i) => (
					<Skeleton key={i} className="h-10 w-full rounded-md" />
				))}
			</div>
		);
	}

	if (notifications.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 py-8 text-t-3">
				<BellOff className="size-7 opacity-50" />
				<p className="text-[12.5px]">{t("notifications.empty")}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-2">
				<span className="text-xs font-medium text-t-3">
					{t("notifications.title")}
				</span>
				<Button
					variant="ghost"
					size="default"
					className="h-auto px-2 py-1 text-[11px]"
					onClick={onReadAll}
				>
					{t("notifications.markAllRead")}
				</Button>
			</div>
			<ul role="list" className="flex flex-col overflow-y-auto max-h-[244px]">
				{notifications.map(notification => (
					<NotificationItem
						key={notification.id}
						notification={notification}
						onRead={onRead}
					/>
				))}
			</ul>
		</div>
	);
};
