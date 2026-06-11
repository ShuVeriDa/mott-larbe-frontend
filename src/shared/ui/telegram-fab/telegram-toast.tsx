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

const toastVariants = {
	hidden: { opacity: 0, y: 16, scale: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { ...spring.gentle, duration: duration.slow },
	},
	exit: {
		opacity: 0,
		y: 12,
		scale: 0.96,
		transition: { duration: duration.base, ease: ease.exit },
	},
};

export const TelegramToast = () => {
	const { lang, heading, subheading, visible, handleClose } = useTelegramToast();

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
						"fixed z-201",
						"bottom-6 right-6",
						"max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+12px)] max-md:left-3 max-md:right-3",
						"w-[320px] max-w-[calc(100vw-48px)] max-md:w-auto",
						"rounded-2xl border-[0.5px] border-white/10 bg-[#1a1a1e]/96 backdrop-blur-2xl",
						"shadow-[0_12px_40px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)]",
						"origin-bottom-right max-md:origin-bottom",
					)}
				>
					<Button
						variant="bare"
						size="bare"
						onClick={handleClose}
						aria-label={t.close}
						className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/8 hover:text-white/70 focus-visible:ring-2 focus-visible:ring-white/20"
					>
						<X size={13} strokeWidth={2.5} aria-hidden="true" />
					</Button>

					<motion.div
						variants={variants.staggerContainer}
						initial="hidden"
						animate="visible"
						className="p-4"
					>
						<motion.div variants={variants.staggerItem} className="mb-3 flex items-center gap-2.5">
							<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#229ED9]/20">
								<TelegramIcon className="size-[15px] text-[#229ED9]" />
							</span>
							<p className="text-[11.5px] font-medium text-white/40">{t.author}</p>
						</motion.div>

						<motion.div variants={variants.staggerItem}>
							<p className="mb-1 text-[15px] font-semibold leading-[1.35] text-white">
								{heading}
							</p>
							<p className="mb-4 text-[12.5px] leading-normal text-white/50">
								{subheading}
							</p>
						</motion.div>

						<motion.a
							variants={variants.staggerItem}
							href={TG_HREF}
							target="_blank"
							rel="noopener noreferrer"
							onClick={handleClose}
							whileHover={{ opacity: 0.9 }}
							whileTap={{ scale: 0.97 }}
							className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#229ED9] text-[13px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#229ED9]/70"
						>
							<Send size={14} aria-hidden="true" />
							{t.cta}
						</motion.a>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
