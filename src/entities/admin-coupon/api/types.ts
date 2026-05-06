export type CouponType = "PERCENT" | "FIXED";
export type CouponStatus = "active" | "expired" | "exhausted" | "disabled";

export interface AdminCouponStats {
	activeCount: number;
	expiredCount: number;
	exhaustedCount: number;
	disabledCount: number;
	totalCreated: number;
	totalRedemptions: number;
	usagesThisMonth: number;
	usageGrowth: number;
	totalDiscountCents: number;
	conversionRate: number;
	conversionDelta: number;
}

export interface AdminCouponRedemptionUser {
	id: string;
	name: string;
	surname: string;
	email: string;
	subscriptions?: Array<{ plan: string }>;
}

export interface AdminCouponRedemption {
	id: string;
	user: AdminCouponRedemptionUser;
	createdAt: string;
	discountCents?: number | null;
}

export interface AdminCouponListItem {
	id: string;
	code: string;
	name?: string | null;
	type: CouponType;
	amount: number;
	maxRedemptions?: number | null;
	redeemedCount: number;
	maxPerUser?: number | null;
	newUsersOnly: boolean;
	isStackable: boolean;
	applicablePlans: string[];
	validFrom?: string | null;
	validUntil?: string | null;
	isActive: boolean;
	createdAt: string;
	computedStatus: CouponStatus;
}

export interface AdminCouponDetail extends AdminCouponListItem {
	redemptions: AdminCouponRedemption[];
}

export interface FetchCouponsQuery {
	type?: CouponType;
	status?: CouponStatus;
	plan?: string;
	search?: string;
	sortBy?: "createdAt" | "redeemedCount" | "validUntil" | "code";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

export interface AdminCouponsListResponse {
	items: AdminCouponListItem[];
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
	maxPerUser?: number;
	newUsersOnly?: boolean;
	isStackable?: boolean;
	applicablePlans?: string[];
	validFrom?: string;
	validUntil?: string;
	isActive?: boolean;
}

export interface UpdateCouponDto {
	code?: string;
	name?: string;
	type?: CouponType;
	amount?: number;
	maxRedemptions?: number;
	maxPerUser?: number;
	newUsersOnly?: boolean;
	isStackable?: boolean;
	applicablePlans?: string[];
	validFrom?: string;
	validUntil?: string;
	isActive?: boolean;
}
