"use client";

import { useOptimistic, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { PrivacyField, UserPrivacySettings } from "../api/types";

interface PrivacyToggleProps {
	field: PrivacyField;
	settings: UserPrivacySettings;
	onToggle: (field: PrivacyField, value: boolean) => Promise<unknown>;
	disabled?: boolean;
}

export const PrivacyToggle = ({
	field,
	settings,
	onToggle,
	disabled = false,
}: PrivacyToggleProps) => {
	const { t } = useI18n();
	const [isPending, startTransition] = useTransition();

	const [optimisticValue, setOptimisticValue] = useOptimistic(
		settings[field],
		(_current, next: boolean) => next,
	);

	const handleClick = () => {
		const next = !optimisticValue;
		startTransition(async () => {
			setOptimisticValue(next);
			await onToggle(field, next);
		});
	};

	const isPublic = optimisticValue;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={handleClick}
						disabled={disabled || isPending}
						aria-label={
							isPublic
								? t("privacy.toggle.makePrivate")
								: t("privacy.toggle.makePublic")
						}
						aria-pressed={isPublic}
						className={cn(
							"flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md",
							"transition-colors duration-150 ease-out",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
							"disabled:pointer-events-none disabled:opacity-40",
							isPublic
								? "text-muted-foreground hover:text-foreground"
								: "text-muted-foreground/50 hover:text-muted-foreground",
						)}
					>
						{isPublic ? (
							<Eye className="h-4 w-4" aria-hidden />
						) : (
							<EyeOff className="h-4 w-4" aria-hidden />
						)}
					</button>
				</TooltipTrigger>
				<TooltipContent side="top">
					{isPublic ? t("privacy.toggle.public") : t("privacy.toggle.private")}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
