"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { Upload, Save } from "lucide-react";

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
		<div className="flex flex-col gap-1.5 border-t border-bd-1 bg-surf-2 px-4 py-[14px] transition-colors max-[767px]:bg-surf">
			<Button
				onClick={handlePublish}
				disabled={isSaving}
				className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<Upload className="size-[13px]" />
				{labels.publish}
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
	);
};
