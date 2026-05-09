"use client";

import { Button } from "@/shared/ui/button";

import {
	MobileMenu,
	useMobileMenu,
	type MobileMenuLink,
} from "@/features/landing-mobile-menu";
import { LandingThemeToggle } from "@/features/landing-theme-toggle";
import { useI18n } from "@/shared/lib/i18n";
import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";
import { Menu } from "lucide-react";
import Link from "next/link";

interface LandingNavProps {
	loginHref: string;
	startHref: string;
}

const NAV_LINKS: MobileMenuLink[] = [
	{ href: "#features", labelKey: "landing.nav.features" },
	{ href: "#how", labelKey: "landing.nav.how" },
	{ href: "#pricing", labelKey: "landing.nav.pricing" },
	{ href: "#faq", labelKey: "landing.nav.faq" },
];

export const LandingNav = ({ loginHref, startHref }: LandingNavProps) => {
	const { t } = useI18n();
	const { open, openMenu, closeMenu } = useMobileMenu();

	return (
		<header className="sticky top-0 z-[100] border-hairline border-b border-bd-1 bg-surf/80 backdrop-blur-xl backdrop-saturate-[160%] transition-colors">
			<div className="mx-auto w-full max-w-[1120px] px-7 max-[900px]:px-[22px] max-[640px]:px-[18px]">
				<div className="flex h-[60px] items-center justify-between max-[640px]:h-14">
					<Link
						href="#"
						className="flex items-center gap-2.5"
						aria-label={t("landing.brand.name")}
					>
						<BrandMark className="h-[34px] w-[28px] drop-shadow-[0_2px_4px_rgba(34,84,211,0.18)]" />
						<Typography tag="span" className="flex flex-col">
							<Typography
								tag="span"
								className="font-display text-base font-medium leading-[1.1] tracking-[-0.2px] text-t-1"
							>
								{t("landing.brand.name")}
							</Typography>
							<Typography
								tag="span"
								className="mt-px text-[9.5px] uppercase tracking-[1px] text-t-3 max-[640px]:hidden"
							>
								{t("landing.brand.sub")}
							</Typography>
						</Typography>
					</Link>

					<nav className="flex items-center gap-1 max-[900px]:hidden">
						{NAV_LINKS.map(link => (
							<Link
								key={link.href}
								href={link.href}
								className="rounded-md px-3 py-[7px] text-[13px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							>
								{t(link.labelKey)}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<LandingThemeToggle />
						<Link
							href={loginHref}
							className="inline-flex h-[34px] items-center gap-1.5 rounded-base border-hairline border-bd-2 bg-transparent px-3.5 text-[13px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-2 max-[900px]:hidden"
						>
							{t("landing.nav.login")}
						</Link>
						<Link
							href={startHref}
							className="inline-flex h-[34px] items-center gap-1.5 rounded-base bg-acc px-3.5 text-[13px] font-semibold text-white shadow-[0_2px_6px_rgba(34,84,211,0.25)] transition-opacity hover:opacity-[0.92] max-[900px]:hidden"
						>
							{t("landing.nav.start")}
						</Link>
						<Button
							onClick={openMenu}
							aria-label={t("landing.nav.menu")}
							className="hidden h-[34px] w-[34px] items-center justify-center rounded-base border-hairline border-bd-2 bg-surf text-t-1 transition-colors hover:bg-surf-2 max-[900px]:inline-flex"
						>
							<Menu size={18} strokeWidth={1.8} />
						</Button>
					</div>
				</div>
			</div>

			<MobileMenu
				open={open}
				onClose={closeMenu}
				links={NAV_LINKS}
				loginHref={loginHref}
				startHref={startHref}
			/>
		</header>
	);
};
