import { http } from "@/shared/api";
import type {
	CreateDistrictDto,
	CreateRegionDto,
	CreateSettlementDto,
	District,
	GeoListQuery,
	PaginatedResponse,
	Region,
	Settlement,
	UpdateDistrictDto,
	UpdateRegionDto,
	UpdateSettlementDto,
} from "./types";

const buildParams = (q: GeoListQuery): Record<string, string | number> => {
	const p: Record<string, string | number> = {};
	if (q.page) p.page = q.page;
	if (q.limit) p.limit = q.limit;
	if (q.countryCode) p.countryCode = q.countryCode;
	return p;
};

export const geoApi = {
	getRegions: (query: GeoListQuery = {}) =>
		http
			.get<PaginatedResponse<Region>>("/geo/regions", {
				params: buildParams(query),
			})
			.then((r) => r.data),

	getDistrictsByRegion: (regionId: string, query: GeoListQuery = {}) =>
		http
			.get<PaginatedResponse<District>>(`/geo/regions/${regionId}/districts`, {
				params: buildParams(query),
			})
			.then((r) => r.data),

	getSettlementsByDistrict: (districtId: string, query: GeoListQuery = {}) =>
		http
			.get<PaginatedResponse<Settlement>>(
				`/geo/districts/${districtId}/settlements`,
				{ params: buildParams(query) },
			)
			.then((r) => r.data),

	// Admin CRUD — Regions
	createRegion: (dto: CreateRegionDto) =>
		http.post<Region>("/admin/geo/regions", dto).then((r) => r.data),
	updateRegion: (id: string, dto: UpdateRegionDto) =>
		http.patch<Region>(`/admin/geo/regions/${id}`, dto).then((r) => r.data),
	deleteRegion: (id: string) =>
		http.delete(`/admin/geo/regions/${id}`).then((r) => r.data),

	// Admin CRUD — Districts
	createDistrict: (dto: CreateDistrictDto) =>
		http.post<District>("/admin/geo/districts", dto).then((r) => r.data),
	updateDistrict: (id: string, dto: UpdateDistrictDto) =>
		http.patch<District>(`/admin/geo/districts/${id}`, dto).then((r) => r.data),
	deleteDistrict: (id: string) =>
		http.delete(`/admin/geo/districts/${id}`).then((r) => r.data),

	// Admin CRUD — Settlements
	createSettlement: (dto: CreateSettlementDto) =>
		http.post<Settlement>("/admin/geo/settlements", dto).then((r) => r.data),
	updateSettlement: (id: string, dto: UpdateSettlementDto) =>
		http.patch<Settlement>(`/admin/geo/settlements/${id}`, dto).then((r) => r.data),
	deleteSettlement: (id: string) =>
		http.delete(`/admin/geo/settlements/${id}`).then((r) => r.data),
};
