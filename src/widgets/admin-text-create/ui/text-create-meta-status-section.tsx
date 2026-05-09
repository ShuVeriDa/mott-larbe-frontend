"use client";

import { ComponentProps } from "react";
import type { TextLanguage, TextStatus } from "@/entities/admin-text";
import {
	FieldSelect,
	MetaSection,
} from "@/shared/ui/admin-text-meta-fields";

interface Props {
	status: TextStatus;
	language: TextLanguage;
	labels: {
		statusSection: string;
		langLabel: string;
		langChe: string;
		langRu: string;
	};
	onStatusChange: (v: TextStatus) => void;
	onLanguageChange: (v: TextLanguage) => void;
}

export const TextCreateMetaStatusSection = ({
	status,
	language,
	labels,
	onStatusChange,
	onLanguageChange,
}: Props) => {
	const handleStatusChange: NonNullable<ComponentProps<typeof FieldSelect>["onChange"]> = e =>
		onStatusChange(e.currentTarget.value as TextStatus);
	const handleLanguageChange: NonNullable<ComponentProps<typeof FieldSelect>["onChange"]> = e =>
		onLanguageChange(e.currentTarget.value as TextLanguage);

	return (
		<>
			<MetaSection title={labels.statusSection}>
				<FieldSelect value={status} onChange={handleStatusChange}>
					<option value="draft">Draft</option>
					<option value="published">Published</option>
					<option value="archived">Archived</option>
				</FieldSelect>
			</MetaSection>

			<MetaSection title={labels.langLabel}>
				<FieldSelect value={language} onChange={handleLanguageChange}>
					<option value="CHE">{labels.langChe}</option>
					<option value="RU">{labels.langRu}</option>
				</FieldSelect>
			</MetaSection>
		</>
	);
};
