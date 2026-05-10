"use client";

import { Typography } from "@/shared/ui/typography";
import { AlignLeft } from "lucide-react";

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
	};
}

export const AdminTextEditorFooter = ({
	stats,
	labels,
}: AdminTextEditorFooterProps) => {
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
			<div>
				{labels.chars}:&nbsp;
				<Typography tag="span" className="font-medium text-t-2">
					{stats.chars}
				</Typography>
			</div>
			<div className="h-3 w-px bg-bd-2 max-sm:hidden" />
			<div className="max-sm:hidden">
				{labels.paragraphs}:&nbsp;
				<Typography tag="span" className="font-medium text-t-2">
					{stats.paragraphs}
				</Typography>
			</div>
		</div>
	);
};
