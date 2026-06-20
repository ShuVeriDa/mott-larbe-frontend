"use client";

import { useActionState, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	countriesQueryOptions,
	regionsByCountryQueryOptions,
	districtsByRegionQueryOptions,
	settlementsByDistrictQueryOptions,
} from "@/entities/geo";
import {
	heritageApi,
	heritageKeys,
	myHeritageQueryOptions,
} from "@/entities/heritage";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import type { LocationFormState, LocationFormValues } from "./types";

export const useLocationForm = () => {
	const { t } = useI18n();
	const { success: toastSuccess } = useToast();
	const { toastApiError } = useApiErrorToast();
	const queryClient = useQueryClient();

	const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
	const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
	const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
	const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
	const [ancestralVillage, setAncestralVillage] = useState<string>("");

	const { data: currentHeritage } = useQuery(myHeritageQueryOptions());

	const { data: countriesData, isPending: isCountriesPending } = useQuery(
		countriesQueryOptions(),
	);
	const countries = countriesData?.items ?? [];

	const { data: regionsData, isPending: isRegionsPending } = useQuery({
		...regionsByCountryQueryOptions(selectedCountryId ?? ""),
		enabled: !!selectedCountryId,
	});
	const regions = regionsData?.items ?? [];

	const { data: districtsData, isPending: isDistrictsPending } = useQuery({
		...districtsByRegionQueryOptions(selectedRegionId ?? ""),
		enabled: !!selectedRegionId,
	});
	const districts = districtsData?.items ?? [];

	const { data: settlementsData, isPending: isSettlementsPending } = useQuery({
		...settlementsByDistrictQueryOptions(selectedDistrictId ?? ""),
		enabled: !!selectedDistrictId,
	});
	const settlements = settlementsData?.items ?? [];

	const submitAction = async (
		_prev: LocationFormState,
		formData: FormData,
	): Promise<LocationFormState> => {
		const ancestralVillageRaw = (formData.get("ancestralVillage") as string | null)?.trim() ?? null;

		const dto: LocationFormValues = {
			countryId: selectedCountryId,
			regionId: selectedRegionId,
			districtId: selectedDistrictId,
			settlementId: selectedSettlementId,
			ancestralVillage: ancestralVillageRaw || null,
		};

		try {
			await heritageApi.upsertMyHeritage(dto);
			await queryClient.invalidateQueries({ queryKey: heritageKeys.myHeritage() });
			toastSuccess(t("profile.toasts.saved"));
			return { success: true, error: null };
		} catch (err) {
			toastApiError(err);
			return { success: false, error: t("profile.toasts.error") };
		}
	};

	const [state, formAction, isPending] = useActionState<LocationFormState, FormData>(
		submitAction,
		{ success: false, error: null },
	);

	const handleCountrySelect = (countryId: string | null) => {
		setSelectedCountryId(countryId);
		setSelectedRegionId(null);
		setSelectedDistrictId(null);
		setSelectedSettlementId(null);
	};

	const handleRegionSelect = (regionId: string | null) => {
		setSelectedRegionId(regionId);
		setSelectedDistrictId(null);
		setSelectedSettlementId(null);
	};

	const handleDistrictSelect = (districtId: string | null) => {
		setSelectedDistrictId(districtId);
		setSelectedSettlementId(null);
	};

	const handleSettlementSelect = (settlementId: string | null) => {
		setSelectedSettlementId(settlementId);
	};

	const handleAncestralVillageChange = (value: string) => {
		setAncestralVillage(value);
	};

	return {
		// State
		selectedCountryId,
		selectedRegionId,
		selectedDistrictId,
		selectedSettlementId,
		ancestralVillage,

		// Data
		countries,
		regions,
		districts,
		settlements,
		currentHeritage,

		// Loading states
		isCountriesPending,
		isRegionsPending,
		isDistrictsPending,
		isSettlementsPending,

		// Form
		state,
		formAction,
		isPending,

		// Handlers
		handleCountrySelect,
		handleRegionSelect,
		handleDistrictSelect,
		handleSettlementSelect,
		handleAncestralVillageChange,
	};
};
