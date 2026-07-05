import type { Transition } from "framer-motion";

export const springs = {
	gentle: { type: "spring", stiffness: 120, damping: 14 }, // layout, page sections
	default: { type: "spring", stiffness: 280, damping: 24 }, // modal, drawer
	snappy: { type: "spring", stiffness: 400, damping: 30 }, // tooltip, dropdown
	bouncy: { type: "spring", stiffness: 600, damping: 20 }, // toast, badge counter
} as const satisfies Record<string, Transition>;
