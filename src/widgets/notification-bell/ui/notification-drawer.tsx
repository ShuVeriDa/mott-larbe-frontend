"use client";

import type { Notification } from "@/entities/notification";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
	DrawerTrigger,
} from "@/shared/ui/drawer";
import type { FocusEvent, ReactNode } from "react";
import { NotificationList } from "./notification-list";

interface NotificationDrawerProps {
	trigger: ReactNode;
	title: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	notifications: Notification[];
	isLoading: boolean;
	onRead: (id: string) => void;
	onReadAll: () => void;
}

const handleOpenAutoFocus = (e: FocusEvent) => {
	// Move focus into the drawer so aria-hidden on the trigger's ancestor
	// (BottomNav) doesn't trap focus outside the dialog.
	e.preventDefault();
	const content = e.currentTarget as HTMLElement;
	const firstFocusable = content.querySelector<HTMLElement>(
		'button, [href], input, [tabindex]:not([tabindex="-1"])',
	);
	firstFocusable?.focus();
};

export const NotificationDrawer = ({
	trigger,
	title,
	isOpen,
	onOpenChange,
	notifications,
	isLoading,
	onRead,
	onReadAll,
}: NotificationDrawerProps) => (
	<Drawer open={isOpen} onOpenChange={onOpenChange}>
		<DrawerTrigger asChild>{trigger}</DrawerTrigger>
		<DrawerContent
			className="max-h-[80vh]"
			aria-describedby={undefined}
			onOpenAutoFocus={handleOpenAutoFocus}
		>
			<DrawerTitle className="sr-only">{title}</DrawerTitle>
			<NotificationList
				notifications={notifications}
				isLoading={isLoading}
				onRead={onRead}
				onReadAll={onReadAll}
			/>
		</DrawerContent>
	</Drawer>
);
