export type DashboardPeriod = 'week' | 'month' | 'year' | 'all';

export interface DashboardQueryParams {
	period?: DashboardPeriod;
	dateFrom?: string;
	dateTo?: string;
}

export interface AdminDashboardKpi {
	totalUsers: number;
	newUsersInPeriod: number;
	newUsersTrend: number | null;
	activeUsers7d: number;
	activeUsers7dTrend: number | null;
	paidSubscriptions: number;
	newPaidSubsInPeriod: number;
	paidSubsTrend: number;
	revenueCents: number;
	revenuePrevCents: number;
	revenueTrend: number | null;
	currency: string;
}

export interface AdminDashboardChart {
	labels: string[];
	newUsers: number[];
	activeUsers: number[];
}

export interface AdminDashboardTextByLevel {
	level: string | null;
	count: number;
}

export interface AdminDashboardContent {
	totalTexts: number;
	publishedTexts: number;
	publishedPercent: number;
	newTextsInPeriod: number;
	dictionaryWordsCount: number;
	readingsInPeriod: number;
	textsByLevel: AdminDashboardTextByLevel[];
}

export interface AdminDashboardUser {
	id: string;
	name: string;
	surname: string;
	email: string;
	status: string;
	subscriptionType: string | null;
	createdAt: string;
}

export interface AdminDashboardActivityEvent {
	type: string;
	title: string;
	meta: string;
	createdAt: string;
}

export interface AdminDashboardSupportThread {
	id: string;
	type: string;
	status: string;
	subject: string | null;
	userName: string;
	userEmail: string;
	createdAt: string;
}

export interface AdminDashboardSupport {
	openCount: number;
	inProgressCount: number;
	answeredCount: number;
	resolvedCount: number;
	recentThreads: AdminDashboardSupportThread[];
}

export interface AdminDashboardUnknownWords {
	total: number;
}

export interface AdminDashboardFeatureFlag {
	id: string;
	key: string;
	description: string | null;
	isEnabled: boolean;
}

export interface AdminDashboardBillingPlan {
	id: string;
	code: string;
	name: string;
	type: string;
	priceCents: number;
	currency: string;
	activeSubscriptions: number;
}

export interface AdminDashboardPayment {
	id: string;
	amountCents: number;
	currency: string;
	userName: string;
	createdAt: string;
}

export interface AdminDashboardBilling {
	plans: AdminDashboardBillingPlan[];
	recentPayments: AdminDashboardPayment[];
}

export interface AdminDashboardResponse {
	kpi: AdminDashboardKpi;
	chart: AdminDashboardChart;
	content: AdminDashboardContent;
	recentUsers: AdminDashboardUser[];
	activityFeed: AdminDashboardActivityEvent[];
	support: AdminDashboardSupport;
	unknownWords: AdminDashboardUnknownWords;
	featureFlags: AdminDashboardFeatureFlag[];
	billing: AdminDashboardBilling;
}
