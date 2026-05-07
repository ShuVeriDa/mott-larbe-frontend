import type { PermissionCode, UserProfile } from "@/entities/user";

export const hasPermission = (
	user: UserProfile | null | undefined,
	permission: PermissionCode,
): boolean => user?.permissions.includes(permission) ?? false;

export const hasAnyPermission = (
	user: UserProfile | null | undefined,
	permissions: PermissionCode[],
): boolean => permissions.some((p) => user?.permissions.includes(p)) ?? false;
