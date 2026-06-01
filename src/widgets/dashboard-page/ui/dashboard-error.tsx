"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

interface DashboardErrorProps {
	onRetry: () => void;
}

export const DashboardError = ({ onRetry }: DashboardErrorProps) => {
	const { t } = useI18n();

	return (
		<div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
			<Typography tag="p" className="text-sm text-red">
				{t("dashboard.error")}
			</Typography>
			<Button variant="action" size="default" onClick={onRetry}>
				{t("dashboard.retry")}
			</Button>
		</div>
	);
};
