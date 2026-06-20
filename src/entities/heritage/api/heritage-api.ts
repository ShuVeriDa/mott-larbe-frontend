import { http } from "@/shared/api";
import type {
	CreateGaraDto,
	CreateNationDto,
	CreateTaipDto,
	CreateTukhumDto,
	Gara,
	HeritageListQuery,
	HeritageModerationStats,
	Nation,
	PaginatedResponse,
	PendingHeritageItem,
	PendingHeritageQuery,
	ReviewHeritageGaraDto,
	ReviewHeritageTaipDto,
	Taip,
	Tukhum,
	UpdateGaraDto,
	UpdateNationDto,
	UpdateTaipDto,
	UpdateTukhumDto,
	UpsertUserHeritageDto,
	UserHeritage,
} from "./types";

const buildPaginationParams = (
	q: HeritageListQuery,
): Record<string, number> => {
	const p: Record<string, number> = {};
	if (q.page) p.page = q.page;
	if (q.limit) p.limit = q.limit;
	return p;
};

export const heritageApi = {
	getNations: (query: HeritageListQuery = {}) =>
		http
			.get<PaginatedResponse<Nation>>("/heritage/nations", {
				params: buildPaginationParams(query),
			})
			.then((r) => r.data),

	getTukhum: (nationId: string, query: HeritageListQuery = {}) =>
		http
			.get<PaginatedResponse<Tukhum>>(`/heritage/nations/${nationId}/tukhumy`, {
				params: buildPaginationParams(query),
			})
			.then((r) => r.data),

	getTaipsByNation: (nationId: string, query: HeritageListQuery = {}) =>
		http
			.get<PaginatedResponse<Taip>>(`/heritage/nations/${nationId}/taips`, {
				params: buildPaginationParams(query),
			})
			.then((r) => r.data),

	getTaipsByTukhum: (tukhumId: string, query: HeritageListQuery = {}) =>
		http
			.get<PaginatedResponse<Taip>>(`/heritage/tukhumy/${tukhumId}/taips`, {
				params: buildPaginationParams(query),
			})
			.then((r) => r.data),

	getGarasByTaip: (taipId: string, query: HeritageListQuery = {}) =>
		http
			.get<PaginatedResponse<Gara>>(`/heritage/taips/${taipId}/garas`, {
				params: buildPaginationParams(query),
			})
			.then((r) => r.data),

	getMyHeritage: () =>
		http.get<UserHeritage>("/users/me/heritage").then((r) => r.data),

	getPublicHeritage: (userId: string) =>
		http.get<Partial<UserHeritage>>(`/users/${userId}/heritage`).then((r) => r.data),

	upsertMyHeritage: (dto: UpsertUserHeritageDto) =>
		http.patch<UserHeritage>("/users/me/heritage", dto).then((r) => r.data),

	// Admin CRUD — Nations
	createNation: (dto: CreateNationDto) =>
		http.post<Nation>("/admin/heritage/nations", dto).then((r) => r.data),
	updateNation: (id: string, dto: UpdateNationDto) =>
		http.patch<Nation>(`/admin/heritage/nations/${id}`, dto).then((r) => r.data),
	deleteNation: (id: string) =>
		http.delete(`/admin/heritage/nations/${id}`).then((r) => r.data),

	// Admin CRUD — Tukhumy
	createTukhum: (dto: CreateTukhumDto) =>
		http.post<Tukhum>("/admin/heritage/tukhumy", dto).then((r) => r.data),
	updateTukhum: (id: string, dto: UpdateTukhumDto) =>
		http.patch<Tukhum>(`/admin/heritage/tukhumy/${id}`, dto).then((r) => r.data),
	deleteTukhum: (id: string) =>
		http.delete(`/admin/heritage/tukhumy/${id}`).then((r) => r.data),

	// Admin CRUD — Taips
	createTaip: (dto: CreateTaipDto) =>
		http.post<Taip>("/admin/heritage/taips", dto).then((r) => r.data),
	updateTaip: (id: string, dto: UpdateTaipDto) =>
		http.patch<Taip>(`/admin/heritage/taips/${id}`, dto).then((r) => r.data),
	deleteTaip: (id: string) =>
		http.delete(`/admin/heritage/taips/${id}`).then((r) => r.data),

	// Admin CRUD — Garas
	createGara: (dto: CreateGaraDto) =>
		http.post<Gara>("/admin/heritage/garas", dto).then((r) => r.data),
	updateGara: (id: string, dto: UpdateGaraDto) =>
		http.patch<Gara>(`/admin/heritage/garas/${id}`, dto).then((r) => r.data),
	deleteGara: (id: string) =>
		http.delete(`/admin/heritage/garas/${id}`).then((r) => r.data),

	// Admin Moderation
	getPendingHeritage: (query: PendingHeritageQuery = {}) => {
		const params: Record<string, unknown> = {};
		if (query.page) params.page = query.page;
		if (query.limit) params.limit = query.limit;
		if (query.type) params.type = query.type;
		return http
			.get<PaginatedResponse<PendingHeritageItem>>("/admin/heritage/pending", { params })
			.then((r) => r.data);
	},

	getModerationStats: () =>
		http.get<HeritageModerationStats>("/admin/heritage/stats").then((r) => r.data),

	reviewTaip: (heritageId: string, dto: ReviewHeritageTaipDto) =>
		http.patch(`/admin/heritage/${heritageId}/taip`, dto).then((r) => r.data),

	reviewGara: (heritageId: string, dto: ReviewHeritageGaraDto) =>
		http.patch(`/admin/heritage/${heritageId}/gara`, dto).then((r) => r.data),
};
