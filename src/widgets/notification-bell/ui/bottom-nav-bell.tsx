"use client";

import { useCurrentUser } from "@/entities/user";
import { useMarkAllNotificationsRead } from "@/features/mark-all-notifications-read";
import { useMarkNotificationRead } from "@/features/mark-notification-read";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotificationBell } from "../model/use-notification-bell";
import { useNotificationSocket } from "../model/use-notification-socket";
import { useNotifications } from "../model/use-notifications";
import { NotificationDrawer } from "./notification-drawer";

const MAX_BADGE_COUNT = 99;

export const BottomNavBell = () => {
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

	const handleRead = (id: string) => markRead(id);
	const handleReadAll = () => markAllRead();

	const showBadge = mounted && !isLoading && unreadCount > 0;
	const badgeLabel = unreadCount > MAX_BADGE_COUNT ? "99+" : String(unreadCount);

	const trigger = (
		<button
			type="button"
			aria-label={t("notifications.bell.label")}
			aria-expanded={isOpen}
			aria-haspopup="dialog"
			className={cn(
				"flex flex-1 flex-col items-center justify-center gap-[3px] text-[10px] transition-colors focus-visible:outline-none",
				isOpen ? "text-acc" : "text-t-3",
			)}
		>
			<span className="relative">
				<Bell className="size-5" />
				{showBadge && (
					<span
						className="absolute -right-1.5 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-acc px-[3px] text-[8px] font-bold leading-none text-white"
						aria-hidden="true"
					>
						{badgeLabel}
					</span>
				)}
			</span>
			{t("notifications.bell.label")}
		</button>
	);

	return (
		<NotificationDrawer
			trigger={trigger}
			title={t("notifications.bell.label")}
			isOpen={isOpen}
			onOpenChange={(open) => (open ? handleToggle() : handleClose())}
			notifications={notifications}
			isLoading={isLoading}
			onRead={handleRead}
			onReadAll={handleReadAll}
		/>
	);
};
