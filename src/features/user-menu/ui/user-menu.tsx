"use client";

import { useCurrentUser } from "@/entities/user";
import { LOCALES, type Locale } from "@/i18n/locale-list";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Avatar } from "@/shared/ui/avatar";
import { CreditCardIcon, GlobeIcon, LayoutDashboardIcon, LifeBuoyIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { useState } from "react";
import { canAccessAdmin, getDisplayName, getUserInitials } from "../lib/user-helpers";
import { useLogout } from "../model/use-logout";

const LOCALE_SHORT: Record<Locale, string> = {
	che: "CHE",
	ru: "RU",
	en: "EN",
};

const itemCls = cn(
	"flex w-full items-center gap-2.5 px-3 py-[7px] text-[12.5px] text-t-2 text-left",
	"hover:bg-surf-2 hover:text-t-1 transition-colors duration-100 cursor-pointer",
	"focus-visible:outline-none focus-visible:bg-surf-2",
);

export const UserMenu = () => {
	const { t, lang } = useI18n();
	const { data: user } = useCurrentUser();
	const [open, setOpen] = useState(false);
	const logout = useLogout();
	const router = useRouter();
	const pathname = usePathname();

	if (!user) return null;

	const initials = getUserInitials(user);
	const displayName = getDisplayName(user);
	const showAdmin = canAccessAdmin(user);

	const handleLogout = async () => {
		setOpen(false);
		await logout.mutateAsync();
		router.replace(`/${lang}`);
		router.refresh();
	};

	const switchLang = (next: Locale) => {
		if (next === lang) return;
		const newPath = pathname.replace(/^\/[^/]+/, `/${next}`);
		router.push(newPath);
	};

	return (
		<DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
			<DropdownMenuPrimitive.Trigger asChild>
				<button
					type="button"
					className={cn(
						"flex w-full items-center gap-2.5 px-3.5 py-1.5 pb-3 text-left transition-colors",
						"hover:bg-surf-2 focus-visible:outline-none focus-visible:bg-surf-2",
						open && "bg-surf-2",
					)}
				>
					<Avatar size="default">{initials}</Avatar>
					<div className="min-w-0 flex-1">
						<div className="truncate text-[12.5px] font-medium text-t-1">
							{displayName}
						</div>
						<div className="text-[11px] text-t-3">{user.email}</div>
					</div>
				</button>
			</DropdownMenuPrimitive.Trigger>

			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					side="top"
					align="start"
					sideOffset={4}
					className={cn(
						"z-50 w-56 rounded-lg overflow-hidden",
						"bg-surf border border-bd-1 shadow-lg",
						"origin-[var(--radix-dropdown-menu-content-transform-origin)]",
						"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
						"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
						"duration-150",
					)}
				>
					{/* Profile & settings */}
					<div className="py-1">
						<DropdownMenuPrimitive.Item asChild>
							<Link href={`/${lang}/profile`} className={itemCls}>
								<UserIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />
								{t("nav.userMenu.profile")}
							</Link>
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item asChild>
							<Link href={`/${lang}/settings`} className={itemCls}>
								<SettingsIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />
								{t("nav.userMenu.settings")}
							</Link>
						</DropdownMenuPrimitive.Item>
					</div>

					{/* Support & subscription */}
					<div className="border-t border-bd-1 py-1">
						<DropdownMenuPrimitive.Item asChild>
							<Link href={`/${lang}/support`} className={itemCls}>
								<LifeBuoyIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />
								{t("nav.userMenu.support")}
							</Link>
						</DropdownMenuPrimitive.Item>
						<DropdownMenuPrimitive.Item asChild>
							<Link href={`/${lang}/subscription`} className={itemCls}>
								<CreditCardIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />
								{t("nav.userMenu.subscription")}
							</Link>
						</DropdownMenuPrimitive.Item>
					</div>

					{/* Admin panel */}
					{showAdmin && (
						<div className="border-t border-bd-1 py-1">
							<DropdownMenuPrimitive.Item asChild>
								<Link href={`/${lang}/admin/dashboard`} className={cn(itemCls, "text-acc-t")}>
									<LayoutDashboardIcon className="size-[13px] shrink-0 text-acc" strokeWidth={1.75} />
									{t("nav.userMenu.adminPanel")}
								</Link>
							</DropdownMenuPrimitive.Item>
						</div>
					)}

					{/* Language switcher */}
					<div className="border-t border-bd-1">
						<DropdownMenuPrimitive.Item
							onSelect={(e) => e.preventDefault()}
							className="flex items-center justify-between gap-3 px-3 py-2 focus-visible:outline-none cursor-default"
						>
							<div className="flex items-center gap-2.5 text-[12.5px] text-t-2 shrink-0">
								<GlobeIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />
								{t("nav.userMenu.language")}
							</div>
							<div
								role="radiogroup"
								aria-label={t("nav.userMenu.language")}
								className="flex rounded-full border border-bd-1 bg-surf-2 p-0.5 gap-px"
							>
								{LOCALES.map((locale) => {
									const active = locale === lang;
									return (
										<button
											key={locale}
											type="button"
											role="radio"
											aria-checked={active}
											onClick={(e) => {
												e.preventDefault();
												switchLang(locale);
											}}
											className={cn(
												"px-2 py-0.5 min-w-[28px] text-[10.5px] font-medium rounded-full transition-colors",
												active
													? "bg-acc text-white"
													: "text-t-3 hover:text-t-1",
											)}
										>
											{LOCALE_SHORT[locale]}
										</button>
									);
								})}
							</div>
						</DropdownMenuPrimitive.Item>
					</div>

					{/* Logout */}
					<div className="border-t border-bd-1 py-1">
						<DropdownMenuPrimitive.Item asChild>
							<button
								type="button"
								disabled={logout.isPending}
								onClick={handleLogout}
								className={cn(
									itemCls,
									"text-danger hover:bg-danger/8 focus-visible:bg-danger/8 disabled:opacity-50",
								)}
							>
								<LogOutIcon className="size-[13px] shrink-0" strokeWidth={1.75} />
								{t("nav.userMenu.logout")}
							</button>
						</DropdownMenuPrimitive.Item>
					</div>
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	);
};
