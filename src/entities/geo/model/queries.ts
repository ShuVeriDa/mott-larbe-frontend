import { queryOptions } from "@tanstack/react-query";
import { geoApi } from "../api/geo-api";
import { geoKeys } from "../api/geo-keys";

const STALE_TIME = 1000 * 60 * 60; // 1 hour — reference data changes rarely

export const regionsQueryOptions = (countryCode?: string) =>
	queryOptions({
		queryKey: geoKeys.regionsList(countryCode),
		queryFn: () => geoApi.getRegions({ countryCode, limit: 100 }),
		staleTime: STALE_TIME,
	});

export const districtsByRegionQueryOptions = (regionId: string) =>
	queryOptions({
		queryKey: geoKeys.districtsByRegion(regionId),
		queryFn: () => geoApi.getDistrictsByRegion(regionId, { limit: 200 }),
		staleTime: STALE_TIME,
		enabled: !!regionId,
	});

export const settlementsByDistrictQueryOptions = (districtId: string) =>
	queryOptions({
		queryKey: geoKeys.settlementsByDistrict(districtId),
		queryFn: () => geoApi.getSettlementsByDistrict(districtId, { limit: 200 }),
		staleTime: STALE_TIME,
		enabled: !!districtId,
	});
