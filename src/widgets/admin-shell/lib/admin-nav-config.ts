import {
	LayoutGrid,
	TrendingUp,
	FileText,
	Scissors,
	BookOpen,
	Layers,
	UserX,
	Users,
	MessageSquare,
	CreditCard,
	Clock,
	DollarSign,
	Ticket,
	Settings,
	ScrollText,
} from "lucide-react";

export interface AdminNavItem {
	href: (lang: string) => string;
	label: (t: (key: string) => string) => string;
	icon: React.ComponentType<{ className?: string }>;
	badge?: number;
}

export interface AdminNavSection {
	titleKey: string;
	items: AdminNavItem[];
	dividerBefore?: boolean;
}

export const buildAdminNavSections = (t: (key: string) => string, lang: string): AdminNavSection[] => [
	{
		titleKey: "admin.nav.overview",
		items: [
			{
				href: () => `/${lang}/admin/dashboard`,
				label: () => t("admin.nav.dashboard"),
				icon: LayoutGrid,
			},
			{
				href: () => `/${lang}/admin/analytics`,
				label: () => t("admin.nav.analytics"),
				icon: TrendingUp,
			},
		],
	},
	{
		titleKey: "admin.nav.content",
		items: [
			{
				href: () => `/${lang}/admin/texts`,
				label: () => t("admin.nav.texts"),
				icon: FileText,
			},
			{
				href: () => `/${lang}/admin/tokenization`,
				label: () => t("admin.nav.tokenization"),
				icon: Scissors,
			},
			{
				href: () => `/${lang}/admin/dictionary`,
				label: () => t("admin.nav.dictionary"),
				icon: BookOpen,
			},
			{
				href: () => `/${lang}/admin/morphology`,
				label: () => t("admin.nav.morphology"),
				icon: Layers,
			},
			{
				href: () => `/${lang}/admin/unknown-words`,
				label: () => t("admin.nav.unknownWords"),
				icon: UserX,
				badge: 142,
			},
		],
	},
	{
		titleKey: "admin.nav.users",
		items: [
			{
				href: () => `/${lang}/admin/users`,
				label: () => t("admin.nav.usersList"),
				icon: Users,
			},
			{
				href: () => `/${lang}/admin/feedback`,
				label: () => t("admin.nav.feedback"),
				icon: MessageSquare,
				badge: 7,
			},
		],
	},
	{
		titleKey: "admin.nav.billing",
		dividerBefore: true,
		items: [
			{
				href: () => `/${lang}/admin/plans`,
				label: () => t("admin.nav.plans"),
				icon: CreditCard,
			},
			{
				href: () => `/${lang}/admin/billing`,
				label: () => t("admin.nav.subscriptions"),
				icon: Clock,
			},
			{
				href: () => `/${lang}/admin/payments`,
				label: () => t("admin.nav.payments"),
				icon: DollarSign,
			},
			{
				href: () => `/${lang}/admin/billing/coupons`,
				label: () => t("admin.nav.coupons"),
				icon: Ticket,
			},
		],
	},
	{
		titleKey: "admin.nav.system",
		items: [
			{
				href: () => `/${lang}/admin/feature-flags`,
				label: () => t("admin.nav.featureFlags"),
				icon: Settings,
			},
			{
				href: () => `/${lang}/admin/logs`,
				label: () => t("admin.nav.logs"),
				icon: ScrollText,
			},
		],
	},
];
