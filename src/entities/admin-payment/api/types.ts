export type PaymentBackendStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
export type PaymentUiTab = "all" | "paid" | "refunded" | "failed";
export type PaymentProvider = "STRIPE" | "PAYPAL" | "PADDLE" | "LEMONSQUEEZY" | "MANUAL";
export type RefundReason =
	| "USER_REQUEST"
	| "DUPLICATE_TRANSACTION"
	| "CHARGE_ERROR"
	| "OTHER";

export interface AdminPaymentPlan {
	id: string;
	code: string;
	name: string;
	type: string;
	interval: string | null;
}

export interface AdminPaymentSubscription {
	id: string;
	plan: AdminPaymentPlan;
}

export interface AdminPaymentUserRole {
	role: { name: string };
}

export interface AdminPaymentUserSubscription {
	plan: { type: string; code: string };
	status: string;
}

export interface AdminPaymentUser {
	id: string;
	email: string;
	name: string;
	surname: string;
	status: string;
	lastActiveAt: string | null;
	signupAt: string;
	roles: AdminPaymentUserRole[];
	subscriptions: AdminPaymentUserSubscription[];
}

export interface AdminPaymentListItem {
	id: string;
	providerPaymentId: string;
	provider: PaymentProvider;
	status: PaymentBackendStatus;
	amountCents: number;
	refundedCents: number;
	currency: string;
	createdAt: string;
	subscription: AdminPaymentSubscription;
	user: AdminPaymentUser;
}

export interface AdminPaymentDetail extends AdminPaymentListItem {
	user: AdminPaymentUser & { payments: AdminPaymentListItem[] };
}

export interface AdminPaymentsListResponse {
	items: AdminPaymentListItem[];
	total: number;
	page: number;
	limit: number;
}

export interface AdminPaymentStats {
	revenueCents: number;
	revenueGrowth: number;
	transactionCount: number;
	transactionGrowth: number | null;
	succeededCount: number;
	succeededGrowth: number | null;
	refundCount: number;
	refundCents: number;
	refundGrowth: number | null;
	failedCount: number;
	failedGrowth: number | null;
	avgTicketCents: number;
	avgTicketGrowth: number | null;
}

export interface AdminPaymentChartItem {
	day: string;
	revenueCents: number;
	refundCents: number;
}

export interface AdminPaymentProviderItem {
	provider: PaymentProvider;
	totalCents: number;
	count: number;
	pct: number;
}

export interface FetchPaymentsQuery {
	status?: PaymentBackendStatus;
	provider?: PaymentProvider;
	planId?: string;
	search?: string;
	dateFrom?: string;
	dateTo?: string;
	page?: number;
	limit?: number;
}

export interface FetchPaymentChartQuery {
	dateFrom?: string;
	dateTo?: string;
}

export interface RefundPaymentDto {
	amountCents: number;
	reason?: RefundReason;
}
