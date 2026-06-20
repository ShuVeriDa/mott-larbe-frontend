export interface LocationFormValues {
	regionId: string | null;
	districtId: string | null;
	settlementId: string | null;
}

export interface LocationFormState {
	success: boolean;
	error: string | null;
}
