"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { variants } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";

import { usePwaInstallPrompt } from "../model";
import { PwaInstallIosSheet } from "./pwa-install-ios-sheet";

export const PwaInstallBanner = () => {
	const { t } = useI18n();
	const { variant, isSheetOpen, handleInstallClick, handleCloseSheet, handleDismiss } =
		usePwaInstallPrompt();

	if (variant === "hidden") return null;

	return (
		<>
			<AnimatePresence>
				<motion.div
					role="status"
					aria-label={t("pwaInstall.banner.title")}
					variants={variants.slideInFromBottom}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={cn(
						"fixed z-201",
						"bottom-6 right-6",
						"max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+8px)]",
						"max-md:inset-x-3 max-md:right-3",
						"w-[340px] max-md:w-auto max-md:max-w-[calc(100vw-24px)]",
						"overflow-hidden rounded-[14px] max-md:rounded-2xl",
						"border-[0.5px] border-bd-1 bg-surf shadow-lg",
						"dark:border-white/8 dark:bg-[#1c1c1f]/95 dark:shadow-[0_12px_40px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)] dark:backdrop-blur-2xl",
						"origin-bottom-right max-md:origin-bottom",
					)}
				>
					<Button
						variant="bare"
						size="bare"
						onClick={handleDismiss}
						aria-label={t("pwaInstall.banner.dismissLabel")}
						className={cn(
							"absolute right-1 top-1 z-10",
							"flex size-11 items-center justify-center rounded-full",
							"text-t-3 transition-colors duration-150 ease-out hover:bg-surf-3 hover:text-t-1",
							"dark:text-white/30 dark:hover:bg-white/8 dark:hover:text-white/70",
							"focus-visible:ring-2 focus-visible:ring-acc/50",
						)}
					>
						<X size={14} strokeWidth={2.5} aria-hidden="true" />
					</Button>

					<div className="flex items-start gap-3 p-4 pr-10 max-md:p-3.5 max-md:pr-9">
						<Image
							src="/icons/icon-192x192.png"
							alt=""
							width={40}
							height={40}
							className="size-10 shrink-0 rounded-[10px]"
						/>
						<div className="min-w-0 flex-1">
							<p className="text-[14.5px] font-semibold leading-snug text-t-1 dark:text-white max-md:text-[14px]">
								{t("pwaInstall.banner.title")}
							</p>
							<p className="mt-1 text-[12px] leading-relaxed text-t-3 dark:text-white/50">
								{t("pwaInstall.banner.subtitle")}
							</p>

							<div className="mt-3 flex justify-end">
								{variant === "link-to-guide" ? (
									<Button asChild variant="action" size="default">
										<Link href="/pwa-guide">{t("pwaInstall.banner.installButton")}</Link>
									</Button>
								) : (
									<Button variant="action" size="default" onClick={handleInstallClick}>
										{t("pwaInstall.banner.installButton")}
									</Button>
								)}
							</div>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>

			<PwaInstallIosSheet isOpen={isSheetOpen} onClose={handleCloseSheet} />
		</>
	);
};
