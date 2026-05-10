"use client";

import { useI18n } from "@/shared/lib/i18n";
import { AdminTextTopbarShell } from "@/shared/ui/admin-text-editor";
import { Upload } from "lucide-react";
import type { SaveState } from "../model/use-admin-text-create-page";

interface TextCreateTopbarProps {
	saveState: SaveState;
	isSaving: boolean;
	isMetaPanelVisible: boolean;
	onSaveDraft: () => void;
	onPublish: () => void;
	onToggleMetaPanel: () => void;
}

export const TextCreateTopbar = ({
	saveState,
	isSaving,
	isMetaPanelVisible,
	onSaveDraft,
	onPublish,
	onToggleMetaPanel,
}: TextCreateTopbarProps) => {
	const { t } = useI18n();

	const statusLabel =
		saveState === "saving"
			? t("admin.texts.createPage.saving")
			: saveState === "unsaved"
				? t("admin.texts.createPage.unsaved")
				: saveState === "saved"
					? t("admin.texts.createPage.draftSaved")
					: null;
	return (
		<AdminTextTopbarShell
			breadcrumbTitle={t("admin.texts.createPage.newText")}
			backAriaLabel={t("admin.texts.createPage.back")}
			settingsAriaLabel={t("admin.texts.createPage.sections.settings")}
			settingsLabel={t("admin.texts.createPage.sections.settings")}
			saveDraftAriaLabel={t("admin.texts.createPage.saveDraft")}
			saveDraftLabel={t("admin.texts.createPage.saveDraft")}
			primaryActionAriaLabel={t("admin.texts.createPage.publish")}
			primaryActionLabel={t("admin.texts.createPage.publish")}
			primaryActionIcon={<Upload className="size-3" />}
			isSaving={isSaving}
			isMetaPanelVisible={isMetaPanelVisible}
			statusLabel={statusLabel}
			showUnsavedPulse={saveState === "unsaved"}
			showSavedCheck={saveState === "saved"}
			onSaveDraft={onSaveDraft}
			onPrimaryAction={onPublish}
			onToggleMetaPanel={onToggleMetaPanel}
		/>
	);
};
