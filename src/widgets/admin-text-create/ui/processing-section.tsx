"use client";

import { MetaSection, MetaToggle } from "@/shared/ui/admin-text-meta-fields";
import { useI18n } from "@/shared/lib/i18n";

interface ProcessingSectionProps {
	autoTokenizeOnSave: boolean;
	useNormalization: boolean;
	useMorphAnalysis: boolean;
	t: ReturnType<typeof useI18n>["t"];
	onAutoTokenizeChange: (v: boolean) => void;
	onNormalizationChange: (v: boolean) => void;
	onMorphAnalysisChange: (v: boolean) => void;
}

export const ProcessingSection = ({
	autoTokenizeOnSave,
	useNormalization,
	useMorphAnalysis,
	t,
	onAutoTokenizeChange,
	onNormalizationChange,
	onMorphAnalysisChange,
}: ProcessingSectionProps) => (
	<MetaSection title={t("admin.texts.editPage.sections.tokenization")}>
		<div className="mb-2.5 flex items-center justify-between gap-2">
			<div>
				<div className="text-xs text-t-1">{t("admin.texts.createPage.tokenizeLabel")}</div>
				<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.tokenizeSub")}</div>
			</div>
			<MetaToggle checked={autoTokenizeOnSave} onChange={onAutoTokenizeChange} />
		</div>
		<div className="mb-2.5 flex items-center justify-between gap-2">
			<div>
				<div className="text-xs text-t-1">{t("admin.texts.createPage.normalizationLabel")}</div>
				<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.normalizationSub")}</div>
			</div>
			<MetaToggle checked={useNormalization} onChange={onNormalizationChange} />
		</div>
		<div className="flex items-center justify-between gap-2">
			<div>
				<div className="text-xs text-t-1">{t("admin.texts.createPage.morphLabel")}</div>
				<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.morphSub")}</div>
			</div>
			<MetaToggle checked={useMorphAnalysis} onChange={onMorphAnalysisChange} />
		</div>
	</MetaSection>
);
