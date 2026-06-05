"use client";

import { useMarkAllNotificationsRead } from "@/features/mark-all-notifications-read";
import { useMarkNotificationRead } from "@/features/mark-notification-read";
import { useCurrentUser } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotificationBell } from "../model/use-notification-bell";
import { useNotificationSocket } from "../model/use-notification-socket";
import { useNotifications } from "../model/use-notifications";
import { NotificationDropdown } from "./notification-dropdown";

interface NotificationBellProps {
	isCompactMode?: boolean;
}

const MAX_BADGE_COUNT = 99;

export const NotificationBell = ({ isCompactMode }: NotificationBellProps) => {
	const { t } = useI18n();
	const { data: user } = useCurrentUser();
	const isAuthenticated = !!user;

	useNotificationSocket(isAuthenticated);

	const { notifications, unreadCount, isLoading } = useNotifications();
	const { isOpen, handleToggle, handleClose } = useNotificationBell();
	const { mutate: markRead } = useMarkNotificationRead();
	const { mutate: markAllRead } = useMarkAllNotificationsRead();

	const [mounted, setMounted] = useState(false);
	useEffect(() => { setMounted(true); }, []);

	const showBadge = mounted && !isLoading && unreadCount > 0;
	const badgeLabel = unreadCount > MAX_BADGE_COUNT ? "99+" : String(unreadCount);

	const handleRead = (id: string) => markRead(id);
	const handleReadAll = () => markAllRead();

	const trigger = (
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label={t("notifications.bell.label")}
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			className={cn("relative", isCompactMode && "mx-auto")}
		>
			<Bell className="size-4" />
			{showBadge && (
				<span
					className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-acc px-[3px] text-[9px] font-bold leading-none text-white"
					aria-hidden="true"
				>
					{badgeLabel}
				</span>
			)}
		</Button>
	);

	return (
		<NotificationDropdown
			trigger={trigger}
			isOpen={isOpen}
			onOpenChange={(open) => (open ? handleToggle() : handleClose())}
			notifications={notifications}
			isLoading={isLoading}
			onRead={handleRead}
			onReadAll={handleReadAll}
		/>
	);
};
