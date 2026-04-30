"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";

export interface MobileMenuLink {
	href: string;
	labelKey: string;
}

interface MobileMenuProps {
	open: boolean;
	onClose: () => void;
	links: MobileMenuLink[];
	loginHref: string;
	startHref: string;
}

export const MobileMenu = ({
	open,
	onClose,
	links,
	loginHref,
	startHref,
}: MobileMenuProps) => {
	const { t } = useI18n();

	return (
		<>
			<div
				className={cn(
					"fixed inset-0 z-[199] bg-black/45 transition-opacity duration-200 md:hidden",
					open ? "opacity-100" : "pointer-events-none opacity-0",
				)}
				onClick={onClose}
				aria-hidden="true"
			/>
			<aside
				className={cn(
					"fixed inset-y-0 right-0 z-[200] flex w-[min(300px,88vw)] flex-col bg-surf border-hairline border-l border-bd-2",
					"transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] md:hidden",
					open ? "translate-x-0" : "translate-x-full",
				)}
				aria-hidden={!open}
				aria-label={t("landing.nav.menu")}
			>
				<div className="flex items-center justify-between border-hairline border-b border-bd-1 px-[18px] py-[14px]">
					<div className="flex items-center gap-2.5">
						<BrandMark className="h-[28px] w-[24px]" />
						<Typography
							tag="span"
							className="font-display text-base font-medium tracking-[-0.2px] text-t-1"
						>
							{t("landing.brand.name")}
						</Typography>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label={t("landing.nav.close")}
						className="flex h-8 w-8 items-center justify-center rounded-base border-hairline border-bd-2 bg-transparent text-t-1 transition-colors hover:bg-surf-2"
					>
						<X size={14} strokeWidth={1.8} />
					</button>
				</div>

				<nav className="flex-1 py-3">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							onClick={onClose}
							className="block border-hairline border-b border-bd-1 px-[22px] py-3 text-[15px] text-t-1 transition-colors hover:bg-surf-2"
						>
							{t(link.labelKey)}
						</Link>
					))}
				</nav>

				<div className="flex flex-col gap-2 border-hairline border-t border-bd-1 p-[18px]">
					<Link
						href={loginHref}
						onClick={onClose}
						className="flex h-10 w-full items-center justify-center gap-1.5 rounded-base border-hairline border-bd-2 bg-transparent text-[13px] font-medium text-t-1 transition-colors hover:bg-surf-2"
					>
						{t("landing.nav.login")}
					</Link>
					<Link
						href={startHref}
						onClick={onClose}
						className="flex h-10 w-full items-center justify-center gap-1.5 rounded-base bg-acc text-[13px] font-semibold text-white shadow-[0_2px_6px_rgba(34,84,211,0.25)] transition-opacity hover:opacity-[0.92]"
					>
						{t("landing.nav.start")}
					</Link>
				</div>
			</aside>
		</>
	);
};
