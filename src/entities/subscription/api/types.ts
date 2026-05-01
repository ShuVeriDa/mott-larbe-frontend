export type PlanType = "FREE" | "BASIC" | "PRO" | "PREMIUM" | "LIFETIME";

export type SubscriptionStatus =
	| "TRIALING"
	| "ACTIVE"
	| "CANCELED"
	| "EXPIRED";

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export type PaymentProvider =
	| "STRIPE"
	| "PAYPAL"
	| "PADDLE"
	| "LEMONSQUEEZY"
	| "MANUAL";

export type CouponType = "PERCENT" | "FIXED";

export type BillingInterval = "month" | "year";

export type BillingCycle = "monthly" | "yearly";

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

export interface Plan {
	id: string;
	code: string;
	name: string;
	type: PlanType;
	description: string | null;
	priceCents: number;
	currency: string;
	interval: BillingInterval | null;
	isActive: boolean;
	groupCode: string | null;
	trialDays: number;
	displayColor: string | null;
	iconKey: string | null;
	highlightFeatures: string[];
	limits: PlanLimits | null;
	createdAt: string;
	updatedAt: string;
}

export interface PlanGroup {
	groupCode: string;
	variants: Plan[];
}

export interface PlansResponse {
	groups: PlanGroup[];
	ungrouped: Plan[];
}

export interface Subscription {
	id: string;
	userId: string;
	planId: string;
	status: SubscriptionStatus;
	isLifetime: boolean;
	startDate: string;
	endDate: string | null;
	canceledAt: string | null;
	provider: PaymentProvider;
	providerSubId: string | null;
	createdAt: string;
	updatedAt: string;
	plan: Plan;
}

export interface CouponApplied {
	code: string;
	type: CouponType;
	amount: number;
	discountCents: number;
}

export interface SubscribeResult extends Subscription {
	couponApplied: CouponApplied | null;
}

export interface PaymentSubscription {
	id: string;
	plan: Plan;
}

export interface Payment {
	id: string;
	userId: string;
	subscriptionId: string | null;
	provider: PaymentProvider;
	providerPaymentId: string | null;
	status: PaymentStatus;
	amountCents: number;
	currency: string;
	refundedCents: number;
	createdAt: string;
	updatedAt: string;
	subscription: PaymentSubscription | null;
}

export interface PaymentsResponse {
	items: Payment[];
	nextCursor: string | null;
	hasMore: boolean;
}

export interface PaymentsQuery {
	limit?: number;
	cursor?: string;
}

export interface UsageResponse {
	translationsToday: number;
	wordsInDictionary: number;
	limits: PlanLimits;
}

export interface RedeemPromoResult {
	code: string;
	name: string | null;
	type: CouponType;
	amount: number;
	status: "saved_for_next_subscription";
	appliesOn: "next_subscription_payment";
	requiresSubscriptionAction: boolean;
}

export interface SubscribeRequest {
	planId?: string;
	planCode?: string;
}
