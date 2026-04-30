"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";
import { AuthLanguageSwitcher } from "../auth-language-switcher";
import { AuthThemeToggle } from "../auth-theme-toggle";

interface AuthTopbarProps {
	loginHref: string;
}

export const AuthTopbar = ({ loginHref }: AuthTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className="relative z-1 flex items-center justify-between border-b border-bd-2 bg-panel/60 px-8 py-[22px] backdrop-blur-md max-[640px]:px-[18px] max-[640px]:py-4">
			<Link
				href={loginHref}
				aria-label={t("auth.resetPassword.brand")}
				className="inline-flex items-center gap-2.5 text-t-1"
			>
				<BrandMark className="h-9 w-[30px] drop-shadow-[0_2px_4px_rgba(34,84,211,0.18)]" />
				<Typography tag="span" className="flex flex-col leading-none">
					<Typography
						tag="span"
						className="font-display text-[18px] font-medium tracking-[-0.3px] text-t-1"
					>
						{t("auth.resetPassword.brand")}
					</Typography>
					<Typography
						tag="span"
						className="mt-px text-[9px] uppercase tracking-[1px] text-t-3 opacity-70 max-[640px]:hidden"
					>
						{t("auth.resetPassword.tagline")}
					</Typography>
				</Typography>
			</Link>

			<div className="flex items-center gap-2">
				<AuthLanguageSwitcher />
				<AuthThemeToggle />
			</div>
		</header>
	);
};
