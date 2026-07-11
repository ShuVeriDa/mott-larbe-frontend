"use client";

import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/shared/lib/animation";
import type { ReaderScript } from "../model";
import { MOTT_LARBE_LABEL } from "../lib/mott-larbe-label";

export interface MottLarbeLabelProps {
	script: Exclude<ReaderScript, "ARABIC">;
	isOld: boolean;
}

export const MottLarbeLabel = ({ script, isOld }: MottLarbeLabelProps) => {
	const label = MOTT_LARBE_LABEL[script];

	return (
		<span className="relative inline-grid">
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					key={isOld ? "old" : "new"}
					initial={{ opacity: 0, y: -3, scale: 0.85 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 3, scale: 0.85 }}
					transition={spring.snappy}
					className="col-start-1 row-start-1 whitespace-nowrap"
				>
					{isOld ? label.old : label.new}
				</motion.span>
			</AnimatePresence>
		</span>
	);
};
