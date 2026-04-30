import type { PasswordStrength } from "@/features/reset-password";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface PasswordStrengthBarProps {
	score: PasswordStrength;
	visible: boolean;
}

const STRENGTH_LABEL_KEY: Record<PasswordStrength, string | null> = {
	0: null,
	1: "auth.resetPassword.step3.strength.weak",
	2: "auth.resetPassword.step3.strength.medium",
	3: "auth.resetPassword.step3.strength.good",
	4: "auth.resetPassword.step3.strength.strong",
};

const FILL_BY_SCORE: Record<PasswordStrength, string> = {
	0: "bg-surf-3",
	1: "bg-red",
	2: "bg-amb",
	3: "bg-acc",
	4: "bg-grn",
};

export const PasswordStrengthBar = ({
	score,
	visible,
}: PasswordStrengthBarProps) => {
	const { t } = useI18n();
	if (!visible) return null;

	const labelKey = STRENGTH_LABEL_KEY[score];

	return (
		<div className="mt-2">
			<div className="mb-1.5 flex gap-1">
				{[1, 2, 3, 4].map((index) => {
					const filled = index <= score;
					return (
						<div
							key={index}
							className={cn(
								"h-1 flex-1 rounded-[2px] transition-colors duration-200",
								filled ? FILL_BY_SCORE[score] : "bg-surf-3",
							)}
						/>
					);
				})}
			</div>
			{labelKey && (
				<Typography className="text-[11px] text-t-3">
					<Typography tag="strong" className="font-semibold text-t-2">
						{t(labelKey)}
					</Typography>
				</Typography>
			)}
		</div>
	);
};
