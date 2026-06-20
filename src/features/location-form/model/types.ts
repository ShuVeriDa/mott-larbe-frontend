export interface LocationFormValues {
	countryId: string | null;
	regionId: string | null;
	districtId: string | null;
	settlementId: string | null;
	ancestralVillage: string | null;
}

export interface LocationFormState {
	success: boolean;
	error: string | null;
}
