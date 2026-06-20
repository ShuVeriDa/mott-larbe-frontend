import type { LocalizedName, PaginatedResponse } from "@/shared/types";

export type { LocalizedName, PaginatedResponse };

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface Nation {
	id: string;
	slug: string;
	name: LocalizedName;
}

export interface Tukhum {
	id: string;
	nationId: string;
	name: LocalizedName;
}

export interface Taip {
	id: string;
	nationId: string;
	tukhumId: string | null;
	name: LocalizedName;
}

export interface Gara {
	id: string;
	taipId: string;
	name: LocalizedName;
}

export interface HeritageListQuery {
	page?: number;
	limit?: number;
}

export interface UserHeritage {
	id: string;
	userId: string;

	nationId: string | null;
	nation: Nation | null;

	tukhumId: string | null;
	hasTukhum: boolean | null;

	taipId: string | null;
	taipCustom: string | null;
	taipStatus: VerificationStatus | null;

	garaId: string | null;
	garaCustom: string | null;
	garaStatus: VerificationStatus | null;

	nekyi: string | null;

	otherNationId: string | null;

	regionId: string | null;
	districtId: string | null;
	settlementId: string | null;

	createdAt: string;
	updatedAt: string;
}

export interface UpsertUserHeritageDto {
	nationId?: string | null;
	tukhumId?: string | null;
	hasTukhum?: boolean | null;
	taipId?: string | null;
	taipCustom?: string | null;
	garaId?: string | null;
	garaCustom?: string | null;
	nekyi?: string | null;
	otherNationId?: string | null;
	regionId?: string | null;
	districtId?: string | null;
	settlementId?: string | null;
}

export interface CreateNationDto {
	slug: string;
	name: LocalizedName;
}

export interface UpdateNationDto {
	slug?: string;
	name?: Partial<LocalizedName>;
}

export interface CreateTukhumDto {
	nationId: string;
	name: LocalizedName;
}

export interface UpdateTukhumDto {
	nationId?: string;
	name?: Partial<LocalizedName>;
}

export interface CreateTaipDto {
	nationId: string;
	tukhumId?: string | null;
	name: LocalizedName;
}

export interface UpdateTaipDto {
	nationId?: string;
	tukhumId?: string | null;
	name?: Partial<LocalizedName>;
}

export interface CreateGaraDto {
	taipId: string;
	name: LocalizedName;
}

export interface UpdateGaraDto {
	taipId?: string;
	name?: Partial<LocalizedName>;
}

// ─── Moderation ───────────────────────────────────────────────────────────────

export type HeritageModerationSubjectType = "TAIP" | "GARA";

export interface PendingHeritageItem {
	heritageId: string;
	userId: string;
	username: string | null;
	type: HeritageModerationSubjectType;
	customValue: string;
	nationId: string | null;
	nationName: LocalizedName | null;
	tukhumId: string | null;
	tukhumName: LocalizedName | null;
	createdAt: string;
	updatedAt: string;
}

export interface PendingHeritageQuery {
	page?: number;
	limit?: number;
	type?: HeritageModerationSubjectType;
}

export interface ReviewHeritageTaipDto {
	action: "verify" | "reject";
	addToDirectory?: boolean;
	tukhumId?: string;
	nationId?: string;
	rejectReason?: string;
}

export interface ReviewHeritageGaraDto {
	action: "verify" | "reject";
	addToDirectory?: boolean;
	taipId?: string;
	rejectReason?: string;
}

export interface HeritageModerationStats {
	pending: number;
	verified: number;
	rejected: number;
}
