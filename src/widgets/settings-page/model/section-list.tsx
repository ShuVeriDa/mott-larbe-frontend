import type { ReactNode } from 'react';
import {
	AppearanceIcon,
	DataIcon,
	LearningIcon,
	NotificationsIcon,
	ReaderIcon,
	SessionsIcon,
	ShortcutsIcon,
} from "../ui/settings-icons";

export type SettingsSectionId =
	| "appearance"
	| "learning"
	| "reader"
	| "notifications"
	| "shortcuts"
	| "sessions"
	| "data";

export interface SectionMeta {
	id: SettingsSectionId;
	labelKey: string;
	icon: ReactNode;
	dividerBefore?: boolean;
}

export const SECTIONS: SectionMeta[] = [
	{
		id: "appearance",
		labelKey: "settings.tabs.appearance",
		icon: <AppearanceIcon />,
	},
	{ id: "learning", labelKey: "settings.tabs.learning", icon: <LearningIcon /> },
	{ id: "reader", labelKey: "settings.tabs.reader", icon: <ReaderIcon /> },
	{
		id: "notifications",
		labelKey: "settings.tabs.notifications",
		icon: <NotificationsIcon />,
	},
	{
		id: "shortcuts",
		labelKey: "settings.tabs.shortcuts",
		icon: <ShortcutsIcon />,
	},
	{
		id: "sessions",
		labelKey: "settings.tabs.sessions",
		icon: <SessionsIcon />,
		dividerBefore: true,
	},
	{ id: "data", labelKey: "settings.tabs.data", icon: <DataIcon /> },
];
