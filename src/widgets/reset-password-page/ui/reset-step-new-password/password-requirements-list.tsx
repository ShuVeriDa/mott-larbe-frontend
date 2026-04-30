import { Check } from "lucide-react";
import type { PasswordRequirements } from "@/features/reset-password";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface PasswordRequirementsListProps {
	requirements: PasswordRequirements;
}

const ITEMS: ReadonlyArray<{
	key: keyof PasswordRequirements;
	labelKey: string;
}> = [
	{ key: "len", labelKey: "auth.resetPassword.step3.reqLen" },
	{ key: "num", labelKey: "auth.resetPassword.step3.reqNum" },
	{ key: "case", labelKey: "auth.resetPassword.step3.reqCase" },
];

export const PasswordRequirementsList = ({
	requirements,
}: PasswordRequirementsListProps) => {
	const { t } = useI18n();

	return (
		<ul className="mt-2.5 flex flex-col gap-1 text-[11.5px] text-t-3">
			{ITEMS.map(({ key, labelKey }) => {
				const met = requirements[key];
				return (
					<Typography
						tag="li"
						key={key}
						className={cn(
							"inline-flex items-center gap-1.5 transition-colors",
							met && "text-grn-t",
						)}
					>
						<Typography
							tag="span"
							className={cn(
								"inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full transition-colors",
								met ? "bg-grn text-white" : "bg-surf-3 text-transparent",
							)}
						>
							<Check size={8} strokeWidth={3} />
						</Typography>
						<Typography tag="span">{t(labelKey)}</Typography>
					</Typography>
				);
			})}
		</ul>
	);
};
