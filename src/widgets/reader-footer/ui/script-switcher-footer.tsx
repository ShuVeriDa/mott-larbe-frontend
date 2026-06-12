"use client";

import { scriptVersionsQueryOptions } from "@/entities/text-script-version";
import {
	SCRIPT_OPTIONS,
	useReaderScript,
	useReaderScriptAvailability,
} from "@/features/reader-script";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";

interface ScriptSwitcherFooterProps {
	textId: string;
}

export const ScriptSwitcherFooter = ({ textId }: ScriptSwitcherFooterProps) => {
	const { t } = useI18n();
	const { script, showDiacritics, setScript, setShowDiacritics } = useReaderScript();
	const { data: scriptVersions = [] } = useQuery(scriptVersionsQueryOptions(textId));
	const available = useReaderScriptAvailability(scriptVersions);

	const visibleOptions = SCRIPT_OPTIONS.filter((o) => available.includes(o.value));
	if (visibleOptions.length <= 1) return null;

	const handleToggleDiacritics = () => setShowDiacritics(!showDiacritics);

	return (
		<div className="flex items-center gap-1.5">
			<div
				className="flex gap-1"
				role="group"
				aria-label={t("reader.settings.script.switchScript")}
			>
				{visibleOptions.map((option) => {
					const active = script === option.value;
					const handleClick = () => setScript(option.value);
					return (
						<Button
							key={option.value}
							variant="bare"
							size={null}
							onClick={handleClick}
							aria-pressed={active}
							aria-label={t(option.fullKey)}
							className={cn(
								"h-[26px] rounded-[5px] border-[0.5px] border-bd-1 leading-none transition-colors duration-100",
								"px-2.5 text-[11px] font-medium",
								"sm:px-3 sm:text-[11.5px]",
								active
									? "border-acc/20 bg-acc-bg text-acc-t"
									: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
							)}
						>
							<span className="hidden sm:inline">{t(option.fullKey)}</span>
							<span className="inline sm:hidden" dir={option.value === "ARABIC" ? "rtl" : undefined}>{t(option.shortKey)}</span>
						</Button>
					);
				})}
			</div>

			{script === "ARABIC" && (
				<Button
					variant="bare"
					size={null}
					onClick={handleToggleDiacritics}
					aria-pressed={showDiacritics}
					aria-label={t("reader.settings.script.diacritics")}
					className={cn(
						"h-[26px] rounded-[5px] border-[0.5px] border-bd-1 px-2.5 leading-none transition-colors duration-100",
						"text-[11px] font-medium sm:px-3 sm:text-[11.5px]",
						showDiacritics
							? "border-acc/20 bg-acc-bg text-acc-t"
							: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
					)}
				>
					<span className="hidden sm:inline">
						{showDiacritics
							? t("reader.settings.script.diacriticsHide")
							: t("reader.settings.script.diacriticsShow")}
					</span>
					<span className="inline sm:hidden" dir="rtl">ً</span>
				</Button>
			)}
		</div>
	);
};
