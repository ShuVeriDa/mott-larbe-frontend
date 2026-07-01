"use client";

import { useI18n } from "@/shared/lib/i18n/use-i18n";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/ui/tooltip";
import { useReaderScript } from "../model";

export const OrthographyToggle = () => {
	const { t } = useI18n();
	const { script, orthography, setOrthography } = useReaderScript();

	if (script !== "CYRILLIC") return null;

	const isOld = orthography === "OLD";

	const handleToggle = () => setOrthography(isOld ? "NEW" : "OLD");

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="bare"
						size={null}
						onClick={handleToggle}
						aria-pressed={isOld}
						aria-label={t("reader.settings.script.orthographyToggle")}
						className={cn(
							"h-[26px] rounded-[5px] border-[0.5px] border-bd-1 leading-none transition-colors duration-100 ease-out",
							"px-2.5 text-[11px] font-medium",
							"sm:px-3 sm:text-[11.5px]",
							isOld
								? "border-acc/20 bg-acc-bg text-acc-t"
								: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
						)}
					>
						<span className="hidden sm:inline">
							{isOld
								? t("reader.settings.script.orthographyOld")
								: t("reader.settings.script.orthographyNew")}
						</span>
						<span className="inline sm:hidden">
							{isOld
								? t("reader.settings.script.orthographyOldShort")
								: t("reader.settings.script.orthographyNewShort")}
						</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="top">
					{t("reader.settings.script.orthographyHint")}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
