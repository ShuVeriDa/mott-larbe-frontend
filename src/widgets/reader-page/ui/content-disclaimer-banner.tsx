"use client";

import { X, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { duration, ease } from "@/shared/lib/animation";
import { AnimatePresence, motion } from "framer-motion";
import { useContentDisclaimer } from "../model/use-content-disclaimer";

const bannerVariants = {
	hidden: { opacity: 0, y: -8, height: 0 },
	visible: {
		opacity: 1,
		y: 0,
		height: "auto",
		transition: { duration: duration.slow, ease: ease.enter },
	},
	exit: {
		opacity: 0,
		y: -4,
		height: 0,
		transition: { duration: duration.base, ease: ease.exit },
	},
} as const;

export const ContentDisclaimerBanner = () => {
	const { t } = useI18n();
	const { showDisclaimer, dismiss } = useContentDisclaimer();

	return (
		<AnimatePresence initial={false}>
			{showDisclaimer && (
				<motion.div
					variants={bannerVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					role="note"
					aria-label={t("reader.disclaimer.ariaLabel")}
					className="flex items-start gap-3 overflow-hidden border-b border-amb/20 bg-amb-bg px-4 py-3 md:items-center md:px-6"
				>
					<Info
						aria-hidden="true"
						className="mt-0.5 size-4 shrink-0 text-amb md:mt-0"
						strokeWidth={1.8}
					/>

					<p className="flex-1 text-[12.5px] leading-relaxed text-amb-t">
						<span className="font-semibold">
							{t("reader.disclaimer.title")}{" "}
						</span>
						{t("reader.disclaimer.body")}
					</p>

					<Button
						variant="bare"
						size="bare"
						aria-label={t("reader.disclaimer.close")}
						onClick={dismiss}
						className="mt-0.5 shrink-0 rounded p-1 text-amb/60 transition-colors hover:bg-amb/10 hover:text-amb md:mt-0"
					>
						<X className="size-3.5" strokeWidth={1.8} />
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
