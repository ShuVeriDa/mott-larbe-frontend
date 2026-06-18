import type { Notification } from "@/entities/notification";

export const getNotificationHref = (lang: string, n: Notification): string | null => {
	switch (n.type) {
		case "FEEDBACK_REPLY":
			return `/${lang}/feedback?thread=${n.entityId}`;
		case "SUGGESTION_APPROVED":
		case "SUGGESTION_REJECTED":
			return `/${lang}/suggestions?suggestion=${n.entityId}`;
		case "TEXT_SUBMISSION_APPROVED":
		case "TEXT_SUBMISSION_REJECTED":
			return `/${lang}/suggestions?submission=${n.entityId}`;
		case "NEW_FEEDBACK_THREAD":
			return `/${lang}/admin/feedback?thread=${n.entityId}`;
		case "NEW_TEXT_SUBMISSION":
			return `/${lang}/admin/text-submissions?submission=${n.entityId}`;
		case "NEW_SUGGESTION":
			return `/${lang}/admin/suggestions?suggestion=${n.entityId}`;
		case "NEW_LIBRARY_TEXT":
			return `/${lang}/texts/${n.entityId}`;
		case "PLATFORM_ANNOUNCEMENT":
			return n.entityId ? `/${lang}/texts/${n.entityId}` : null;
	}
};
