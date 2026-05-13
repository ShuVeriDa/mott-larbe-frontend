"use client";

import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { useCurrentUser } from "@/entities/user";
import { LOCALES, type Locale } from "@/i18n/locale-list";
import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";
import { canAccessAdmin, getDisplayName, getUserInitials, getUserRole } from "../lib/user-helpers";
import { useMySubscription } from "@/entities/subscription";
import { useLogout } from "./use-logout";
import { useTheme } from "next-themes";

const LOCALE_SHORT: Record<Locale, string> = {
	che: "CHE",
	ru: "RU",
	en: "EN",
};

export const useUserMenu = () => {
	const { t, lang } = useI18n();
	const { data: user } = useCurrentUser();
	const { data: subscription } = useMySubscription();
	const [open, setOpen] = useState(false);
	const logout = useLogout();
	const router = useRouter();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const mounted = useMounted();

	const handleThemeItemSelect = (e: Event) => {
		e.preventDefault();
	};

	const handleSetTheme = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const value = e.currentTarget.dataset.theme;
		if (value === "dark" || value === "light") setTheme(value);
	};

	const initials = user ? getUserInitials(user) : "";
	const displayName = user ? getDisplayName(user) : "";
	const showAdmin = user ? canAccessAdmin(user) : false;
	const userRole = user ? getUserRole(user) : "learner";

	const handleLogout = async () => {
		setOpen(false);
		await logout.mutateAsync();
		router.replace(`/${lang}`);
		router.refresh();
	};

	const handleLanguageItemSelect = (event: Event) => event.preventDefault();

	const handleLocaleClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		const nextLocale = event.currentTarget.dataset.locale as Locale | undefined;
		if (!nextLocale || !LOCALES.includes(nextLocale)) return;
		if (nextLocale === lang) return;
		const newPath = pathname.replace(/^\/[^/]+/, `/${nextLocale}`);
		router.push(newPath);
	};

	return {
		t,
		lang,
		user,
		open,
		setOpen,
		logout,
		initials,
		displayName,
		showAdmin,
		userRole,
		subscription,
		theme: mounted ? theme : undefined,
		handleThemeItemSelect,
		handleSetTheme,
		handleLogout,
		handleLanguageItemSelect,
		handleLocaleClick,
		localeShort: LOCALE_SHORT,
		locales: LOCALES,
	};
};
