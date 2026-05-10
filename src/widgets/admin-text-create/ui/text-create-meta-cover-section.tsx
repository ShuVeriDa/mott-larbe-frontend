"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ComponentProps, useRef } from "react";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import { Image as ImageIcon, Trash2 } from "lucide-react";

interface Props {
	coverPreviewUrl: string | null;
	sectionTitle: string;
	uploadLabel: string;
	uploadSub: string;
	removeLabel: string;
	onCoverSelect: (file: File) => void;
	onCoverRemove: () => void;
}

export const TextCreateMetaCoverSection = ({
	coverPreviewUrl,
	sectionTitle,
	uploadLabel,
	uploadSub,
	removeLabel,
	onCoverSelect,
	onCoverRemove,
}: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleCoverFileChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		const file = e.currentTarget.files?.[0];
		if (file) onCoverSelect(file);
	};
	const handleCoverClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		fileInputRef.current?.click();
	const handleCoverRemoveClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = e => {
		e.preventDefault();
		e.stopPropagation();
		if (fileInputRef.current) fileInputRef.current.value = "";
		onCoverRemove();
	};

	return (
		<MetaSection title={sectionTitle}>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="hidden"
				onChange={handleCoverFileChange}
			/>
			<Button
				onClick={handleCoverClick}
				className="flex h-[82px] w-full flex-col items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-bd-2 bg-surf transition-colors hover:border-acc hover:bg-acc-muted"
			>
				{coverPreviewUrl ? (
					// blob: URL from URL.createObjectURL — next/image cannot handle it
					// eslint-disable-next-line @next/next/no-img-element
					<img src={coverPreviewUrl} alt="cover preview" className="h-full w-full rounded-base object-cover" />
				) : (
					<>
						<ImageIcon className="size-5 text-t-3" />
						<Typography tag="span" className="text-[11px] text-t-3">{uploadLabel}</Typography>
						<Typography tag="span" className="text-[10px] text-t-4">{uploadSub}</Typography>
					</>
				)}
			</Button>
			{coverPreviewUrl && (
				<Button
					variant="bare"
					size={null}
					onClick={handleCoverRemoveClick}
					className="mt-2 flex h-7 w-full items-center justify-center gap-1.5 rounded-[6px] border border-bd-2 bg-surf-2 text-[11px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-3 hover:text-t-1"
				>
					<Trash2 className="size-3.5" />
					<Typography tag="span" className="text-[11px] font-medium">
						{removeLabel}
					</Typography>
				</Button>
			)}
		</MetaSection>
	);
};
