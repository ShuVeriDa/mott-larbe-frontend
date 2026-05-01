"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";

interface NavItemProps {
	href: string;
	label: string;
	icon: React.ReactNode;
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
		<span
			className={cn(
				"size-[15px] shrink-0",
				active ? "text-acc-t" : "text-t-3",
			)}
		>
			{icon}
		</span>
		{label}
		{badge !== undefined && badge > 0 && (
			<span className="ml-auto min-w-[18px] rounded bg-red-bg px-1 py-px text-center text-[10px] font-semibold text-red-t">
				{badge}
			</span>
		)}
	</Link>
);

const NavSection = ({ label }: { label: string }) => (
	<div className="px-3.5 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
		{label}
	</div>
);

const NavDivider = () => (
	<div className="mx-3.5 my-1.5 h-px bg-bd-1" />
);

export const AdminSideNav = () => {
	const { t, lang } = useI18n();
	const pathname = usePathname();

	const isActive = (path: string) => pathname.includes(path);

	return (
		<nav className="relative flex h-screen w-[210px] shrink-0 flex-col border-r border-bd-1 bg-surf transition-colors max-md:hidden">
			{/* Logo */}
			<div className="flex items-center gap-2.5 border-b border-bd-1 px-3.5 py-4">
				<div className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-acc shadow-[0_2px_6px_rgba(34,84,211,0.35)]">
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
						<path
							d="M7.5 2L3 5.5v7h9v-7L7.5 2z"
							fill="#fff"
							fillOpacity=".9"
						/>
						<path
							d="M5.5 12.5V9h4v3.5"
							stroke="#fff"
							strokeWidth="1.1"
							strokeLinecap="round"
						/>
					</svg>
				</div>
				<span className="font-display text-[14px] font-medium tracking-[-0.1px] text-t-1">
					{t("admin.brand")}
				</span>
				<span className="ml-auto shrink-0 rounded bg-red-bg px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.3px] text-red-t">
					{t("admin.chip")}
				</span>
			</div>

			{/* Scrollable nav */}
			<div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0">
				<NavSection label={t("admin.nav.overview")} />
				<NavItem
					href={`/${lang}/admin/dashboard`}
					label={t("admin.nav.dashboard")}
					active={isActive("/admin/dashboard")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<rect x="1.5" y="1.5" width="5" height="5" rx="1.2" />
							<rect x="8.5" y="1.5" width="5" height="5" rx="1.2" />
							<rect x="1.5" y="8.5" width="5" height="5" rx="1.2" />
							<rect x="8.5" y="8.5" width="5" height="5" rx="1.2" />
						</svg>
					}
				/>
				<NavItem
					href={`/${lang}/admin/analytics`}
					label={t("admin.nav.analytics")}
					active={isActive("/admin/analytics")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<path d="M2 11l2.5-3 2 2.5 2.5-3L12 11" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					}
				/>

				<NavSection label={t("admin.nav.content")} />
				<NavItem
					href={`/${lang}/admin/texts`}
					label={t("admin.nav.texts")}
					active={isActive("/admin/texts")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<rect x="2" y="2" width="11" height="11" rx="1.5" />
							<path d="M4.5 5h6M4.5 7.5h6M4.5 10h4" strokeLinecap="round" />
						</svg>
					}
				/>
				<NavItem
					href={`/${lang}/admin/dictionary`}
					label={t("admin.nav.dictionary")}
					active={isActive("/admin/dictionary")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<path d="M3 4h9M3 7.5h7M3 11h5" strokeLinecap="round" />
						</svg>
					}
				/>
				<NavItem
					href={`/${lang}/admin/unknown-words`}
					label={t("admin.nav.unknownWords")}
					active={isActive("/admin/unknown-words")}
					badge={142}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<circle cx="7.5" cy="5" r="2" />
							<path d="M2 12c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" strokeLinecap="round" />
							<path d="M9.5 9l2.5 2.5M12 9l-2.5 2.5" strokeLinecap="round" />
						</svg>
					}
				/>

				<NavSection label={t("admin.nav.users")} />
				<NavItem
					href={`/${lang}/admin/users`}
					label={t("admin.nav.usersList")}
					active={isActive("/admin/users")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<circle cx="7.5" cy="5" r="2.5" />
							<path d="M2.5 13c0-2.76 2.24-5 5-5s5 2.24 5 5" strokeLinecap="round" />
						</svg>
					}
				/>
				<NavItem
					href={`/${lang}/admin/feedback`}
					label={t("admin.nav.feedback")}
					active={isActive("/admin/feedback")}
					badge={7}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<path d="M2 11c0-2 1.5-3.5 3.5-3.5h4C11.5 7.5 13 9 13 11" strokeLinecap="round" />
							<circle cx="5" cy="4.5" r="1.8" />
							<circle cx="10" cy="4.5" r="1.8" />
						</svg>
					}
				/>

				<NavDivider />

				<NavSection label={t("admin.nav.billing")} />
				<NavItem
					href={`/${lang}/admin/plans`}
					label={t("admin.nav.plans")}
					active={isActive("/admin/plans")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<rect x="1.5" y="3.5" width="12" height="8" rx="1.5" />
							<path d="M1.5 6.5h12" strokeLinecap="round" />
							<path d="M4 9.5h3" strokeLinecap="round" />
						</svg>
					}
				/>
				<NavItem
					href={`/${lang}/admin/payments`}
					label={t("admin.nav.payments")}
					active={isActive("/admin/payments")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<path d="M7.5 1.5v12M4 4.5c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2s-.9 2-2 2H6c-1.1 0-2 .9-2 2s.9 2 2 2h3c1.1 0 2-.9 2-2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					}
				/>

				<NavSection label={t("admin.nav.system")} />
				<NavItem
					href={`/${lang}/admin/feature-flags`}
					label={t("admin.nav.featureFlags")}
					active={isActive("/admin/feature-flags")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<circle cx="7.5" cy="7.5" r="2" />
							<path d="M7.5 1.5v2m0 8v2m6-6h-2m-8 0H1.5" strokeLinecap="round" />
						</svg>
					}
				/>
				<NavItem
					href={`/${lang}/admin/logs`}
					label={t("admin.nav.logs")}
					active={isActive("/admin/logs")}
					icon={
						<svg viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
							<circle cx="7.5" cy="7.5" r="5.5" />
							<path d="M7.5 4.5v3l2 2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					}
				/>
			</div>
		</nav>
	);
};
