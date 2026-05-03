export type FeatureFlagCategory = 'FUNCTIONAL' | 'EXPERIMENTS' | 'TECHNICAL' | 'MONETIZATION';
export type FeatureFlagEnvironment = 'PROD' | 'STAGE' | 'DEV';
export type FeatureFlagStatusFilter = 'enabled' | 'disabled';
export type FeatureFlagHistoryEventType =
	| 'FLAG_CREATED'
	| 'FLAG_UPDATED'
	| 'FLAG_DELETED'
	| 'GLOBAL_ENABLED'
	| 'GLOBAL_DISABLED'
	| 'ROLLOUT_CHANGED'
	| 'ENVIRONMENTS_CHANGED'
	| 'OVERRIDE_ADDED'
	| 'OVERRIDE_UPDATED'
	| 'OVERRIDE_REMOVED'
	| 'FLAG_DUPLICATED'
	| 'FLAGS_IMPORTED';

export interface FeatureFlagActor {
	id: string;
	email: string;
	name: string;
	surname: string;
}

export interface FeatureFlagItem {
	id: string;
	key: string;
	description: string | null;
	category: FeatureFlagCategory;
	isEnabled: boolean;
	environments: FeatureFlagEnvironment[];
	rolloutPercent: number;
	overridesCount: number;
	updatedAt: string;
	updatedBy: FeatureFlagActor | null;
}

export interface FeatureFlagStats {
	totalFlags: number;
	enabledGlobalCount: number;
	enabledGlobalPercent: number;
	overridesCount: number;
	overridesUsersCount: number;
	prodOnlyCount: number;
	categoriesCount: number;
}

export interface PaginatedFeatureFlags {
	items: FeatureFlagItem[];
	total: number;
	page: number;
	limit: number;
	skip: number;
}

export interface FeatureFlagOverrideItem {
	id: string;
	isEnabled: boolean;
	reason: string | null;
	updatedAt: string;
	user: FeatureFlagActor;
	featureFlag: {
		id: string;
		key: string;
		isEnabled: boolean;
		rolloutPercent: number;
		environments: FeatureFlagEnvironment[];
	};
	setBy: FeatureFlagActor | null;
}

export interface PaginatedFeatureFlagOverrides {
	items: FeatureFlagOverrideItem[];
	total: number;
	page: number;
	limit: number;
	skip: number;
}

export interface FeatureFlagHistoryItem {
	id: string;
	flagId: string | null;
	flagKey: string;
	eventType: FeatureFlagHistoryEventType;
	actorId: string | null;
	actor: FeatureFlagActor | null;
	details: unknown;
	createdAt: string;
}

export interface PaginatedFeatureFlagHistory {
	items: FeatureFlagHistoryItem[];
	total: number;
	page: number;
	limit: number;
	skip: number;
}

export interface GetFeatureFlagsQuery {
	search?: string;
	category?: FeatureFlagCategory;
	environment?: FeatureFlagEnvironment;
	status?: FeatureFlagStatusFilter;
	page?: number;
	limit?: number;
}

export interface GetFeatureFlagOverridesQuery {
	search?: string;
	flagId?: string;
	isEnabled?: boolean;
	page?: number;
	limit?: number;
}

export interface GetFeatureFlagHistoryQuery {
	search?: string;
	flagId?: string;
	actorId?: string;
	eventType?: FeatureFlagHistoryEventType;
	page?: number;
	limit?: number;
}

export interface CreateFeatureFlagDto {
	key: string;
	description?: string;
	isEnabled?: boolean;
	category?: FeatureFlagCategory;
	environments?: FeatureFlagEnvironment[];
	rolloutPercent?: number;
}

export interface UpdateFeatureFlagDto {
	key?: string;
	description?: string;
	isEnabled?: boolean;
	category?: FeatureFlagCategory;
	environments?: FeatureFlagEnvironment[];
	rolloutPercent?: number;
}
