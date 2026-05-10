"use client";

import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavItemProps {
	href: string;
	label: string;
	icon: ReactNode;
	badge?: number;
	active?: boolean;
}

const NavItem = ({ href, label, icon, badge, active }: NavItemProps) => (
	<Link
		href={href}
		className={cn(
			"relative flex w-full items-center gap-2.5 px-3.5 py-[7px] text-[13px] transition-colors",
			active
				? "text-acc-t bg-acc-bg font-medium before:absolute before:bottom-[5px] before:left-0 before:top-[5px] before:w-0.5 before:rounded-r-sm before:bg-acc"
				: "text-t-2 hover:bg-surf-2 hover:text-t-1",
		)}
	>
		<Typography
			tag="span"
			className={cn("size-[15px] shrink-0", active ? "text-acc-t" : "text-t-3")}
		>
			{icon}
		</Typography>
		{label}
		{badge !== undefined && badge > 0 && (
			<Typography
				tag="span"
				className="ml-auto min-w-[18px] rounded bg-red-bg px-1 py-px text-center text-[10px] font-semibold text-red-t"
			>
				{badge}
			</Typography>
		)}
	</Link>
);

const NavSection = ({ label }: { label: string }) => (
	<div className="px-3.5 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
		{label}
	</div>
);

const NavDivider = () => <div className="mx-3.5 my-1.5 h-px bg-bd-1" />;

export const AdminSideNav = () => {
	const { t, lang } = useI18n();
	const pathname = usePathname();

	const isActive = (path: string) => pathname.includes(path);

	return (
		<nav className="relative flex h-screen w-[210px] shrink-0 flex-col border-r border-bd-1 bg-surf transition-colors max-md:hidden">
			{/* Logo */}
			<div className="flex items-center gap-2.5 border-b border-bd-1 px-3.5 py-4">
				<BrandMark width="30" height="36" />
				<div className="flex flex-col">
					<Typography
						tag="span"
						className="font-display text-sm font-medium tracking-[-0.1px] text-t-1"
					>
						{t("admin.brand")}
					</Typography>
					<Typography
						tag="span"
						className="text-[9px] uppercase tracking-[1px] text-t-3 opacity-70"
					>
						{t("admin.chip")}
					</Typography>
				</div>
			</div>

			{/* Scrollable nav */}
			<div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0">
				<NavSection label={t("admin.nav.overview")} />
				<NavItem
					href={`/${lang}/admin/dashboard`}
					label={t("admin.nav.dashboard")}
					active={isActive("/admin/dashboard")}
					icon={<LayoutGrid className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/analytics`}
					label={t("admin.nav.analytics")}
					active={isActive("/admin/analytics")}
					icon={<TrendingUp className="size-[15px]" />}
				/>

				<NavSection label={t("admin.nav.content")} />
				<NavItem
					href={`/${lang}/admin/texts`}
					label={t("admin.nav.texts")}
					active={isActive("/admin/texts")}
					icon={<FileText className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/tokenization`}
					label={t("admin.nav.tokenization")}
					active={isActive("/admin/tokenization")}
					icon={<Scissors className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/dictionary`}
					label={t("admin.nav.dictionary")}
					active={isActive("/admin/dictionary")}
					icon={<BookOpen className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/morphology`}
					label={t("admin.nav.morphology")}
					active={isActive("/admin/morphology")}
					icon={<Layers className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/unknown-words`}
					label={t("admin.nav.unknownWords")}
					active={isActive("/admin/unknown-words")}
					badge={142}
					icon={<UserX className="size-[15px]" />}
				/>

				<NavSection label={t("admin.nav.users")} />
				<NavItem
					href={`/${lang}/admin/users`}
					label={t("admin.nav.usersList")}
					active={isActive("/admin/users")}
					icon={<Users className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/feedback`}
					label={t("admin.nav.feedback")}
					active={isActive("/admin/feedback")}
					badge={7}
					icon={<MessageSquare className="size-[15px]" />}
				/>

				<NavDivider />

				<NavSection label={t("admin.nav.billing")} />
				<NavItem
					href={`/${lang}/admin/plans`}
					label={t("admin.nav.plans")}
					active={isActive("/admin/plans")}
					icon={<CreditCard className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/billing`}
					label={t("admin.nav.subscriptions")}
					active={isActive("/admin/billing")}
					icon={<Clock className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/payments`}
					label={t("admin.nav.payments")}
					active={isActive("/admin/payments")}
					icon={<DollarSign className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/billing/coupons`}
					label={t("admin.nav.coupons")}
					active={isActive("/admin/billing/coupons")}
					icon={<Ticket className="size-[15px]" />}
				/>

				<NavSection label={t("admin.nav.system")} />
				<NavItem
					href={`/${lang}/admin/feature-flags`}
					label={t("admin.nav.featureFlags")}
					active={isActive("/admin/feature-flags")}
					icon={<Settings className="size-[15px]" />}
				/>
				<NavItem
					href={`/${lang}/admin/logs`}
					label={t("admin.nav.logs")}
					active={isActive("/admin/logs")}
					icon={<ScrollText className="size-[15px]" />}
				/>
			</div>
		</nav>
	);
};
