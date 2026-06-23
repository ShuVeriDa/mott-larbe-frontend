"use client";

import { Button } from "@/shared/ui/button";

import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";
import { useMounted } from "@/shared/lib/mounted";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
	const { t, lang } = useI18n();
	const mounted = useMounted();
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (open) closeButtonRef.current?.focus();
	}, [open]);

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						className="fixed inset-0 z-199 bg-black/45 md:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={onClose}
						aria-hidden="true"
					/>
					<motion.aside
						role="dialog"
						aria-modal="true"
						aria-label={t("landing.nav.menu")}
						className="fixed inset-y-0 right-0 z-200 flex w-[min(300px,88vw)] flex-col border-l border-bd-2 bg-surf md:hidden"
						variants={variants.slideInFromRight}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
						<div className="flex items-center justify-between border-b-[0.5px] border-bd-1 px-[18px] py-[14px]">
							<Link
								href={`/${lang}/dashboard`}
								className="flex min-w-0 items-center gap-2.5"
								onClick={onClose}
							>
								<BrandMark className="h-[28px] w-[24px] shrink-0" />
								<Typography
									tag="span"
									className="font-display truncate text-base font-medium tracking-[-0.2px] text-t-1"
								>
									{t("landing.brand.name")}
								</Typography>
							</Link>
							<Button
								size={"bare"}
								ref={closeButtonRef}
								onClick={onClose}
								aria-label={t("landing.nav.close")}
								title={t("landing.nav.close")}
								className="flex h-8 w-8 items-center justify-center rounded-base border-[0.5px] border-bd-2 bg-transparent text-t-1 transition-colors hover:bg-surf-2"
							>
								<X size={14} strokeWidth={1.8} />
							</Button>
						</div>

						<nav className="flex-1 py-3">
							{links.map(link => (
								<Link
									key={link.href}
									href={link.href}
									onClick={onClose}
									className="block border-b-[0.5px] border-bd-1 px-[22px] py-3 text-[15px] text-t-1 transition-colors hover:bg-surf-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-acc/70"
								>
									{t(link.labelKey)}
								</Link>
							))}
						</nav>

						<div className="flex flex-col gap-2 border-t-[0.5px] border-bd-1 p-[18px]">
							<Link
								href={loginHref}
								onClick={onClose}
								className="flex h-10 w-full items-center justify-center gap-1.5 rounded-base border-[0.5px] border-bd-2 bg-transparent text-[13px] font-medium text-t-1 transition-colors hover:bg-surf-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
							>
								{t("landing.nav.login")}
							</Link>
							<Link
								href={startHref}
								onClick={onClose}
								className="flex h-10 w-full items-center justify-center gap-1.5 rounded-base bg-acc text-[13px] font-semibold text-white shadow-[0_2px_6px_rgba(34,84,211,0.25)] transition-opacity hover:opacity-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
							>
								{t("landing.nav.start")}
							</Link>
						</div>
					</motion.aside>
				</>
			)}
		</AnimatePresence>,
		document.body,
	);
};
