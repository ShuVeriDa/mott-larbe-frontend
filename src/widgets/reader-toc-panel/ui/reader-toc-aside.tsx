"use client";

import { cn } from "@/shared/lib/cn";
import { useEscapeToClose } from "../model/use-escape-to-close";
import type { ReaderTocPanelProps } from "../model/types";
import { TocChromeHeader } from "./toc-chrome-header";
import { TocPanelBody } from "./toc-panel-body";

export const ReaderTocAside = ({
	textId,
	currentPage,
	onNavigate,
	open,
	onClose,
}: ReaderTocPanelProps) => {
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
			<TocChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<TocPanelBody
					textId={textId}
					currentPage={currentPage}
					onNavigate={onNavigate}
					onClose={onClose}
				/>
			</div>
		</aside>
	);
};
