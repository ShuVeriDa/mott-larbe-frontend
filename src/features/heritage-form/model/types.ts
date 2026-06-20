import type { VerificationStatus } from "@/entities/heritage";

export type NationMode = "nakhchiy" | "other" | null;

export interface HeritageFormValues {
	nationId: string | null;
	tukhumId: string | null;
	hasTukhum: boolean | null;
	taipId: string | null;
	taipCustom: string | null;
	garaId: string | null;
	garaCustom: string | null;
	nekyi: string | null;
	otherNationId: string | null;
}

export interface HeritageFormState {
	success: boolean;
	error: string | null;
}

export interface VerificationInfo {
	status: VerificationStatus | null;
	customValue: string | null;
}
