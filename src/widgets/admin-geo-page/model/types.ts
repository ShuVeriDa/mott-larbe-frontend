import type { District, Region, Settlement } from "@/entities/geo";

export type GeoTab = "regions" | "districts" | "settlements";

export interface RegionModalState {
	open: boolean;
	item: Region | null;
}

export interface DistrictModalState {
	open: boolean;
	item: District | null;
}

export interface SettlementModalState {
	open: boolean;
	item: Settlement | null;
}
