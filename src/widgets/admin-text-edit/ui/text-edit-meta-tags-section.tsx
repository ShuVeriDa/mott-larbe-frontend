"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, KeyboardEvent, useRef } from "react";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";

interface Props {
	tags: string[];
	tagInputValue: string;
	sectionTitle: string;
	tagsAddPlaceholder: string;
	tagsHint: string;
	onTagAdd: (tag: string) => void;
	onTagRemove: (tag: string) => void;
	onTagInputChange: (v: string) => void;
	onTagKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TextEditMetaTagsSection = ({
	tags,
	tagInputValue,
	sectionTitle,
	tagsAddPlaceholder,
	tagsHint,
	onTagAdd,
	onTagRemove,
	onTagInputChange,
	onTagKeyDown,
}: Props) => {
	const tagInputRef = useRef<HTMLInputElement>(null);

	const handleTagInputFocus: NonNullable<ComponentProps<"div">["onClick"]> = () =>
		tagInputRef.current?.focus();
	const handleTagInputChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		onTagInputChange(e.currentTarget.value);
	const handleTagInputKeyDown: NonNullable<ComponentProps<"input">["onKeyDown"]> = e =>
		onTagKeyDown(e);

	return (
		<MetaSection title={sectionTitle}>
			<div
				className="flex min-h-[38px] cursor-text flex-wrap gap-1.5 rounded-base border border-bd-2 bg-surf px-2 py-1.5 transition-colors focus-within:border-acc"
				onClick={handleTagInputFocus}
			>
				{tags.map(tag => {
					const handleTagRemove: NonNullable<ComponentProps<"button">["onClick"]> = e => {
						e.stopPropagation();
						onTagRemove(tag);
					};
					return (
						<Typography tag="span" key={tag} className="inline-flex items-center gap-1 rounded-[4px] bg-acc-muted px-2 py-[3px] text-[11.5px] font-medium text-acc-strong">
							{tag}
							<Button onClick={handleTagRemove} className="flex items-center text-[13px] leading-none opacity-60 hover:opacity-100">×</Button>
						</Typography>
					);
				})}
				<input
					ref={tagInputRef}
					value={tagInputValue}
					onChange={handleTagInputChange}
					onKeyDown={handleTagInputKeyDown}
					placeholder={tags.length === 0 ? tagsAddPlaceholder : ""}
					className="min-w-[70px] flex-1 border-none bg-transparent text-[12.5px] text-t-1 outline-none placeholder:text-t-3"
				/>
			</div>
			<Typography tag="p" className="mt-1.5 text-[10.5px] text-t-3">
				{tagsHint}
			</Typography>
		</MetaSection>
	);
};
