import { duration, ease } from "@/shared/lib/animation";
import type { Variants } from "framer-motion";

export const detailCardVariants: Variants = {
	hidden: { opacity: 0, y: 12 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: duration.slow, ease: ease.enter },
	},
};

export const detailGridVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
