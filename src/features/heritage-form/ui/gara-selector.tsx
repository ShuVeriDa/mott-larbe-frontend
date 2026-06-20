"use client";

import type { ChangeEvent } from "react";

import { PlusIcon } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { useQuery } from "@tanstack/react-query";
import { garasByTaipQueryOptions } from "@/entities/heritage";
import type { Gara } from "@/entities/heritage";

interface GaraSelectorProps {
	selectedTaipId: string | null;
	selectedGaraId: string | null;
	isCustomMode: boolean;
	onGaraSelect: (id: string | null) => void;
	onToggleCustomMode: () => void;
	lang: string;
}

export const GaraSelector = ({
	selectedTaipId,
	selectedGaraId,
	isCustomMode,
	onGaraSelect,
	onToggleCustomMode,
	lang,
}: GaraSelectorProps) => {
	const { t } = useI18n();

	const { data: garasData } = useQuery({
		...garasByTaipQueryOptions(selectedTaipId ?? ""),
		enabled: !!selectedTaipId,
	});
	const garas = garasData?.items ?? [];

	const getLocalizedName = (item: Gara) =>
		(item.name as Record<string, string>)[lang] ?? item.name.ru;

	const handleGaraChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onGaraSelect(e.currentTarget.value || null);
	};

	if (!selectedTaipId) return null;

	return (
		<div className="flex flex-col gap-2">
			<Select
				variant="lg"
				value={selectedGaraId ?? ""}
				onChange={handleGaraChange}
				disabled={isCustomMode || garas.length === 0}
				aria-label={t("heritage.gara")}
			>
				<option value="">{t("heritage.gara_placeholder")}</option>
				{garas.map((gara) => (
					<option key={gara.id} value={gara.id}>
						{getLocalizedName(gara)}
					</option>
				))}
			</Select>

			<Button
				type="button"
				variant="ghost"
				size="default"
				onClick={onToggleCustomMode}
				className="h-auto min-h-[36px] w-fit px-3 py-1.5 text-[12px] text-t-2 hover:text-t-1"
				aria-pressed={isCustomMode}
			>
				<PlusIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
				{isCustomMode ? t("heritage.gara_cancel_custom") : t("heritage.gara_custom")}
			</Button>
		</div>
	);
};
