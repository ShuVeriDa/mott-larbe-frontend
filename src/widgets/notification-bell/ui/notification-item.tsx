"use client";

import type { Notification } from "@/entities/notification";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { getNotificationHref } from "../lib/get-notification-href";

interface NotificationItemProps {
	notification: Notification;
	onRead: (id: string) => void;
}

export const NotificationItem = ({
	notification,
	onRead,
}: NotificationItemProps) => {
	const { t, lang } = useI18n();
	const router = useRouter();

	const handleClick = () => {
		onRead(notification.id);
		router.push(getNotificationHref(lang, notification));
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<li
			role="button"
			tabIndex={0}
			className={cn(
				"flex cursor-pointer items-start gap-2.5 px-4 py-2.5 transition-colors hover:bg-surf-2 focus-visible:outline-2 focus-visible:outline-acc focus-visible:-outline-offset-2",
				!notification.isRead && "bg-acc-bg/40",
			)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{!notification.isRead && (
				<span
					className="mt-[5px] size-2 shrink-0 rounded-full bg-acc"
					aria-hidden="true"
				/>
			)}
			<span
				className={cn(
					"text-[12.5px] leading-normal text-t-2",
					!notification.isRead && "font-medium text-t-1",
					notification.isRead && "ml-[18px]",
				)}
			>
				{t(`notifications.types.${notification.type}`)}
			</span>
		</li>
	);
};
