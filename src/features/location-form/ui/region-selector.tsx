"use client";

import type { ChangeEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { getLocalizedName } from "@/shared/lib/localized-name";
import { Select } from "@/shared/ui/select";
import type { Region } from "@/entities/geo";

interface RegionSelectorProps {
	regions: Region[];
	selectedRegionId: string | null;
	isLoading: boolean;
	isDisabled: boolean;
	onRegionSelect: (id: string | null) => void;
	lang: string;
}

export const RegionSelector = ({
	regions,
	selectedRegionId,
	isLoading,
	isDisabled,
	onRegionSelect,
	lang,
}: RegionSelectorProps) => {
	const { t } = useI18n();

	const getRegionName = (item: Region) => getLocalizedName(item.name, lang);

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onRegionSelect(e.currentTarget.value || null);
	};

	return (
		<Select
			variant="lg"
			value={selectedRegionId ?? ""}
			onChange={handleChange}
			disabled={isDisabled || isLoading}
			aria-label={t("location.region")}
		>
			<option value="">{t("location.region_placeholder")}</option>
			{regions.map((region) => (
				<option key={region.id} value={region.id}>
					{getRegionName(region)}
				</option>
			))}
		</Select>
	);
};
