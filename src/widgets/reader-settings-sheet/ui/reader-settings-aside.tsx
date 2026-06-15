"use client";

import { cn } from "@/shared/lib/cn";
import type { ReaderSettingsSheetProps } from "../model/types";
import { useReaderSettingsEscape } from "../model/use-reader-settings-escape";
import { ReaderSettingsBody } from "./reader-settings-body";
import { ReaderSettingsChromeHeader } from "./reader-settings-chrome-header";

/** Desktop / tablet — same sliding rail styling as `WordPanel`. */
export const ReaderSettingsAside = ({
	open,
	onClose,
	textId,
	pageNumber,
}: ReaderSettingsSheetProps) => {
	useReaderSettingsEscape(open, onClose);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-[0.5px] transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<ReaderSettingsChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
				<ReaderSettingsBody compact textId={textId} pageNumber={pageNumber} />
			</div>
		</aside>
	);
};
