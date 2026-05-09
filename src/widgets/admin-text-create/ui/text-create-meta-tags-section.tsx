"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, KeyboardEvent, useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import type { AdminTag } from "@/entities/admin-tag";
import type { TagEntry } from "../model/use-admin-text-create-page";

interface Props {
	tags: TagEntry[];
	allTags: AdminTag[];
	tagInputValue: string;
	sectionTitle: string;
	tagsAddPlaceholder: string;
	tagsHint: string;
	tagsCreate: string;
	onTagAdd: (name: string, id?: string) => void;
	onTagRemove: (index: number) => void;
	onTagInputChange: (v: string) => void;
	onTagKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TextCreateMetaTagsSection = ({
	tags,
	allTags,
	tagInputValue,
	sectionTitle,
	tagsAddPlaceholder,
	tagsHint,
	tagsCreate,
	onTagAdd,
	onTagRemove,
	onTagInputChange,
	onTagKeyDown,
}: Props) => {
	const tagInputRef = useRef<HTMLInputElement>(null);

	const filteredSuggestions = tagInputValue
		? allTags.filter(
				tag =>
					tag.name.toLowerCase().includes(tagInputValue.toLowerCase()) &&
					!tags.some(s => s.id === tag.id || s.name.toLowerCase() === tag.name.toLowerCase()),
			)
		: [];

	const hasExactMatch = allTags.some(tag => tag.name.toLowerCase() === tagInputValue.toLowerCase());
	const canCreateNew =
		tagInputValue.trim().length > 0 &&
		!hasExactMatch &&
		!tags.some(s => s.name.toLowerCase() === tagInputValue.trim().toLowerCase());

	const handleTagContainerBlur: NonNullable<ComponentProps<"div">["onBlur"]> = e => {
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			onTagInputChange("");
		}
	};
	const handleTagContainerClick: NonNullable<ComponentProps<"div">["onClick"]> = () =>
		tagInputRef.current?.focus();
	const handleTagInputChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		onTagInputChange(e.currentTarget.value);
	const handleSuggestionMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = e =>
		e.preventDefault();
	const handleSuggestionClick = (name: string, id?: string): NonNullable<ComponentProps<"button">["onClick"]> =>
		() => {
			onTagAdd(name, id);
			onTagInputChange("");
		};
	const handleCreateTagClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		onTagAdd(tagInputValue.trim());
		onTagInputChange("");
	};

	return (
		<MetaSection title={sectionTitle}>
			<div onBlur={handleTagContainerBlur} className="relative">
				<div
					className="flex min-h-[38px] cursor-text flex-wrap gap-1.5 rounded-base border border-bd-2 bg-surf px-2 py-1.5 transition-colors focus-within:border-acc"
					onClick={handleTagContainerClick}
				>
					{tags.map((tag, index) => {
						const handleTagRemove: NonNullable<ComponentProps<"button">["onClick"]> = e => {
							e.stopPropagation();
							onTagRemove(index);
						};
						return (
							<Typography tag="span" key={index} className="inline-flex items-center gap-1 rounded-[4px] bg-acc-muted px-2 py-[3px] text-[11.5px] font-medium text-acc-strong">
								{tag.name}
								<Button onClick={handleTagRemove} className="flex items-center text-[13px] leading-none opacity-60 hover:opacity-100">×</Button>
							</Typography>
						);
					})}
					<input
						ref={tagInputRef}
						value={tagInputValue}
						onChange={handleTagInputChange}
						onKeyDown={onTagKeyDown}
						placeholder={tags.length === 0 ? tagsAddPlaceholder : ""}
						className="min-w-[70px] flex-1 border-none bg-transparent text-[12.5px] text-t-1 outline-none placeholder:text-t-3"
					/>
				</div>

				{tagInputValue && (filteredSuggestions.length > 0 || canCreateNew) && (
					<div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-[8px] border border-bd-2 bg-bg shadow-lg">
						{filteredSuggestions.map(tag => (
							<Button
								key={tag.id}
								onMouseDown={handleSuggestionMouseDown}
								onClick={handleSuggestionClick(tag.name, tag.id)}
								className="flex w-full items-center gap-2 px-3 py-[9px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
							>
								<Typography tag="span" className="flex-1">{tag.name}</Typography>
								<Typography tag="span" className="text-[10.5px] text-t-4">{tag._count.texts}</Typography>
							</Button>
						))}
						{canCreateNew && (
							<Button
								onMouseDown={handleSuggestionMouseDown}
								onClick={handleCreateTagClick}
								className={`flex w-full items-center gap-2 px-3 py-[9px] text-left text-[12.5px] transition-colors hover:bg-acc-muted ${filteredSuggestions.length > 0 ? "border-t border-bd-1" : ""}`}
							>
								<Typography tag="span" className="text-[10px] font-semibold uppercase tracking-wide text-t-3">
									{tagsCreate}
								</Typography>
								<Typography tag="span" className="text-acc-strong">{tagInputValue.trim()}</Typography>
							</Button>
						)}
					</div>
				)}
			</div>
			<Typography tag="p" className="mt-1.5 text-[10.5px] text-t-3">
				{tagsHint}
			</Typography>
		</MetaSection>
	);
};
