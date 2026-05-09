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

export const AuthLanguageSwitcher = () => {
	const { lang, t } = useI18n();
	const pathname = usePathname();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const switchTo = (next: Locale) => {
		if (next === lang || isPending) return;
		const segments = pathname.split("/");
		segments[1] = next;
		const target = segments.join("/") || `/${next}`;
		startTransition(() => router.replace(target));
	};

	return (
		<div
			className="inline-flex gap-px rounded-[8px] border border-bd-2 bg-surf p-[3px]"
			role="group"
			aria-label={t("auth.resetPassword.language")}
		>
			{LOCALES.map(code => {
				const active = code === lang;
								const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => switchTo(code);
return (
					<button
						key={code}
						type="button"
						onClick={handleClick}
						aria-pressed={active}
						disabled={isPending}
						className={cn(
							"h-[26px] rounded-[6px] px-[10px] text-[11.5px] font-semibold uppercase tracking-[0.3px] transition-colors",
							active ? "bg-surf-3 text-t-1" : "text-t-3 hover:text-t-1",
							isPending && "cursor-wait opacity-70",
						)}
					>
						{LABELS[code]}
					</button>
				);
			})}
		</div>
	);
};
