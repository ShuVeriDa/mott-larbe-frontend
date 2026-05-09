"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";

interface Props {
	isSaving: boolean;
	labels: {
		publish: string;
		saveDraft: string;
	};
	onPublish: () => void;
	onSaveDraft: () => void;
}

export const TextCreateMetaActionsSection = ({
	isSaving,
	labels,
	onPublish,
	onSaveDraft,
}: Props) => {
	const handlePublish: NonNullable<ComponentProps<"button">["onClick"]> = () => onPublish();
	const handleSaveDraft: NonNullable<ComponentProps<"button">["onClick"]> = () => onSaveDraft();

	return (
		<div className="flex flex-col gap-1.5 border-t border-bd-1 bg-surf-2 px-4 py-[14px] transition-colors max-[900px]:hidden">
			<Button
				onClick={handlePublish}
				disabled={isSaving}
				className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
					<path d="M8 2v10M3 7l5-5 5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				{labels.publish}
			</Button>
			<Button
				onClick={handleSaveDraft}
				disabled={isSaving}
				className="flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
					<path d="M3 4a1 1 0 011-1h6l3 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
					<path d="M10 3v3H6V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					<path d="M5 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
				{labels.saveDraft}
			</Button>
		</div>
	);
};
