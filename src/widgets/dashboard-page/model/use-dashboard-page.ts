"use client";

import { useDashboard } from "@/entities/dashboard";
import { useSettings } from "@/entities/settings";
import { useCurrentUser } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";

export const useDashboardPage = () => {
	const { lang } = useI18n();

	const { data, isPending, isError, refetch } = useDashboard();
	const { data: user } = useCurrentUser();
	const { data: settings } = useSettings();

	const handleRetry = () => refetch();

	const showReviewReminder = settings?.preferences.showReviewReminder ?? true;
	const dailyWordsGoal = settings?.goals.dailyWords ?? null;

	return {
		lang,
		data,
		isPending,
		isError,
		user,
		showReviewReminder,
		dailyWordsGoal,
		handleRetry,
	};
};
