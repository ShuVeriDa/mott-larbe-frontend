"use client";

import { AuthLanguageSwitcher } from "@/features/auth-language-switcher";
import { useI18n } from "@/shared/lib/i18n";
import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { AuthThemeToggle } from "./auth-theme-toggle";

interface TopControlsProps {
	homeHref: string;
}

export const TopControls = ({ homeHref }: TopControlsProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-[60px] flex  justify-end max-[900px]:justify-between gap-2 max-[900px]:mb-8 max-[640px]:mb-6">
			<Link
				href={homeHref}
				className="hidden items-center gap-2.5 max-[900px]:inline-flex"
				aria-label={t("auth.brand.name")}
			>
				<BrandMark className="h-9 w-[30px] shrink-0" />
				<Typography tag="span" className="flex flex-col gap-0 leading-none">
					<Typography
						tag="span"
						className="font-display text-[17px] font-medium tracking-[-0.3px] text-t-1"
					>
						{t("auth.brand.name")}
					</Typography>
					<Typography
						tag="span"
						className="mt-0.5 text-[8px] font-medium uppercase tracking-[1px] text-t-3 opacity-70"
					>
						{t("auth.brand.tagline")}
					</Typography>
				</Typography>
			</Link>
			<div className="flex items-center gap-2 max-[900px]:ml-auto">
				<AuthLanguageSwitcher />
				<AuthThemeToggle />
			</div>
		</div>
	);
};
