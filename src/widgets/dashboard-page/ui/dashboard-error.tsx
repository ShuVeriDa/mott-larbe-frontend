"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { type ComponentProps } from "react";

interface DashboardErrorProps {
	onRetry: NonNullable<ComponentProps<"button">["onClick"]>;
}

export const DashboardError = ({ onRetry }: DashboardErrorProps) => {
	const { t } = useI18n();

	return (
		<div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
			<Typography tag="p" className="text-sm text-red">
				{t("dashboard.error")}
			</Typography>
			<Button
				onClick={onRetry}
				className="rounded-md bg-acc px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
			>
				{t("dashboard.retry")}
			</Button>
		</div>
	);
};
