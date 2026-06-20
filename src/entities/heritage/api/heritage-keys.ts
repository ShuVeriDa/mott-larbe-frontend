export const heritageKeys = {
	all: ["entities", "heritage"] as const,

	nations: () => [...heritageKeys.all, "nations"] as const,
	nationsList: () => [...heritageKeys.nations(), "list"] as const,

	tukhumy: () => [...heritageKeys.all, "tukhumy"] as const,
	tukhum: (nationId: string) =>
		[...heritageKeys.tukhumy(), { nationId }] as const,

	taips: () => [...heritageKeys.all, "taips"] as const,
	taipsByNation: (nationId: string) =>
		[...heritageKeys.taips(), { nationId }] as const,
	taipsByTukhum: (tukhumId: string) =>
		[...heritageKeys.taips(), { tukhumId }] as const,

	garas: () => [...heritageKeys.all, "garas"] as const,
	garasByTaip: (taipId: string) =>
		[...heritageKeys.garas(), { taipId }] as const,

	userHeritage: () => [...heritageKeys.all, "user-heritage"] as const,
	myHeritage: () => [...heritageKeys.userHeritage(), "me"] as const,
	publicHeritage: (userId: string) =>
		[...heritageKeys.userHeritage(), { userId }] as const,

	moderation: () => [...heritageKeys.all, "moderation"] as const,
	pending: (params?: Record<string, unknown>) =>
		params
			? ([...heritageKeys.moderation(), "pending", params] as const)
			: ([...heritageKeys.moderation(), "pending"] as const),
	stats: () => [...heritageKeys.moderation(), "stats"] as const,
};
