"use client";

import { LOCALES, type Locale } from "@/i18n/locale-list";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, useTransition } from 'react';
const LABELS: Record<Locale, string> = {
	ru: "РУ",
	che: "НАХ",
	en: "EN",
};

const replaceLocaleInPath = (pathname: string, nextLang: Locale): string => {
	const segments = pathname.split("/");
	if (segments.length > 1 && LOCALES.includes(segments[1] as Locale)) {
		segments[1] = nextLang;
		return segments.join("/") || `/${nextLang}`;
	}
	return `/${nextLang}${pathname}`;
};

export const AuthLanguageSwitcher = () => {
	const { lang } = useI18n();
	const router = useRouter();
	const pathname = usePathname();
	const [, startTransition] = useTransition();

	const handleSelect = (next: Locale) => {
		if (next === lang) return;
		const target = replaceLocaleInPath(pathname ?? `/${lang}`, next);
		startTransition(() => {
			router.replace(target);
			router.refresh();
		});
	};

	return (
		<div
			className="inline-flex gap-px rounded-[8px] border-[0.5px] border-bd-2 bg-surf p-[3px]"
			role="tablist"
			aria-label="Language"
		>
			{LOCALES.map(locale => {
				const isActive = locale === lang;
								const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => handleSelect(locale);
return (
					<button
						key={locale}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={handleClick}
						className={cn(
							"h-[26px] rounded-[6px] px-2.5 text-[11.5px] font-semibold tracking-[0.3px] transition-colors",
							isActive ? "bg-surf-3 text-t-1" : "text-t-3 hover:text-t-1",
						)}
					>
						{LABELS[locale]}
					</button>
				);
			})}
		</div>
	);
};
