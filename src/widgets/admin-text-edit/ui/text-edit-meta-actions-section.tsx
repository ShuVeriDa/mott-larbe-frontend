"use client";

import { AdminTextMetaPrimaryActionsSection } from "@/shared/ui/admin-text-editor";
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
	const handleDeleteRequest: NonNullable<ComponentProps<"button">["onClick"]> = () => onDeleteRequest();

	return (
		<>
			<AdminTextMetaPrimaryActionsSection
				isSaving={isSaving}
				primaryLabel={labels.saveUpdate}
				secondaryLabel={labels.saveDraft}
				primaryIcon={<Check className="size-[13px]" />}
				secondaryIcon={<Save className="size-3" />}
				onPrimaryAction={onSaveAndUpdate}
				onSecondaryAction={onSaveDraft}
			/>

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
