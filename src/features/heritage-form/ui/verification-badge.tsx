"use client";

import { CheckCircle } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { useI18n } from "@/shared/lib/i18n";
import type { VerificationStatus } from "@/entities/heritage";

interface VerificationBadgeProps {
	status: VerificationStatus | null;
	rejectionReason?: string | null;
}

export const VerificationBadge = ({ status, rejectionReason }: VerificationBadgeProps) => {
	const { t } = useI18n();

	if (!status) return null;

	if (status === "VERIFIED") {
		return (
			<CheckCircle
				className="inline-block h-3.5 w-3.5 text-grn-t shrink-0"
				aria-label={t("heritage.verified")}
			/>
		);
	}

	if (status === "PENDING") {
		return (
			<Badge variant="amb" className="shrink-0">
				{t("heritage.pending_verification")}
			</Badge>
		);
	}

	// REJECTED
	if (rejectionReason) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Badge variant="red" className="shrink-0 cursor-help">
							{t("heritage.rejected")}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>{rejectionReason}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<Badge variant="red" className="shrink-0">
			{t("heritage.rejected")}
		</Badge>
	);
};
