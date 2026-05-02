"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { TokenizationSettings, UpdateTokenizationSettingsDto } from "@/entities/token";

interface TokenizationSettingsCardProps {
	settings: TokenizationSettings | undefined;
	onToggle: (key: keyof UpdateTokenizationSettingsDto) => void;
}

const Toggle = ({
	on,
	onChange,
}: {
	on: boolean;
	onChange: () => void;
}) => (
	<button
		onClick={onChange}
		className={cn(
			"relative mt-px h-[17px] w-[30px] shrink-0 rounded-full border-none transition-colors",
			on ? "bg-acc" : "bg-surf-3",
		)}
	>
		<span
			className={cn(
				"absolute top-[2px] size-[13px] rounded-full transition-all",
				on ? "left-[15px] bg-white" : "left-[2px] bg-t-3",
			)}
		/>
	</button>
);

const SETTINGS: {
	key: keyof UpdateTokenizationSettingsDto;
	labelKey: string;
	subKey: string;
}[] = [
	{
		key: "autoTokenize",
		labelKey: "admin.tokenization.sidePanel.settingsOptions.autoTokenize",
		subKey: "admin.tokenization.sidePanel.settingsOptions.autoTokenizeSub",
	},
	{
		key: "normalization",
		labelKey: "admin.tokenization.sidePanel.settingsOptions.normalization",
		subKey: "admin.tokenization.sidePanel.settingsOptions.normalizationSub",
	},
	{
		key: "morphAnalysis",
		labelKey: "admin.tokenization.sidePanel.settingsOptions.morphAnalysis",
		subKey: "admin.tokenization.sidePanel.settingsOptions.morphAnalysisSub",
	},
	{
		key: "onlineDictionaries",
		labelKey: "admin.tokenization.sidePanel.settingsOptions.onlineDictionaries",
		subKey: "admin.tokenization.sidePanel.settingsOptions.onlineDictionariesSub",
	},
];

export const TokenizationSettingsCard = ({
	settings,
	onToggle,
}: TokenizationSettingsCardProps) => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex items-center border-b border-bd-1 px-3.5 py-[11px]">
				<span className="text-[11px] font-semibold uppercase tracking-[0.4px] text-t-2">
					{t("admin.tokenization.sidePanel.settings")}
				</span>
			</div>

			<div className="flex flex-col gap-2.5 px-3.5 py-3">
				{SETTINGS.map(({ key, labelKey, subKey }) => (
					<div key={key} className="flex items-start justify-between gap-2">
						<div>
							<div className="text-[12px] font-medium text-t-1">{t(labelKey)}</div>
							<div className="text-[10.5px] text-t-3">{t(subKey)}</div>
						</div>
						{settings ? (
							<Toggle on={settings[key] as boolean} onChange={() => onToggle(key)} />
						) : (
							<div className="mt-0.5 h-4 w-[30px] animate-pulse rounded-full bg-surf-3" />
						)}
					</div>
				))}
			</div>
		</div>
	);
};
