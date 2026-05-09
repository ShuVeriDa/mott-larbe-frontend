"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";

interface Props {
	isSaving: boolean;
	labels: {
		saveUpdate: string;
		saveDraft: string;
		dangerZone: string;
		deleteText: string;
	};
	onSaveAndUpdate: () => void;
	onSaveDraft: () => void;
	onDeleteRequest: () => void;
}

export const TextEditMetaActionsSection = ({
	isSaving,
	labels,
	onSaveAndUpdate,
	onSaveDraft,
	onDeleteRequest,
}: Props) => {
	const handleSaveAndUpdate: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onSaveAndUpdate();
	const handleSaveDraft: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onSaveDraft();
	const handleDeleteRequest: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDeleteRequest();

	return (
		<>
			<div className="flex flex-col gap-1.5 border-t border-bd-1 bg-surf-2 px-4 py-[14px] transition-colors max-[900px]:hidden">
				<Button
					onClick={handleSaveAndUpdate}
					disabled={isSaving}
					className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
						<path d="M2.5 8.5L6 12l7.5-8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					{labels.saveUpdate}
				</Button>
				<Button
					onClick={handleSaveDraft}
					disabled={isSaving}
					className="relative flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M3 4a1 1 0 011-1h6l3 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
						<path d="M10 3v3H6V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						<path d="M5 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					</svg>
					{labels.saveDraft}
				</Button>
			</div>

			<div className="border-t border-bd-1 px-4 py-3">
				<div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.6px] text-red opacity-60">
					{labels.dangerZone}
				</div>
				<Button
					onClick={handleDeleteRequest}
					className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-red/25 bg-transparent py-[7px] text-[11.5px] text-red transition-colors hover:border-red/40 hover:bg-red-muted"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					{labels.deleteText}
				</Button>
			</div>
		</>
	);
};
