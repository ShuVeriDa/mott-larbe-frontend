import type { Variants } from "framer-motion";

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
	exit: { opacity: 0 },
};

export const slideUp: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 16 },
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.95 },
};

export const listVariants: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const itemVariants: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0 },
};
