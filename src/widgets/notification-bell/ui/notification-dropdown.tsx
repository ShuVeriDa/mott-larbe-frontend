"use client";

import type { Notification } from "@/entities/notification";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { ReactNode } from "react";
import { NotificationList } from "./notification-list";

interface NotificationDropdownProps {
	trigger: ReactNode;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	notifications: Notification[];
	isLoading: boolean;
	onRead: (id: string) => void;
	onReadAll: () => void;
}

export const NotificationDropdown = ({
	trigger,
	isOpen,
	onOpenChange,
	notifications,
	isLoading,
	onRead,
	onReadAll,
}: NotificationDropdownProps) => (
	<DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
		<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
		<DropdownMenuContent align="end" sideOffset={6} className="w-80 p-0 ml-4">
			<NotificationList
				notifications={notifications}
				isLoading={isLoading}
				onRead={onRead}
				onReadAll={onReadAll}
			/>
		</DropdownMenuContent>
	</DropdownMenu>
);
