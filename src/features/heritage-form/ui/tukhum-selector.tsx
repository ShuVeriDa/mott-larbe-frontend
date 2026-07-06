"use client";

import type { ChangeEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { getLocalizedName } from "@/shared/lib/localized-name";
import { Select } from "@/shared/ui/select";
import type { Tukhum } from "@/entities/heritage";

interface TukhumSelectorProps {
	tukhumy: Tukhum[];
	selectedTukhumId: string | null;
	hasTukhum: boolean | null;
	onTukhumSelect: (id: string | null) => void;
	onHasTukhumChange: (value: boolean) => void;
	lang: string;
}

export const TukhumSelector = ({
	tukhumy,
	selectedTukhumId,
	hasTukhum,
	onTukhumSelect,
	onHasTukhumChange,
	lang,
}: TukhumSelectorProps) => {
	const { t } = useI18n();

	const getTukhumName = (item: Tukhum) => getLocalizedName(item.name, lang);

	const handleTukhumChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const val = e.currentTarget.value;
		onTukhumSelect(val || null);
	};

	const handleNoTukhumChange = (e: ChangeEvent<HTMLInputElement>) => {
		onHasTukhumChange(!e.currentTarget.checked);
	};

	return (
		<div className="flex flex-col gap-2">
			<Select
				variant="lg"
				value={selectedTukhumId ?? ""}
				onChange={handleTukhumChange}
				disabled={hasTukhum === false}
				aria-label={t("heritage.tukhum")}
			>
				<option value="">{t("heritage.tukhum_placeholder")}</option>
				{tukhumy.map((item) => (
					<option key={item.id} value={item.id}>
						{getTukhumName(item)}
					</option>
				))}
			</Select>

			<label className="flex items-center gap-2 cursor-pointer select-none min-h-[44px] px-1">
				<input
					type="checkbox"
					checked={hasTukhum === false}
					onChange={handleNoTukhumChange}
					className="h-4 w-4 rounded border-bd-2 accent-acc cursor-pointer"
					aria-label={t("heritage.no_tukhum")}
				/>
				<span className="text-[12px] text-t-2">{t("heritage.no_tukhum")}</span>
			</label>
		</div>
	);
};
