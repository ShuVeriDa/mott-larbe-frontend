"use client";

import type { Notification } from "@/entities/notification";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Megaphone } from "lucide-react";
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

	const isAnnouncement = notification.type === "PLATFORM_ANNOUNCEMENT";
	const mainText =
		notification.title ?? t(`notifications.types.${notification.type}`);
	const ariaLabel = notification.body
		? `${mainText}: ${notification.body}`
		: mainText;

	const href = getNotificationHref(lang, notification);

	const handleClick = () => {
		onRead(notification.id);
		if (href) router.push(href);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<li
			role={href ? "button" : undefined}
			tabIndex={href ? 0 : undefined}
			aria-label={ariaLabel}
			className={cn(
				"flex items-start gap-2.5 px-4 py-2.5 transition-colors duration-150 ease-out",
				href && "cursor-pointer hover:bg-surf-2 focus-visible:outline-2 focus-visible:outline-acc focus-visible:-outline-offset-2",
				!notification.isRead && "bg-acc-bg/40",
				isAnnouncement && "border-l-2 border-acc",
			)}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			{isAnnouncement ? (
				<Megaphone
					className={cn(
						"mt-[3px] size-3.5 shrink-0 transition-colors duration-150",
						notification.isRead ? "text-t-3" : "text-acc",
					)}
					aria-hidden="true"
				/>
			) : (
				!notification.isRead && (
					<span
						className="mt-[5px] size-2 shrink-0 rounded-full bg-acc"
						aria-hidden="true"
					/>
				)
			)}
			<span
				className={cn(
					"flex min-w-0 flex-col gap-0.5",
					!notification.isRead && "font-medium text-t-1",
					notification.isRead && !isAnnouncement && "ml-[18px]",
				)}
			>
				<span className="text-[12.5px] leading-normal text-t-2">
					{mainText}
				</span>
				{notification.body && (
					<span className="line-clamp-2 text-[11.5px] leading-snug text-t-3">
						{notification.body}
					</span>
				)}
			</span>
		</li>
	);
};
