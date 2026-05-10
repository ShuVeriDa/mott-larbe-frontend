"use client";

import { AdminTextMetaPrimaryActionsSection } from "@/shared/ui/admin-text-editor";
import { Save, Upload } from "lucide-react";

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
	return (
		<AdminTextMetaPrimaryActionsSection
			isSaving={isSaving}
			primaryLabel={labels.publish}
			secondaryLabel={labels.saveDraft}
			primaryIcon={<Upload className="size-[13px]" />}
			secondaryIcon={<Save className="size-3" />}
			onPrimaryAction={onPublish}
			onSecondaryAction={onSaveDraft}
		/>
	);
};
