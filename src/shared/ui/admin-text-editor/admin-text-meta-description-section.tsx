"use client";

import { MetaSection } from "@/shared/ui/admin-text-meta-fields";
import { ComponentProps } from "react";

interface AdminTextMetaDescriptionSectionProps {
	description: string;
	sectionTitle: string;
	placeholder: string;
	onDescriptionChange: (v: string) => void;
}

export const AdminTextMetaDescriptionSection = ({
	description,
	sectionTitle,
	placeholder,
	onDescriptionChange,
}: AdminTextMetaDescriptionSectionProps) => {
	const handleDescriptionChange: NonNullable<
		ComponentProps<"textarea">["onChange"]
	> = e => onDescriptionChange(e.currentTarget.value);

	return (
		<MetaSection title={sectionTitle}>
			<textarea
				value={description}
				onChange={handleDescriptionChange}
				placeholder={placeholder}
				rows={3}
				maxLength={1000}
				className="w-full resize-y rounded-base border border-bd-2 bg-surf px-2.5 py-2 text-[13px] leading-relaxed text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
				style={{ minHeight: "68px" }}
			/>
		</MetaSection>
	);
};
