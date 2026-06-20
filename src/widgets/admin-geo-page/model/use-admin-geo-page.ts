"use client";

import {
	geoApi,
	geoKeys,
	regionsQueryOptions,
	districtsByRegionQueryOptions,
	settlementsByDistrictQueryOptions,
	type District,
	type Region,
	type Settlement,
} from "@/entities/geo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { GeoTab } from "./types";

export const useAdminGeoPage = () => {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState<GeoTab>("regions");

	const [regionModal, setRegionModal] = useState<{ open: boolean; item: Region | null }>({ open: false, item: null });
	const [districtModal, setDistrictModal] = useState<{ open: boolean; item: District | null }>({ open: false, item: null });
	const [settlementModal, setSettlementModal] = useState<{ open: boolean; item: Settlement | null }>({ open: false, item: null });

	const [selectedRegionId, setSelectedRegionId] = useState<string>("");
	const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");

	const regionsQuery = useQuery(regionsQueryOptions());
	const districtsQuery = useQuery({ ...districtsByRegionQueryOptions(selectedRegionId), enabled: !!selectedRegionId });
	const settlementsQuery = useQuery({ ...settlementsByDistrictQueryOptions(selectedDistrictId), enabled: !!selectedDistrictId });

	const regions = regionsQuery.data?.data ?? [];
	const districts = districtsQuery.data?.data ?? [];
	const settlements = settlementsQuery.data?.data ?? [];

	const invalidateRegions = () => queryClient.invalidateQueries({ queryKey: geoKeys.regions() });
	const invalidateDistricts = () => queryClient.invalidateQueries({ queryKey: geoKeys.districts() });
	const invalidateSettlements = () => queryClient.invalidateQueries({ queryKey: geoKeys.settlements() });

	const createRegionMutation = useMutation({
		mutationFn: geoApi.createRegion,
		onSuccess: () => { invalidateRegions(); setRegionModal({ open: false, item: null }); },
	});

	const updateRegionMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof geoApi.updateRegion>[1]) =>
			geoApi.updateRegion(id, dto),
		onSuccess: () => { invalidateRegions(); setRegionModal({ open: false, item: null }); },
	});

	const deleteRegionMutation = useMutation({
		mutationFn: geoApi.deleteRegion,
		onSuccess: invalidateRegions,
	});

	const createDistrictMutation = useMutation({
		mutationFn: geoApi.createDistrict,
		onSuccess: () => { invalidateDistricts(); setDistrictModal({ open: false, item: null }); },
	});

	const updateDistrictMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof geoApi.updateDistrict>[1]) =>
			geoApi.updateDistrict(id, dto),
		onSuccess: () => { invalidateDistricts(); setDistrictModal({ open: false, item: null }); },
	});

	const deleteDistrictMutation = useMutation({
		mutationFn: geoApi.deleteDistrict,
		onSuccess: invalidateDistricts,
	});

	const createSettlementMutation = useMutation({
		mutationFn: geoApi.createSettlement,
		onSuccess: () => { invalidateSettlements(); setSettlementModal({ open: false, item: null }); },
	});

	const updateSettlementMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof geoApi.updateSettlement>[1]) =>
			geoApi.updateSettlement(id, dto),
		onSuccess: () => { invalidateSettlements(); setSettlementModal({ open: false, item: null }); },
	});

	const deleteSettlementMutation = useMutation({
		mutationFn: geoApi.deleteSettlement,
		onSuccess: invalidateSettlements,
	});

	return {
		activeTab,
		setActiveTab,
		selectedRegionId,
		setSelectedRegionId,
		selectedDistrictId,
		setSelectedDistrictId,
		regions,
		districts,
		settlements,
		regionsQuery,
		districtsQuery,
		settlementsQuery,
		regionModal,
		districtModal,
		settlementModal,
		setRegionModal,
		setDistrictModal,
		setSettlementModal,
		createRegionMutation,
		updateRegionMutation,
		deleteRegionMutation,
		createDistrictMutation,
		updateDistrictMutation,
		deleteDistrictMutation,
		createSettlementMutation,
		updateSettlementMutation,
		deleteSettlementMutation,
	};
};
