"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ComponentProps, useRef } from "react";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import { Image } from "lucide-react";

interface Props {
	coverPreviewUrl: string | null;
	sectionTitle: string;
	uploadLabel: string;
	uploadSub: string;
	onCoverSelect: (file: File) => void;
}

export const TextEditMetaCoverSection = ({
	coverPreviewUrl,
	sectionTitle,
	uploadLabel,
	uploadSub,
	onCoverSelect,
}: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleCoverFileChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		const f = e.currentTarget.files?.[0];
		if (f) onCoverSelect(f);
	};
	const handleCoverClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		fileInputRef.current?.click();

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
				className="flex h-[82px] w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[8px] border border-dashed border-bd-2 bg-surf transition-colors hover:border-acc hover:bg-acc-muted"
			>
				{coverPreviewUrl ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={coverPreviewUrl} alt="cover preview" className="h-full w-full object-cover" />
				) : (
					<>
						<Image className="size-5 text-t-3" />
						<Typography tag="span" className="text-[11px] text-t-3">{uploadLabel}</Typography>
						<Typography tag="span" className="text-[10px] text-t-4">{uploadSub}</Typography>
					</>
				)}
			</Button>
		</MetaSection>
	);
};
