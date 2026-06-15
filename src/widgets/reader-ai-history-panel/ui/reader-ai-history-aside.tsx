"use client";

import { useEscapeToClose } from "@/shared/lib/escape-to-close";
import { cn } from "@/shared/lib/cn";
import type { ReaderAiHistoryPanelProps } from "../model/types";
import { AiHistoryPanelBody } from "./ai-history-panel-body";
import { AiHistoryPanelHeader } from "./ai-history-panel-header";

export const ReaderAiHistoryAside = ({
	open,
	onClose,
}: ReaderAiHistoryPanelProps) => {
	useEscapeToClose(open, onClose);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-[0.5px] transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<AiHistoryPanelHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<AiHistoryPanelBody />
			</div>
		</aside>
	);
};
