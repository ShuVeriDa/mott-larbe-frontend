export { geoApi, geoKeys } from "./api";
export type {
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
	districtsByRegionQueryOptions,
	regionsQueryOptions,
	settlementsByDistrictQueryOptions,
} from "./model";
