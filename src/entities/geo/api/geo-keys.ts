export const geoKeys = {
	all: ["entities", "geo"] as const,

	regions: () => [...geoKeys.all, "regions"] as const,
	regionsList: (countryCode?: string) =>
		[...geoKeys.regions(), { countryCode }] as const,

	districts: () => [...geoKeys.all, "districts"] as const,
	districtsByRegion: (regionId: string) =>
		[...geoKeys.districts(), { regionId }] as const,

	settlements: () => [...geoKeys.all, "settlements"] as const,
	settlementsByDistrict: (districtId: string) =>
		[...geoKeys.settlements(), { districtId }] as const,
};
