import { useI18n } from "@/shared/lib/i18n";

export interface AnnouncementTemplate {
	key: string;
	title: string;
	body: string;
}

export const useAnnouncementTemplates = (): AnnouncementTemplate[] => {
	const { t } = useI18n();

	return [
		{
			key: "newText",
			title: t("admin.announcements.modal.templates.newText.title"),
			body: t("admin.announcements.modal.templates.newText.body"),
		},
		{
			key: "newBook",
			title: t("admin.announcements.modal.templates.newBook.title"),
			body: t("admin.announcements.modal.templates.newBook.body"),
		},
		{
			key: "newPages",
			title: t("admin.announcements.modal.templates.newPages.title"),
			body: t("admin.announcements.modal.templates.newPages.body"),
		},
		{
			key: "platformUpdate",
			title: t("admin.announcements.modal.templates.platformUpdate.title"),
			body: t("admin.announcements.modal.templates.platformUpdate.body"),
		},
		{
			key: "newFeature",
			title: t("admin.announcements.modal.templates.newFeature.title"),
			body: t("admin.announcements.modal.templates.newFeature.body"),
		},
	];
};
