export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "CANCELED" | "EXPIRED";
export type PaymentProvider =
	| "STRIPE"
	| "PAYPAL"
	| "PADDLE"
	| "LEMONSQUEEZY"
	| "MANUAL";
export type PlanType =
	| "FREE"
	| "BASIC"
	| "PRO"
	| "PREMIUM"
	| "LIFETIME"
	| null;
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export type SubscriptionsSort =
	| "nextBilling_asc"
	| "nextBilling_desc"
	| "amount_asc"
	| "amount_desc"
	| "createdAt_asc"
	| "createdAt_desc";

export type SubscriptionsTab =
	| "all"
	| "active"
	| "trialing"
	| "canceled"
	| "expired";

export interface AdminSubscriptionPlan {
	id: string;
	code: string;
	name: string;
	type: PlanType;
	priceCents: number;
	currency: string;
	interval: string | null;
}

export interface AdminSubscriptionUser {
	id: string;
	email: string;
	name: string;
	surname: string;
	username: string;
	status: string;
	lastActiveAt: string | null;
	signupAt: string;
}

export interface AdminSubscriptionPayment {
	id: string;
	amountCents: number;
	currency: string;
	status: PaymentStatus;
	provider: PaymentProvider;
	createdAt: string;
}

export interface AdminSubscriptionListItem {
	id: string;
	userId: string;
	planId: string;
	status: SubscriptionStatus;
	provider: PaymentProvider;
	isLifetime: boolean;
	startDate: string;
	endDate: string | null;
	canceledAt: string | null;
	plan: AdminSubscriptionPlan;
	user: AdminSubscriptionUser;
	payments: AdminSubscriptionPayment[];
}

export interface AdminSubscriptionsResponse {
	items: AdminSubscriptionListItem[];
	total: number;
	page: number;
	limit: number;
}

export interface AdminSubscriptionTabCounts {
	all: number;
	active: number;
	trialing: number;
	canceled: number;
	expired: number;
}

export interface AdminSubscriptionsStats {
	activeCount: number;
	trialingCount: number;
	canceledCount: number;
	expiredCount: number;
	newThisMonth: number;
	churnThisMonth: number;
}

export interface FetchSubscriptionsQuery {
	status?: SubscriptionStatus;
	provider?: PaymentProvider;
	planType?: PlanType;
	search?: string;
	sort?: SubscriptionsSort;
	tab?: SubscriptionsTab;
	page?: number;
	limit?: number;
}

export interface CreateManualSubscriptionDto {
	userId?: string;
	email?: string;
	planId?: string;
	planCode?: string;
	trialDays?: number;
	durationDays?: number;
	isLifetime?: boolean;
	provider?: PaymentProvider;
	reason?: string;
}

export interface CancelSubscriptionDto {
	reason?: string;
}

export interface ExtendSubscriptionDto {
	extendDays: number;
	reason?: string;
}

export type SubscriptionEventType =
	| "SUBSCRIBED"
	| "RENEWED"
	| "UPGRADED"
	| "DOWNGRADED"
	| "CANCELED"
	| "REFUNDED"
	| "TRIAL_STARTED"
	| "TRIAL_ENDED"
	| "EXTENDED"
	| "PLAN_CHANGED";

export interface AdminSubscriptionEvent {
	id: string;
	type: SubscriptionEventType;
	metadata: Record<string, unknown> | null;
	createdAt: string;
}

export interface AdminSubscriptionDetailPayment {
	id: string;
	amountCents: number;
	refundedCents: number;
	currency: string;
	status: PaymentStatus;
	provider: PaymentProvider;
	createdAt: string;
}

export interface AdminSubscriptionDetailUserRole {
	id: string;
	role: { name: string };
}

export interface AdminSubscriptionDetailUser extends AdminSubscriptionUser {
	roles: AdminSubscriptionDetailUserRole[];
}

export interface AdminSubscriptionDetailPlan extends AdminSubscriptionPlan {
	trialDays: number | null;
}

export interface AdminSubscriptionDetail {
	id: string;
	userId: string;
	planId: string;
	status: SubscriptionStatus;
	provider: PaymentProvider;
	isLifetime: boolean;
	startDate: string;
	endDate: string | null;
	canceledAt: string | null;
	plan: AdminSubscriptionDetailPlan;
	user: AdminSubscriptionDetailUser;
	payments: AdminSubscriptionDetailPayment[];
	events: AdminSubscriptionEvent[];
}
