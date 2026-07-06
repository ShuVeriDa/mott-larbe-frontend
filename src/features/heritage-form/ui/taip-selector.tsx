"use client";

import type { ChangeEvent } from "react";
import { PlusIcon, ListIcon } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { getLocalizedName } from "@/shared/lib/localized-name";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import type { Taip } from "@/entities/heritage";

interface TaipSelectorProps {
	taips: Taip[];
	selectedTaipId: string | null;
	showAllTaips: boolean;
	isCustomMode: boolean;
	hasTukhum: boolean | null;
	onTaipSelect: (id: string | null) => void;
	onShowAllTaipsToggle: () => void;
	onToggleCustomMode: () => void;
	lang: string;
}

export const TaipSelector = ({
	taips,
	selectedTaipId,
	showAllTaips,
	isCustomMode,
	hasTukhum,
	onTaipSelect,
	onShowAllTaipsToggle,
	onToggleCustomMode,
	lang,
}: TaipSelectorProps) => {
	const { t } = useI18n();

	const getTaipName = (item: Taip) => getLocalizedName(item.name, lang);

	const handleTaipChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onTaipSelect(e.currentTarget.value || null);
	};

	return (
		<div className="flex flex-col gap-2">
			<Select
				variant="lg"
				value={selectedTaipId ?? ""}
				onChange={handleTaipChange}
				disabled={isCustomMode}
				aria-label={t("heritage.taip")}
			>
				<option value="">{t("heritage.taip_placeholder")}</option>
				{taips.map((taip) => (
					<option key={taip.id} value={taip.id}>
						{getTaipName(taip)}
					</option>
				))}
			</Select>

			<div className="flex flex-wrap gap-2">
				{hasTukhum !== false && (
					<Button
						type="button"
						variant="ghost"
						size="default"
						onClick={onShowAllTaipsToggle}
						className="h-auto min-h-[36px] px-3 py-1.5 text-[12px] text-t-2 hover:text-t-1"
						aria-pressed={showAllTaips}
					>
						<ListIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
						{showAllTaips ? t("heritage.taip_filter_by_tukhum") : t("heritage.taip_other")}
					</Button>
				)}
				<Button
					type="button"
					variant="ghost"
					size="default"
					onClick={onToggleCustomMode}
					className="h-auto min-h-[36px] px-3 py-1.5 text-[12px] text-t-2 hover:text-t-1"
					aria-pressed={isCustomMode}
				>
					<PlusIcon className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
					{isCustomMode ? t("heritage.taip_cancel_custom") : t("heritage.taip_custom")}
				</Button>
			</div>
		</div>
	);
};
