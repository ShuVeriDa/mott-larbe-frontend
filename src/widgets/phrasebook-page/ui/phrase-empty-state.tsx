"use client";

import { motion } from "framer-motion";
import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { MessageSquare } from "lucide-react";

export const PhraseEmptyState = () => {
	const { t } = useI18n();

	return (
		<motion.div
			className="flex-1 flex flex-col items-center justify-center py-10 text-center px-5"
			variants={variants.scaleIn}
			initial="hidden"
			animate="visible"
		>
			<div className="w-11 h-11 rounded-[12px] bg-surf-2 flex items-center justify-center mb-3">
				<MessageSquare className="size-5 text-t-3" />
			</div>
			<div className="text-[14px] font-semibold text-t-1 mb-1">
				{t("phrasebook.empty.title")}
			</div>
			<div className="text-[12.5px] text-t-3 max-w-[280px] leading-[1.5]">
				{t("phrasebook.empty.sub")}
			</div>
		</motion.div>
	);
};
