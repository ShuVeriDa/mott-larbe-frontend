export type PlanType = "FREE" | "BASIC" | "PRO" | "PREMIUM" | "LIFETIME";
export type PlanCode = PlanType;

export type BillingSubscriptionStatus = "TRIALING" | "ACTIVE" | "CANCELED" | "EXPIRED";

export type BillingPaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export type BillingPaymentProvider =
	| "STRIPE"
	| "PAYPAL"
	| "PADDLE"
	| "LEMONSQUEEZY"
	| "MANUAL";

export type CouponType = "PERCENT" | "FIXED";

export type PlanInterval = "month" | "year" | null;

export type CouponComputedStatus = "active" | "expired" | "exhausted" | "disabled";

// ── Plans ─────────────────────────────────────────────────────────────────────

export interface PlanLimits {
	translationsPerDay?: number;
	wordsInDictionary?: number;
	availableTexts?: number;
	statisticsDays?: number;
	maxFolders?: number;
	readTexts: boolean;
	wordTranslation: boolean;
	tokenAnalysis: boolean;
	personalDictionary: boolean;
	dictionaryFolders: boolean;
	hasComplexTexts: boolean;
	textProgress: boolean;
	spaceRepetition: boolean;
	hasFlashcards: boolean;
	wordContexts: boolean;
	analytics: boolean;
	hasAdvancedAnalytics: boolean;
	hasPrioritySupport: boolean;
}

export interface AdminPlan {
	id: string;
	name: string;
	code: string;
	type: PlanType;
	description?: string | null;
	priceCents: number;
	currency: string;
	interval: PlanInterval;
	isActive: boolean;
	groupCode?: string | null;
	trialDays?: number;
	limits: PlanLimits;
	displayColor?: string | null;
	iconKey?: string | null;
	highlightFeatures?: string[];
	subscriberCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface FetchPlansQuery {
	onlyActive?: boolean;
	type?: PlanType;
	groupCode?: string;
}

export interface CreatePlanDto {
	code: string;
	name: string;
	type: PlanType;
	priceCents: number;
	currency?: string;
	interval?: PlanInterval;
	description?: string;
	trialDays?: number;
	isActive?: boolean;
	groupCode?: string;
	limits?: Partial<PlanLimits>;
	displayColor?: string;
	iconKey?: string;
	highlightFeatures?: string[];
}

export interface UpdatePlanDto {
	name?: string;
	priceCents?: number;
	description?: string;
	isActive?: boolean;
	groupCode?: string | null;
	limits?: Partial<PlanLimits>;
	displayColor?: string;
	highlightFeatures?: string[];
}

export interface UpdatePlanLimitsDto {
	limits: Partial<PlanLimits>;
}

// ── Billing KPI stats ─────────────────────────────────────────────────────────

export interface BillingStats {
	payingCount: number;
	totalUsers: number;
	mrrCents: number;
	arrCents: number;
	conversionRate: number;
	churnRate: number;
	payingDeltaLast30: number;
	mrrGrowthPct: number | null;
	conversionDeltaPp: number;
	churnDeltaPp: number;
}

export interface SubscriptionStats {
	activeCount: number;
	trialingCount: number;
	canceledCount: number;
	expiredCount: number;
	canceledLast30: number;
	expiredLast30: number;
	activeLast30: number;
	trialingExpiringIn7d: number;
	total: number;
}

// ── Revenue by plan ───────────────────────────────────────────────────────────

export interface PlanRevenueItem {
	planId: string;
	planCode: string;
	planName: string;
	totalCents: number;
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

export interface AdminSubscriptionUser {
	id: string;
	name: string;
	email: string;
}

export interface AdminSubscriptionPlan {
	id: string;
	name: string;
	code: string;
}

export interface AdminSubscriptionListItem {
	id: string;
	user: AdminSubscriptionUser;
	plan: AdminSubscriptionPlan;
	status: BillingSubscriptionStatus;
	provider?: BillingPaymentProvider | null;
	amountCents: number;
	currency: string;
	startedAt: string;
	endsAt?: string | null;
	createdAt: string;
}

export interface FetchSubscriptionsQuery {
	status?: BillingSubscriptionStatus;
	provider?: BillingPaymentProvider;
	planType?: PlanCode;
	search?: string;
	page?: number;
	limit?: number;
}

export interface AdminSubscriptionsListResponse {
	items: AdminSubscriptionListItem[];
	total: number;
	page: number;
	limit: number;
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export interface AdminCoupon {
	id: string;
	code: string;
	name?: string | null;
	type: CouponType;
	amount: number;
	maxRedemptions?: number | null;
	redeemedCount: number;
	validFrom?: string | null;
	validUntil?: string | null;
	applicablePlans: string[];
	maxPerUser?: number | null;
	newUsersOnly: boolean;
	isStackable: boolean;
	isActive: boolean;
	computedStatus: CouponComputedStatus;
	createdAt: string;
}

export interface FetchCouponsQuery {
	status?: CouponComputedStatus;
	search?: string;
	page?: number;
	limit?: number;
}

export interface AdminCouponsListResponse {
	items: AdminCoupon[];
	total: number;
	page: number;
	limit: number;
}

export interface CreateCouponDto {
	code: string;
	name?: string;
	type: CouponType;
	amount: number;
	maxRedemptions?: number;
	validFrom?: string;
	validUntil?: string;
	applicablePlans?: string[];
	maxPerUser?: number;
	newUsersOnly?: boolean;
	isStackable?: boolean;
	isActive?: boolean;
}

export interface UpdateCouponDto {
	name?: string;
	isActive?: boolean;
	maxRedemptions?: number;
	validUntil?: string;
}
