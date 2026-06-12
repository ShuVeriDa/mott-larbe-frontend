"use client";

import { useI18n } from "@/shared/lib/i18n/use-i18n";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import type { TextScriptVersionInfo } from "@/entities/text-script-version";
import { useReaderScript, useReaderScriptAvailability, type ReaderScript } from "../model";

interface ScriptOption {
	value: ReaderScript;
	labelKey: string;
	ariaKey: string;
}

const SCRIPT_OPTIONS: ScriptOption[] = [
	{ value: "CYRILLIC", labelKey: "reader.settings.script.cyrillicShort", ariaKey: "reader.settings.script.cyrillic" },
	{ value: "LATIN",    labelKey: "reader.settings.script.latinShort",    ariaKey: "reader.settings.script.latin" },
	{ value: "ARABIC",   labelKey: "reader.settings.script.arabicShort",   ariaKey: "reader.settings.script.arabic" },
];

interface ScriptSwitcherProps {
	versions: TextScriptVersionInfo[];
}

export const ScriptSwitcher = ({ versions }: ScriptSwitcherProps) => {
	const { t } = useI18n();
	const { script, setScript } = useReaderScript();
	const available = useReaderScriptAvailability(versions);

	const visibleOptions = SCRIPT_OPTIONS.filter((o) => available.includes(o.value));

	if (visibleOptions.length <= 1) return null;

	return (
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
						aria-label={t(option.ariaKey)}
						className={cn(
							"h-[26px] min-w-[32px] rounded-[5px] border-[0.5px] border-bd-1 px-[9px]",
							"text-[11px] font-medium leading-none transition-colors duration-100",
							active
								? "border-acc/20 bg-acc-bg text-acc-t"
								: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
						)}
					>
						{t(option.labelKey)}
					</Button>
				);
			})}
		</div>
	);
};
