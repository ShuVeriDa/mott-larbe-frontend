import type { UserProfile } from "@/entities/user";
import { hasAnyPermission } from "@/shared/lib/permissions";

export const getUserInitials = (user: UserProfile): string => {
	const parts = [user.name, user.surname].filter(Boolean) as string[];
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return user.username.slice(0, 2).toUpperCase();
};

export const getDisplayName = (user: UserProfile): string =>
	[user.name, user.surname].filter(Boolean).join(" ") || user.username;

export const canAccessAdmin = (user: UserProfile): boolean =>
	hasAnyPermission(user, [
		"CAN_MANAGE_USERS",
		"CAN_EDIT_TEXTS",
		"CAN_EDIT_DICTIONARY",
		"CAN_EDIT_MORPHOLOGY",
		"CAN_VIEW_ANALYTICS",
		"CAN_VIEW_LOGS",
		"CAN_MANAGE_BILLING",
		"CAN_MANAGE_FEATURE_FLAGS",
		"CAN_MANAGE_FEEDBACK",
		"CAN_MANAGE_LEGAL",
	]);
