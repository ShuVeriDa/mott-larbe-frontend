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
	PanelLeft,
	PanelLeftClose,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode, useState } from "react";

interface NavItemProps {
	href: string;
	label: string;
	icon: ReactNode;
	badge?: number;
	active?: boolean;
	isCompactMode?: boolean;
}

const NavItem = ({
	href,
	label,
	icon,
	badge,
	active,
	isCompactMode = false,
}: NavItemProps) => (
	<Link
		href={href}
		className={cn(
			"relative flex w-full items-center gap-2.5 px-3.5 py-[7px] text-[13px] transition-[color,padding,gap] duration-200",
			isCompactMode && "max-[899px]:justify-center max-[899px]:gap-0 max-[899px]:px-0",
			active
				? "text-acc-t bg-acc-bg font-medium before:absolute before:bottom-[5px] before:left-0 before:top-[5px] before:w-0.5 before:rounded-r-sm before:bg-acc"
				: "text-t-2 hover:bg-surf-2 hover:text-t-1",
		)}
		title={label}
	>
		<Typography
			tag="span"
			className={cn("size-[15px] shrink-0", active ? "text-acc-t" : "text-t-3")}
		>
			{icon}
		</Typography>
		<Typography
			tag="span"
			className={cn(
				"truncate transition-[width,opacity] duration-200",
				isCompactMode &&
					"max-[899px]:w-0 max-[899px]:overflow-hidden max-[899px]:opacity-0",
			)}
		>
			{label}
		</Typography>
		{badge !== undefined && badge > 0 && (
			<Typography
				tag="span"
				className={cn(
					"ml-auto min-w-[18px] rounded bg-red-bg px-1 py-px text-center text-[10px] font-semibold text-red-t",
					isCompactMode && "max-[899px]:hidden",
				)}
			>
				{badge}
			</Typography>
		)}
	</Link>
);

const NavSection = ({
	label,
	isCompactMode = false,
}: {
	label: string;
	isCompactMode?: boolean;
}) => (
	<div
		className={cn(
			"px-3.5 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3 transition-opacity duration-200",
			isCompactMode && "max-[899px]:px-0 max-[899px]:py-0 max-[899px]:opacity-0",
		)}
	>
		{label}
	</div>
);

const NavDivider = ({ isCompactMode = false }: { isCompactMode?: boolean }) => (
	<div
		className={cn(
			"mx-3.5 my-1.5 h-px bg-bd-1 transition-[margin] duration-200",
			isCompactMode && "max-[899px]:mx-2",
		)}
	/>
);

export const AdminSideNav = () => {
	const { t, lang } = useI18n();
	const pathname = usePathname();
	const [isExpandedOnSmall, setIsExpandedOnSmall] = useState(false);

	const isActive = (path: string) => pathname.includes(path);
	const isCompactMode = !isExpandedOnSmall;
	const handleToggleExpanded: NonNullable<ComponentProps<"button">["onClick"]> =
		() => setIsExpandedOnSmall(prev => !prev);

	return (
		<nav
			className={cn(
				"relative flex h-screen shrink-0 flex-col border-r border-bd-1 bg-surf transition-[width,background-color,border-color] duration-200 min-[900px]:w-[210px]",
				isExpandedOnSmall ? "max-[899px]:w-[210px]" : "max-[899px]:w-[60px]",
			)}
		>
			{/* Logo */}
			<div
				className={cn(
					"flex items-center border-b border-bd-1 py-4 transition-[padding] duration-200 min-[900px]:px-3.5",
					isCompactMode
						? "max-[899px]:justify-center max-[899px]:px-2"
						: "max-[899px]:justify-between max-[899px]:px-2.5",
				)}
			>
				<Link
					href={`/${lang}/dashboard`}
					className={cn(
						"flex min-w-0 items-center gap-2.5 rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-acc",
						isCompactMode && "max-[899px]:justify-center max-[899px]:gap-0",
					)}
				>
					<BrandMark width="30" height="36" className="shrink-0" />
					<div
						className={cn(
							"flex min-w-0 flex-col transition-[width,opacity] duration-200",
							isCompactMode &&
								"max-[899px]:w-0 max-[899px]:overflow-hidden max-[899px]:opacity-0",
						)}
					>
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
				</Link>
			</div>

			{/* Scrollable nav */}
			<div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0">
				<NavSection label={t("admin.nav.overview")} isCompactMode={isCompactMode} />
				<NavItem
					href={`/${lang}/admin/dashboard`}
					label={t("admin.nav.dashboard")}
					active={isActive("/admin/dashboard")}
					icon={<LayoutGrid className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/analytics`}
					label={t("admin.nav.analytics")}
					active={isActive("/admin/analytics")}
					icon={<TrendingUp className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>

				<NavSection label={t("admin.nav.content")} isCompactMode={isCompactMode} />
				<NavItem
					href={`/${lang}/admin/texts`}
					label={t("admin.nav.texts")}
					active={isActive("/admin/texts")}
					icon={<FileText className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/tokenization`}
					label={t("admin.nav.tokenization")}
					active={isActive("/admin/tokenization")}
					icon={<Scissors className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/dictionary`}
					label={t("admin.nav.dictionary")}
					active={isActive("/admin/dictionary")}
					icon={<BookOpen className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/morphology`}
					label={t("admin.nav.morphology")}
					active={isActive("/admin/morphology")}
					icon={<Layers className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/unknown-words`}
					label={t("admin.nav.unknownWords")}
					active={isActive("/admin/unknown-words")}
					badge={142}
					icon={<UserX className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>

				<NavSection label={t("admin.nav.users")} isCompactMode={isCompactMode} />
				<NavItem
					href={`/${lang}/admin/users`}
					label={t("admin.nav.usersList")}
					active={isActive("/admin/users")}
					icon={<Users className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/feedback`}
					label={t("admin.nav.feedback")}
					active={isActive("/admin/feedback")}
					badge={7}
					icon={<MessageSquare className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>

				<NavDivider isCompactMode={isCompactMode} />

				<NavSection label={t("admin.nav.billing")} isCompactMode={isCompactMode} />
				<NavItem
					href={`/${lang}/admin/plans`}
					label={t("admin.nav.plans")}
					active={isActive("/admin/plans")}
					icon={<CreditCard className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/billing`}
					label={t("admin.nav.subscriptions")}
					active={isActive("/admin/billing")}
					icon={<Clock className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/payments`}
					label={t("admin.nav.payments")}
					active={isActive("/admin/payments")}
					icon={<DollarSign className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/billing/coupons`}
					label={t("admin.nav.coupons")}
					active={isActive("/admin/billing/coupons")}
					icon={<Ticket className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>

				<NavSection label={t("admin.nav.system")} isCompactMode={isCompactMode} />
				<NavItem
					href={`/${lang}/admin/feature-flags`}
					label={t("admin.nav.featureFlags")}
					active={isActive("/admin/feature-flags")}
					icon={<Settings className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
				<NavItem
					href={`/${lang}/admin/logs`}
					label={t("admin.nav.logs")}
					active={isActive("/admin/logs")}
					icon={<ScrollText className="size-[15px]" />}
					isCompactMode={isCompactMode}
				/>
			</div>

			<div className="hidden border-t border-bd-1 p-2 max-[899px]:block">
				<button
					type="button"
					onClick={handleToggleExpanded}
					className={cn(
						"flex h-8 items-center rounded-[8px] border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1",
						isExpandedOnSmall
							? "w-full justify-center"
							: "mx-auto w-8 justify-center",
					)}
					aria-label={isExpandedOnSmall ? "Collapse menu" : "Expand menu"}
				>
					{isExpandedOnSmall ? (
						<PanelLeftClose className="size-[14px]" />
					) : (
						<PanelLeft className="size-[14px]" />
					)}
				</button>
			</div>
		</nav>
	);
};
