"use client";

import type { ChangeEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { Select } from "@/shared/ui/select";
import type { District } from "@/entities/geo";

interface DistrictSelectorProps {
	districts: District[];
	selectedDistrictId: string | null;
	isLoading: boolean;
	isDisabled: boolean;
	onDistrictSelect: (id: string | null) => void;
	lang: string;
}

export const DistrictSelector = ({
	districts,
	selectedDistrictId,
	isLoading,
	isDisabled,
	onDistrictSelect,
	lang,
}: DistrictSelectorProps) => {
	const { t } = useI18n();

	const getLocalizedName = (item: District) =>
		(item.name as Record<string, string>)[lang] ?? item.name.ru;

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onDistrictSelect(e.currentTarget.value || null);
	};

	return (
		<Select
			variant="lg"
			value={selectedDistrictId ?? ""}
			onChange={handleChange}
			disabled={isDisabled || isLoading}
			aria-label={t("location.district")}
		>
			<option value="">{t("location.district_placeholder")}</option>
			{districts.map((district) => (
				<option key={district.id} value={district.id}>
					{getLocalizedName(district)}
				</option>
			))}
		</Select>
	);
};
