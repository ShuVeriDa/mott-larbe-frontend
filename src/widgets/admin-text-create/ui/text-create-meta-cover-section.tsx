"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ComponentProps, useRef } from "react";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";

interface Props {
	coverPreviewUrl: string | null;
	sectionTitle: string;
	uploadLabel: string;
	uploadSub: string;
	onCoverSelect: (file: File) => void;
}

export const TextCreateMetaCoverSection = ({
	coverPreviewUrl,
	sectionTitle,
	uploadLabel,
	uploadSub,
	onCoverSelect,
}: Props) => {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleCoverFileChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		const file = e.currentTarget.files?.[0];
		if (file) onCoverSelect(file);
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
				className="flex h-[82px] w-full flex-col items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-bd-2 bg-surf transition-colors hover:border-acc hover:bg-acc-muted"
			>
				{coverPreviewUrl ? (
					// blob: URL from URL.createObjectURL — next/image cannot handle it
					// eslint-disable-next-line @next/next/no-img-element
					<img src={coverPreviewUrl} alt="cover preview" className="h-full w-full rounded-base object-cover" />
				) : (
					<>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-t-3">
							<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
							<circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
							<path d="M3 16l4.5-4 3 3 3-3 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<Typography tag="span" className="text-[11px] text-t-3">{uploadLabel}</Typography>
						<Typography tag="span" className="text-[10px] text-t-4">{uploadSub}</Typography>
					</>
				)}
			</Button>
		</MetaSection>
	);
};
