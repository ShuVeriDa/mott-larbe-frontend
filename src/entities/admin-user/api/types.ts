export type UserStatus = "ACTIVE" | "BLOCKED" | "FROZEN" | "DELETED";

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
