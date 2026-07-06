"use client";

import type { ChangeEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { getLocalizedName } from "@/shared/lib/localized-name";
import { Select } from "@/shared/ui/select";
import type { Settlement, SettlementType } from "@/entities/geo";

const SETTLEMENT_TYPE_KEYS: Record<SettlementType, string> = {
	city: "location.type_city",
	village: "location.type_village",
	town: "location.type_town",
};

interface SettlementSelectorProps {
	settlements: Settlement[];
	selectedSettlementId: string | null;
	isLoading: boolean;
	isDisabled: boolean;
	onSettlementSelect: (id: string | null) => void;
	lang: string;
}

export const SettlementSelector = ({
	settlements,
	selectedSettlementId,
	isLoading,
	isDisabled,
	onSettlementSelect,
	lang,
}: SettlementSelectorProps) => {
	const { t } = useI18n();

	const getSettlementLabel = (item: Settlement) => {
		const typeKey = SETTLEMENT_TYPE_KEYS[item.type];
		const typeName = typeKey ? t(typeKey) : item.type;
		return `${getLocalizedName(item.name, lang)} (${typeName})`;
	};

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onSettlementSelect(e.currentTarget.value || null);
	};

	return (
		<Select
			variant="lg"
			value={selectedSettlementId ?? ""}
			onChange={handleChange}
			disabled={isDisabled || isLoading}
			aria-label={t("location.settlement")}
		>
			<option value="">{t("location.settlement_placeholder")}</option>
			{settlements.map((settlement) => (
				<option key={settlement.id} value={settlement.id}>
					{getSettlementLabel(settlement)}
				</option>
			))}
		</Select>
	);
};
