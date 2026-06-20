import { queryOptions } from "@tanstack/react-query";
import { geoApi } from "../api/geo-api";
import { geoKeys } from "../api/geo-keys";

const STALE_TIME = 1000 * 60 * 60; // 1 hour — reference data changes rarely

export const countriesQueryOptions = () =>
	queryOptions({
		queryKey: geoKeys.countriesList(),
		queryFn: () => geoApi.getCountries({ limit: 300 }),
		staleTime: STALE_TIME,
	});

export const regionsByCountryQueryOptions = (countryId: string) =>
	queryOptions({
		queryKey: geoKeys.regionsByCountry(countryId),
		queryFn: () => geoApi.getRegionsByCountry(countryId, { limit: 200 }),
		staleTime: STALE_TIME,
		enabled: !!countryId,
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
