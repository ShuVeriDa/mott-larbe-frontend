export type UserStatus = "ACTIVE" | "BLOCKED" | "FROZEN" | "DELETED";

export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "CANCELED" | "EXPIRED";
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
export type PaymentProvider =
	| "STRIPE"
	| "PAYPAL"
	| "PADDLE"
	| "LEMONSQUEEZY"
	| "MANUAL";

export type UserEventType =
	| "START_SESSION"
	| "OPEN_TEXT"
	| "CLICK_WORD"
	| "ADD_TO_DICTIONARY"
	| "FAIL_LOOKUP"
	| "READ_SESSION"
	| "REVIEW_SESSION"
	| "PASSWORD_RESET_REQUESTED"
	| "PASSWORD_RESET_COMPLETED"
	| "PASSWORD_CHANGED"
	| "EMAIL_CHANGE_REQUESTED"
	| "EMAIL_CHANGE_COMPLETED";

export type RoleName =
	| "learner"
	| "support"
	| "content"
	| "linguist"
	| "admin"
	| "superadmin";

export type PlanType =
	| "FREE"
	| "BASIC"
	| "PRO"
	| "PREMIUM"
	| "LIFETIME"
	| null;

export type UsersTab = "all" | "active" | "blocked" | "frozen" | "deleted";

export type UsersSort = "signup_desc" | "activity_desc" | "name_asc";

export interface AdminUserListItem {
	id: string;
	email: string;
	username: string;
	name: string;
	surname: string;
	status: UserStatus;
	roles: RoleName[];
	plan: PlanType;
	language?: string | null;
	level?: string | null;
	signupAt: string;
	lastActiveAt?: string | null;
	textsRead?: number;
	wordsKnown?: number;
}

export interface AdminUsersStats {
	total: number;
	active: number;
	activePercent: number;
	blocked: number;
	frozen: number;
	deleted: number;
	newThisMonth: number;
	withPaidSubscription: number;
}

export interface AdminUsersTabCounts {
	all: number;
	active: number;
	blocked: number;
	frozen: number;
	deleted: number;
}

export interface AdminUsersListResponse {
	users: AdminUserListItem[];
	total: number;
	page: number;
	limit: number;
	skip: number;
	tabs: AdminUsersTabCounts;
}

export interface FetchAdminUsersQuery {
	q?: string;
	role?: RoleName | "";
	plan?: string;
	tab?: UsersTab;
	sort?: UsersSort;
	page?: number;
	limit?: number;
}

// ── User Detail ──────────────────────────────────────────────────────────────

export interface UserRoleItem {
	id: string;
	name: RoleName;
	assignedAt: string;
}

export interface UserLearningStats {
	textsRead: number;
	dictionaryWordsCount: number;
	dictionaryFoldersCount: number;
	failLookupCount: number;
	streakDays: number;
	totalStudyMinutes?: number;
}

export interface UserSubscriptionCurrent {
	id: string;
	planType: PlanType;
	planName: string;
	status: SubscriptionStatus;
	startDate: string;
	endDate: string | null;
	canceledAt: string | null;
	isLifetime: boolean;
	priceCents: number;
	currency: string;
	interval: string | null;
	provider: PaymentProvider;
}

export interface UserPaymentHistoryItem {
	id: string;
	status: PaymentStatus;
	amountCents: number;
	refundedCents: number;
	currency: string;
	createdAt: string;
	planType: PlanType | null;
	planName: string | null;
}

export interface UserSubscriptionResponse {
	current: UserSubscriptionCurrent | null;
	paymentHistory: UserPaymentHistoryItem[];
}

export interface AdminUserDetail {
	id: string;
	email: string;
	username: string;
	name: string;
	surname: string;
	phone: string | null;
	status: UserStatus;
	language: string | null;
	level: string | null;
	signupAt: string;
	lastActiveAt: string | null;
	roles: UserRoleItem[];
	subscription: UserSubscriptionCurrent | null;
	learningStats: UserLearningStats;
}

// ── Events ───────────────────────────────────────────────────────────────────

export interface UserEvent {
	id: string;
	type: UserEventType;
	meta: Record<string, unknown> | null;
	createdAt: string;
}

export interface UserEventsResponse {
	items: UserEvent[];
	total: number;
	page: number;
	limit: number;
}

export interface UserEventsSummary {
	counts: Record<string, number>;
	topFailLookups: Array<{ normalized: string; count: number }>;
	topClicks: Array<{ normalized: string; count: number }>;
}

export interface FetchUserEventsQuery {
	type?: UserEventType | "";
	period?: "7d" | "30d" | "all";
	page?: number;
	limit?: number;
}

// ── Sessions ─────────────────────────────────────────────────────────────────

export interface UserSessionLocation {
	country: string | null;
	city: string | null;
}

export interface UserSessionItem {
	id: string;
	ipAddress: string | null;
	userAgent: string | null;
	device: string | null;
	location: UserSessionLocation | null;
	createdAt: string;
	lastActiveAt: string;
	revokedAt: string | null;
	isActive: boolean;
	isLatest: boolean;
}

// ── Feature Flags ─────────────────────────────────────────────────────────────

export interface UserFeatureFlagItem {
	flagId: string;
	key: string;
	description: string | null;
	globalValue: boolean;
	userOverride: boolean | null;
	effectiveValue: boolean;
}
