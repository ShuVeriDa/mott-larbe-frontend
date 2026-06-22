"use client";

import { cn } from "@/shared/lib/cn";
import { duration, ease, spring, variants } from "@/shared/lib/animation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useTelegramToast } from "./model/use-telegram-toast";
import { TelegramIcon } from "./ui/telegram-icon";

const TG_HREF = "https://t.me/shuverida";

const labels = {
	ru:  { author: "Этот сайт создал ShuVeriDa", cta: "Написать в Telegram", close: "Закрыть" },
	en:  { author: "This site was built by ShuVeriDa", cta: "Message on Telegram", close: "Close" },
	che: { author: "Хӏара сайт ShuVeriDa вина", cta: "Telegram чура яза", close: "Дӏадаккха" },
} as const;

// Desktop: slides in from bottom-right. Mobile: slides up from bottom edge.
const toastVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.96,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { ...spring.gentle, duration: duration.slow },
	},
	exit: {
		opacity: 0,
		y: 12,
		scale: 0.97,
		transition: { duration: duration.base, ease: ease.exit },
	},
};

export const TelegramToast = () => {
	const { lang, heading, subheading, visible, handleClose, autoCloseMs } = useTelegramToast();

	const t = labels[lang as keyof typeof labels] ?? labels.ru;

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					role="status"
					aria-live="polite"
					aria-label={heading}
					variants={toastVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={cn(
						// position
						"fixed z-201",
						// desktop: bottom-right corner
						"bottom-6 right-6",
						// mobile: compact, right-aligned above bottom nav
						"max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+8px)]",
						"max-md:right-3 max-md:left-auto",
						// sizing: fixed on desktop, fluid on mobile
						"w-[300px] max-md:w-auto max-md:min-w-[220px] max-md:max-w-[calc(100vw-24px)]",
						// shape
						"overflow-hidden rounded-[14px] max-md:rounded-2xl",
						// ── LIGHT THEME ──────────────────────────────────────────
						// White card on warm cream background — blends with design system
						"border-[0.5px] border-bd-1 bg-surf shadow-lg",
						// ── DARK THEME ───────────────────────────────────────────
						// Dark overlay — same hue as --surf in dark theme, with blur
						"dark:border-white/8 dark:bg-[#1c1c1f]/95 dark:shadow-[0_12px_40px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.3)] dark:backdrop-blur-2xl",
						// transform origin
						"origin-bottom-right max-md:origin-bottom",
					)}
				>
					{/* Close button */}
					<Button
						variant="bare"
						size="bare"
						onClick={handleClose}
						aria-label={t.close}
						className={cn(
							"absolute right-2.5 top-2.5 z-10",
							"flex size-8 items-center justify-center rounded-full",
							// light
							"text-t-3 transition-colors duration-150 ease-out hover:bg-surf-3 hover:text-t-1",
							// dark
							"dark:text-white/30 dark:hover:bg-white/8 dark:hover:text-white/70",
							"focus-visible:ring-2 focus-visible:ring-[#229ED9]/50",
						)}
					>
						<X size={12} strokeWidth={2.5} aria-hidden="true" />
					</Button>

					{/* Content */}
					<motion.div
						variants={variants.staggerContainer}
						initial="hidden"
						animate="visible"
						className="p-4 max-md:p-3.5"
					>
						{/* Author row */}
						<motion.div
							variants={variants.staggerItem}
							className="mb-3 flex items-center gap-2 max-md:mb-2.5"
						>
							<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#229ED9]/15 dark:bg-[#229ED9]/20">
								<TelegramIcon className="size-[13px] text-[#229ED9]" />
							</span>
							<p className="text-[11px] font-medium text-t-3 dark:text-white/40">
								{t.author}
							</p>
						</motion.div>

						{/* Heading + subheading */}
						<motion.div variants={variants.staggerItem}>
							<p className="mb-1 text-[14.5px] font-semibold leading-snug text-t-1 dark:text-white max-md:text-[14px]">
								{heading}
							</p>
							<p className="mb-3.5 text-[12px] leading-relaxed text-t-3 dark:text-white/50 max-md:mb-3">
								{subheading}
							</p>
						</motion.div>

						{/* CTA */}
						<div className="flex justify-end">
							<motion.a
								variants={variants.staggerItem}
								href={TG_HREF}
								target="_blank"
								rel="noopener noreferrer"
								onClick={handleClose}
								whileHover={{ opacity: 0.88 }}
								whileTap={{ scale: 0.97 }}
								className={cn(
									"inline-flex h-8 items-center gap-1.5 rounded-lg px-3.5",
									"bg-[#229ED9] text-[12px] font-semibold text-white",
									"transition-opacity duration-150 ease-out",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9]/60 focus-visible:ring-offset-1",
									"focus-visible:ring-offset-surf dark:focus-visible:ring-offset-[#1c1c1f]",
								)}
							>
								<Send size={12} aria-hidden="true" />
								{t.cta}
							</motion.a>
						</div>
					</motion.div>

					{/* Auto-close progress bar */}
					<motion.div
						aria-hidden="true"
						className="h-[2px] bg-[#229ED9]/35 dark:bg-[#229ED9]/50"
						initial={{ scaleX: 1, originX: 0 }}
						animate={{ scaleX: 0 }}
						transition={{ duration: autoCloseMs / 1000, ease: "linear" }}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
