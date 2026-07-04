"use client";

import {
	FieldSelect,
	MetaSection,
} from "@/shared/ui/admin-text-meta-fields";
import { useI18n } from "@/shared/lib/i18n";
import { LANGUAGES, type AppLanguage } from "@/shared/lib/languages";
import type { ComponentProps } from "react";
import { LANGUAGE_I18N_KEY } from "./lib/language-i18n-key";

type TextStatus = "draft" | "published" | "archived";
type TextLanguage = AppLanguage;

interface AdminTextMetaStatusSectionLabels {
	statusSection: string;
	statusDraft: string;
	statusPublished: string;
	statusArchived: string;
	langLabel: string;
}

interface AdminTextMetaStatusSectionProps {
	status: TextStatus;
	language: TextLanguage;
	labels: AdminTextMetaStatusSectionLabels;
	onStatusChange: (v: TextStatus) => void;
	onLanguageChange: (v: TextLanguage) => void;
}

export const AdminTextMetaStatusSection = ({
	status,
	language,
	labels,
	onStatusChange,
	onLanguageChange,
}: AdminTextMetaStatusSectionProps) => {
	const { t } = useI18n();

	const handleStatusChange: NonNullable<
		ComponentProps<typeof FieldSelect>["onChange"]
	> = e => onStatusChange(e.currentTarget.value as TextStatus);
	const handleLanguageChange: NonNullable<
		ComponentProps<typeof FieldSelect>["onChange"]
	> = e => onLanguageChange(e.currentTarget.value as TextLanguage);

	return (
		<>
			<MetaSection title={labels.statusSection}>
				<FieldSelect value={status} onChange={handleStatusChange}>
					<option value="draft">{labels.statusDraft}</option>
					<option value="published">{labels.statusPublished}</option>
					<option value="archived">{labels.statusArchived}</option>
				</FieldSelect>
			</MetaSection>

			<MetaSection title={labels.langLabel}>
				<FieldSelect value={language} onChange={handleLanguageChange}>
					{LANGUAGES.map(l => (
						<option key={l.code} value={l.code}>
							{t(LANGUAGE_I18N_KEY[l.code])}
						</option>
					))}
				</FieldSelect>
			</MetaSection>
		</>
	);
};
