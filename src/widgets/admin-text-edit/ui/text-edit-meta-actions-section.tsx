"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { Check, Save, Trash2 } from "lucide-react";

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
	const handleSaveAndUpdate: NonNullable<ComponentProps<"button">["onClick"]> = () => onSaveAndUpdate();
	const handleSaveDraft: NonNullable<ComponentProps<"button">["onClick"]> = () => onSaveDraft();
	const handleDeleteRequest: NonNullable<ComponentProps<"button">["onClick"]> = () => onDeleteRequest();

	return (
		<>
			<div className="flex flex-col gap-1.5 border-t border-bd-1 bg-surf-2 px-4 py-[14px] transition-colors max-[900px]:hidden">
				<Button
					onClick={handleSaveAndUpdate}
					disabled={isSaving}
					className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Check className="size-[13px]" />
					{labels.saveUpdate}
				</Button>
				<Button
					onClick={handleSaveDraft}
					disabled={isSaving}
					className="flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Save className="size-3" />
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
					<Trash2 className="size-3" />
					{labels.deleteText}
				</Button>
			</div>
		</>
	);
};
