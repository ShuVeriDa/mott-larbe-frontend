"use client";

import type { TokenizationDistribution, TokenizationQueue, TokenizationSettings, UpdateTokenizationSettingsDto } from "@/entities/token";
import { TokenizationDistributionCard } from "./tokenization-distribution-card";
import { TokenizationSettingsCard } from "./tokenization-settings-card";
import { TokenizationQueueCard } from "./tokenization-queue-card";

interface TokenizationSidePanelProps {
	distribution: TokenizationDistribution | undefined;
	settings: TokenizationSettings | undefined;
	queue: TokenizationQueue | undefined;
	onToggleSetting: (key: keyof UpdateTokenizationSettingsDto) => void;
	onRun: () => void;
}

export const TokenizationSidePanel = ({
	distribution,
	settings,
	queue,
	onToggleSetting,
	onRun,
}: TokenizationSidePanelProps) => (
	<div className="flex flex-col gap-3">
		<TokenizationDistributionCard distribution={distribution} />
		<TokenizationSettingsCard settings={settings} onToggle={onToggleSetting} />
		<TokenizationQueueCard queue={queue} onRun={onRun} />
	</div>
);
