"use client";

import { Typography } from "@/shared/ui/typography";
import { AlignLeft } from "lucide-react";
import { AdminTextEditorShortcutsMenu } from "./admin-text-editor-shortcuts-menu";
import type { AdminTextEditorShortcut } from "./model/get-admin-text-editor-shortcuts";

interface AdminTextEditorFooterProps {
	stats: {
		words: number;
		chars: number;
		paragraphs: number;
	};
	labels: {
		words: string;
		chars: string;
		paragraphs: string;
		charsOverLimit: string;
	};
	charLimit: number;
	shortcuts?: AdminTextEditorShortcut[];
	shortcutsButtonLabel?: string;
	shortcutsTitle?: string;
}

export const AdminTextEditorFooter = ({
	stats,
	labels,
	charLimit,
	shortcuts,
	shortcutsButtonLabel,
	shortcutsTitle,
}: AdminTextEditorFooterProps) => {
	const isOverLimit = stats.chars > charLimit;
	const isNearLimit = !isOverLimit && stats.chars >= charLimit * 0.9;

	return (
		<div className="flex flex-wrap items-center gap-3 border-t border-bd-1 bg-surf-2 px-[22px] py-[7px] text-[11px] text-t-3 transition-colors max-sm:px-4">
			<div className="flex items-center gap-1">
				<AlignLeft className="size-3" />
				{labels.words}:&nbsp;
				<Typography tag="span" className="font-medium text-t-2">
					{stats.words}
				</Typography>
			</div>
			<div className="h-3 w-px bg-bd-2" />
			<div
				className={
					isOverLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : ""
				}
			>
				{labels.chars}:&nbsp;
				<Typography
					tag="span"
					className={`font-medium ${isOverLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : "text-t-2"}`}
				>
					{stats.chars}&nbsp;/&nbsp;{charLimit}
				</Typography>
				{isOverLimit && (
					<Typography tag="span" className="ml-1 font-medium text-red-500">
						{labels.charsOverLimit}
					</Typography>
				)}
			</div>
			<div className="h-3 w-px bg-bd-2 max-sm:hidden" />
			<div className="max-sm:hidden">
				{labels.paragraphs}:&nbsp;
				<Typography tag="span" className="font-medium text-t-2">
					{stats.paragraphs}
				</Typography>
			</div>
			{shortcuts && shortcutsButtonLabel && shortcutsTitle ? (
				<div className="ml-auto">
					<AdminTextEditorShortcutsMenu
						shortcuts={shortcuts}
						buttonLabel={shortcutsButtonLabel}
						title={shortcutsTitle}
						iconOnly
					/>
				</div>
			) : null}
		</div>
	);
};
