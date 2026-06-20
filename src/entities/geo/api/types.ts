import type { LocalizedName, PaginatedResponse } from "@/shared/types";

export type { LocalizedName, PaginatedResponse };

export type SettlementType = "city" | "village" | "town";

export interface Region {
	id: string;
	countryCode: string;
	name: LocalizedName;
}

export interface District {
	id: string;
	regionId: string;
	name: LocalizedName;
}

export interface Settlement {
	id: string;
	districtId: string;
	name: LocalizedName;
	type: SettlementType;
}

export interface GeoListQuery {
	page?: number;
	limit?: number;
	countryCode?: string;
}

export interface CreateRegionDto {
	countryCode: string;
	name: LocalizedName;
}

export interface UpdateRegionDto {
	countryCode?: string;
	name?: Partial<LocalizedName>;
}

export interface CreateDistrictDto {
	regionId: string;
	name: LocalizedName;
}

export interface UpdateDistrictDto {
	regionId?: string;
	name?: Partial<LocalizedName>;
}

export interface CreateSettlementDto {
	districtId: string;
	name: LocalizedName;
	type: SettlementType;
}

export interface UpdateSettlementDto {
	districtId?: string;
	name?: Partial<LocalizedName>;
	type?: SettlementType;
}
