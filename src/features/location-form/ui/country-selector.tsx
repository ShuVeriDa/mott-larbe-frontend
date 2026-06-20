"use client";

import type { ChangeEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { Select } from "@/shared/ui/select";
import type { Country } from "@/entities/geo";

interface CountrySelectorProps {
	countries: Country[];
	selectedCountryId: string | null;
	isLoading: boolean;
	onCountrySelect: (id: string | null) => void;
	lang: string;
}

export const CountrySelector = ({
	countries,
	selectedCountryId,
	isLoading,
	onCountrySelect,
	lang,
}: CountrySelectorProps) => {
	const { t } = useI18n();

	const getLocalizedName = (item: Country) =>
		(item.name as Record<string, string>)[lang] ?? item.name.ru;

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onCountrySelect(e.currentTarget.value || null);
	};

	return (
		<Select
			variant="lg"
			value={selectedCountryId ?? ""}
			onChange={handleChange}
			disabled={isLoading}
			aria-label={t("location.country")}
		>
			<option value="">{t("location.country_placeholder")}</option>
			{countries.map((country) => (
				<option key={country.id} value={country.id}>
					{getLocalizedName(country)}
				</option>
			))}
		</Select>
	);
};
