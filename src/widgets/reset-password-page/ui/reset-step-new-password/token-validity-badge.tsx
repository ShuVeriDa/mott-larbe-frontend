"use client";

import { ShieldCheck } from "lucide-react";
import { useTokenTimer } from "@/features/reset-password";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface TokenValidityBadgeProps {
	expiresAt: string;
	onExpire: () => void;
}

export const TokenValidityBadge = ({
	expiresAt,
	onExpire,
}: TokenValidityBadgeProps) => {
	const { t } = useI18n();
	const timeLeft = useTokenTimer(expiresAt, onExpire);

	if (!timeLeft) return null;

	const leftStr =
		timeLeft.hours > 0
			? t("auth.resetPassword.step3.badge.leftHM", {
					h: timeLeft.hours,
					m: timeLeft.minutes,
				})
			: t("auth.resetPassword.step3.badge.leftM", { m: timeLeft.minutes });

	return (
		<div className="mb-4 flex items-center gap-2 rounded-[8px] bg-grn-bg px-3 py-2 text-[12px] text-grn">
			<ShieldCheck size={13} strokeWidth={2} className="shrink-0" />
			<Typography tag="span">
				{t("auth.resetPassword.step3.badge.valid")}
			</Typography>
			<Typography tag="span" className="opacity-50">
				·
			</Typography>
			<Typography tag="span">{leftStr}</Typography>
		</div>
	);
};
