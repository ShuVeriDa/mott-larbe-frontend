"use client";

import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/shared/lib/animation";
import { ARABIC_LABEL_PLAIN, ARABIC_LABEL_VOWELED } from "../lib/arabic-label";

export interface ArabicScriptLabelProps {
	showDiacritics: boolean;
}

export const ArabicScriptLabel = ({ showDiacritics }: ArabicScriptLabelProps) => (
	<span className="relative inline-grid" dir="rtl">
		<AnimatePresence mode="popLayout" initial={false}>
			<motion.span
				key={showDiacritics ? "voweled" : "plain"}
				initial={{ opacity: 0, y: -3, scale: 0.85 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 3, scale: 0.85 }}
				transition={spring.snappy}
				className="col-start-1 row-start-1"
			>
				{showDiacritics ? ARABIC_LABEL_VOWELED : ARABIC_LABEL_PLAIN}
			</motion.span>
		</AnimatePresence>
	</span>
);
