import type { HeritageModerationSubjectType } from "@/entities/heritage";

export type ModerationTypeFilter = HeritageModerationSubjectType | "ALL";

export interface ReviewFormState {
	action: "verify" | "reject" | null;
	rejectReason: string;
	addToDirectory: boolean;
	tukhumId: string;
	nationId: string;
	taipId: string;
}
