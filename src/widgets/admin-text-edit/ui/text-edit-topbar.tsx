"use client";

import { useI18n } from "@/shared/lib/i18n";
import { AdminTextTopbarShell } from "@/shared/ui/admin-text-editor";
import { Typography } from "@/shared/ui/typography";
import { Check, ExternalLink } from "lucide-react";

interface TextEditTopbarProps {
	textId: string;
	textTitle: string;
	textStatus: string;
	isUnsaved: boolean;
	isSaving: boolean;
	isMetaPanelVisible: boolean;
	onSaveDraft: () => void;
	onSaveAndUpdate: () => void;
	onToggleMetaPanel: () => void;
}

export const TextEditTopbar = ({
	textId,
	textTitle,
	textStatus,
	isUnsaved,
	isSaving,
	isMetaPanelVisible,
	onSaveDraft,
	onSaveAndUpdate,
	onToggleMetaPanel,
}: TextEditTopbarProps) => {
	const { t, lang } = useI18n();
	const statusLabel = isSaving
		? t("admin.texts.editPage.saving")
		: isUnsaved
			? t("admin.texts.editPage.unsaved")
			: t("admin.texts.editPage.saved");

	const leftAfterBreadcrumb = (
		<Typography
			tag="span"
			className="shrink-0 rounded-[5px] border border-bd-2 bg-surf-2 px-2 py-[2px] font-mono text-[10.5px] text-t-3 max-[767px]:hidden"
		>
			#{textId.slice(0, 8)}
		</Typography>
	);

	const rightBeforeStatus = (
		<>
			{textStatus === "published" ? (
				<a
					href={`/${lang}/texts/${textId}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 max-[767px]:hidden"
					aria-label={t("admin.texts.editPage.preview")}
				>
					<ExternalLink className="size-3" />
					{t("admin.texts.editPage.preview")}
				</a>
			) : null}
		</>
	);

	return (
		<AdminTextTopbarShell
			breadcrumbTitle={textTitle || t("admin.texts.editPage.editing")}
			backAriaLabel={t("admin.texts.editPage.back")}
			settingsAriaLabel={t("admin.texts.createPage.sections.settings")}
			settingsLabel={t("admin.texts.createPage.sections.settings")}
			saveDraftAriaLabel={t("admin.texts.editPage.saveDraft")}
			saveDraftLabel={t("admin.texts.editPage.saveDraft")}
			primaryActionAriaLabel={t("admin.texts.editPage.saveUpdate")}
			primaryActionLabel={
				isSaving
					? t("admin.texts.editPage.saving")
					: t("admin.texts.editPage.saveUpdate")
			}
			primaryActionIcon={<Check className="size-3" />}
			isSaving={isSaving}
			isMetaPanelVisible={isMetaPanelVisible}
			statusLabel={statusLabel}
			showUnsavedPulse={isUnsaved}
			showSavedCheck={!isSaving && !isUnsaved}
			leftAfterBreadcrumb={leftAfterBreadcrumb}
			rightBeforeStatus={rightBeforeStatus}
			onSaveDraft={onSaveDraft}
			onPrimaryAction={onSaveAndUpdate}
			onToggleMetaPanel={onToggleMetaPanel}
		/>
	);
};
