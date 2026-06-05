import type { Notification } from "@/entities/notification";

export const getNotificationHref = (lang: string, n: Notification): string => {
	switch (n.type) {
		case "FEEDBACK_REPLY":
			return `/${lang}/feedback/${n.entityId}`;
		case "SUGGESTION_APPROVED":
		case "SUGGESTION_REJECTED":
			return `/${lang}/suggestions`;
		case "TEXT_SUBMISSION_APPROVED":
		case "TEXT_SUBMISSION_REJECTED":
			return `/${lang}/my-texts`;
		case "NEW_FEEDBACK_THREAD":
			return `/${lang}/admin/feedback/${n.entityId}`;
		case "NEW_TEXT_SUBMISSION":
			return `/${lang}/admin/text-submissions`;
		case "NEW_SUGGESTION":
			return `/${lang}/admin/suggestions`;
	}
};
