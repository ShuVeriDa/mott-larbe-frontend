export const geoKeys = {
	all: ["entities", "geo"] as const,

	countries: () => [...geoKeys.all, "countries"] as const,
	countriesList: () => [...geoKeys.countries()] as const,

	regions: () => [...geoKeys.all, "regions"] as const,
	regionsByCountry: (countryId: string) =>
		[...geoKeys.regions(), { countryId }] as const,

	districts: () => [...geoKeys.all, "districts"] as const,
	districtsByRegion: (regionId: string) =>
		[...geoKeys.districts(), { regionId }] as const,

	settlements: () => [...geoKeys.all, "settlements"] as const,
	settlementsByDistrict: (districtId: string) =>
		[...geoKeys.settlements(), { districtId }] as const,
};
