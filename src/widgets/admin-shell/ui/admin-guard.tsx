"use client";

import { useCurrentUser } from "@/entities/user";
import { hasAnyPermission } from "@/shared/lib/permissions";
import { useI18n } from "@/shared/lib/i18n";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

const ADMIN_PERMISSIONS = [
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
] as const;

export const AdminGuard = ({ children }: { children: ReactNode }) => {
	const { data: user, isLoading } = useCurrentUser();
	const { lang } = useI18n();
	const router = useRouter();

	const allowed = isLoading || hasAnyPermission(user, [...ADMIN_PERMISSIONS]);

	useEffect(() => {
		if (!isLoading && !allowed) {
			router.replace(`/${lang}/dashboard`);
		}
	}, [isLoading, allowed, lang, router]);

	if (isLoading) return null;
	if (!allowed) return null;

	return <>{children}</>;
};
