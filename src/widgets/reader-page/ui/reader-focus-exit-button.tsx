"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Minimize2 } from "lucide-react";

interface ReaderFocusExitButtonProps {
	onExit: () => void;
}

export const ReaderFocusExitButton = ({ onExit }: ReaderFocusExitButtonProps) => {
	const { t } = useI18n();
	return (
		<button
			type="button"
			onClick={onExit}
			aria-label={t("reader.topbar.focusMode")}
			title={t("reader.topbar.focusMode")}
			className={[
				// Position — bottom-right, above mobile nav
				"fixed right-5 z-95",
				"bottom-5 max-md:bottom-[calc(56px+env(safe-area-inset-bottom)+10px)]",
				// Shape — horizontal pill, not circle
				"flex items-center gap-1.5 rounded-full",
				"px-3 py-1.5",
				// Surface — frosted glass feel
				"border border-bd-2 bg-surf/80 backdrop-blur-sm",
				// Text + icon
				"font-mono text-[10px] uppercase tracking-widest text-t-3",
				// Interaction
				"cursor-pointer outline-none transition-all duration-150",
				"hover:border-bd-3 hover:bg-surf hover:text-t-1",
				"focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1",
				"active:scale-95",
			].join(" ")}
		>
			<Minimize2 className="size-3 shrink-0" strokeWidth={1.5} />
			<span>esc</span>
		</button>
	);
};
