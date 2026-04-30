"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { scorePassword, type PasswordScore } from "@/shared/lib/password-strength";
import { Typography } from "@/shared/ui/typography";

interface PasswordStrengthMeterProps {
	password: string;
}

const BAR_COLORS: Record<PasswordScore, string> = {
	0: "",
	1: "bg-red",
	2: "bg-amb",
	3: "bg-acc",
	4: "bg-grn",
};

const SCORE_KEY: Record<PasswordScore, string | null> = {
	0: null,
	1: "auth.password.weak",
	2: "auth.password.weak",
	3: "auth.password.good",
	4: "auth.password.strong",
};

export const PasswordStrengthMeter = ({
	password,
}: PasswordStrengthMeterProps) => {
	const { t } = useI18n();
	const score = scorePassword(password);
	const labelKey = SCORE_KEY[score];

	if (!password) {
		return (
			<div className="mt-2">
				<Typography className="text-[11px] text-t-3">
					{t("auth.password.hint")}
				</Typography>
			</div>
		);
	}

	return (
		<div className="mt-2">
			<div className="mb-1.5 flex gap-1">
				{[1, 2, 3, 4].map((i) => (
					<Typography
						tag="span"
						key={i}
						className={cn(
							"h-1 flex-1 rounded-full bg-surf-3 transition-colors",
							i <= score && BAR_COLORS[score],
						)}
					/>
				))}
			</div>
			{labelKey ? (
				<Typography className="text-[11px] font-semibold text-t-2">
					{t(labelKey)}
				</Typography>
			) : null}
		</div>
	);
};
