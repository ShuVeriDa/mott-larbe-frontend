"use client";

import { useDashboard } from "@/entities/dashboard";
import { useCurrentUser } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";

export const useDashboardPage = () => {
	const { lang } = useI18n();

	const { data, isPending, isError, refetch } = useDashboard();
	const { data: user } = useCurrentUser();

	const handleRetry = () => refetch();

	return {
		lang,
		data,
		isPending,
		isError,
		user,
		handleRetry,
	};
};
