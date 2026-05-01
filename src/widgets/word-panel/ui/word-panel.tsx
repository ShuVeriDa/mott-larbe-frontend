"use client";

import { X } from "lucide-react";
import { useWordLookupStore } from "@/features/word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { WordPanelContent } from "./word-panel-content";
import { WordPanelEmpty } from "./word-panel-empty";

export interface WordPanelProps {
	textId: string;
}

export const WordPanel = ({ textId }: WordPanelProps) => {
	const { t } = useI18n();
	const open = useWordLookupStore((s) => s.panelOpen);
	const closePanel = useWordLookupStore((s) => s.closePanel);
	const activeToken = useWordLookupStore((s) => s.activeToken);
	const surface = useWordLookupStore((s) => s.surface);

	const showWord = open && activeToken && surface !== "popup";

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf transition-[width,border-color] duration-250 max-md:hidden",
				open
					? "w-[296px] border-l border-hairline border-bd-1"
					: "w-0 border-l border-l-transparent",
			)}
		>
			<div className="flex shrink-0 items-center justify-between border-b border-hairline border-bd-1 px-3.5 py-2.5">
				<span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{t("reader.panel.label")}
				</span>
				<button
					type="button"
					onClick={closePanel}
					aria-label={t("reader.panel.close")}
					className="inline-flex size-6 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					<X className="size-3" strokeWidth={1.6} />
				</button>
			</div>
			{showWord && activeToken ? (
				<WordPanelContent token={activeToken} textId={textId} />
			) : (
				<WordPanelEmpty />
			)}
		</aside>
	);
};
