"use client";

import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { ReaderPager } from "@/widgets/reader-topbar/ui/reader-pager";
import { Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

interface ReaderFocusExitButtonProps {
	onExit: () => void;
	textId: string;
	lang: string;
	currentPage: number;
	totalPages: number;
}

export const ReaderFocusExitButton = ({
	onExit,
	textId,
	lang,
	currentPage,
	totalPages,
}: ReaderFocusExitButtonProps) => {
	const { t } = useI18n();
	return (
		<motion.div
			variants={variants.scaleIn}
			initial="hidden"
			animate="visible"
			className={[
				"fixed right-5 z-95",
				"bottom-5 max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+10px)]",
				"flex items-center gap-2",
			].join(" ")}
		>
				<span className="md:hidden">
				<ReaderPager
					textId={textId}
					lang={lang}
					currentPage={currentPage}
					totalPages={totalPages}
				/>
			</span>
			<motion.button
				type="button"
				onClick={onExit}
				aria-label={t("reader.topbar.focusMode")}
				title={t("reader.topbar.focusMode")}
				className={[
					"flex items-center gap-1.5 rounded-full",
					"px-3 py-1.5",
					"border border-bd-2 bg-surf/80 backdrop-blur-sm",
					"font-mono text-[10px] uppercase tracking-widest text-t-3",
					"cursor-pointer outline-none transition-all duration-150",
					"hover:border-bd-3 hover:bg-surf hover:text-t-1",
					"focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1",
					"active:scale-95",
				].join(" ")}
			>
				<Minimize2 className="size-3 shrink-0" strokeWidth={1.5} />
				<span>esc</span>
			</motion.button>
		</motion.div>
	);
};
