export { geoApi, geoKeys } from "./api";
export type {
	Country,
	CreateDistrictDto,
	CreateRegionDto,
	CreateSettlementDto,
	District,
	GeoListQuery,
	LocalizedName,
	PaginatedResponse,
	Region,
	Settlement,
	SettlementType,
	UpdateDistrictDto,
	UpdateRegionDto,
	UpdateSettlementDto,
} from "./api";

export {
	countriesQueryOptions,
	regionsByCountryQueryOptions,
	districtsByRegionQueryOptions,
	settlementsByDistrictQueryOptions,
} from "./model";
