import { http } from "@/shared/api";
import type {
	CreateTextSubmissionDto,
	GetMyTextSubmissionsParams,
	GetTextSubmissionsParams,
	ReviewTextSubmissionDto,
	TextSubmission,
	TextSubmissionStats,
	TextSubmissionsListResponse,
	UpdateTextSubmissionDto,
} from "./types";

export const textSubmissionsApi = {
	// ─── Existing methods — unchanged ────────────────────────────────────────

	async create(dto: CreateTextSubmissionDto): Promise<TextSubmission> {
		const { data } = await http.post<TextSubmission>("/text-submissions", dto);
		return data;
	},

	async getMine(params?: GetMyTextSubmissionsParams): Promise<TextSubmissionsListResponse> {
		const { data } = await http.get<TextSubmissionsListResponse>("/text-submissions/my", { params });
		return data;
	},

	async getStats(): Promise<TextSubmissionStats> {
		const { data } = await http.get<TextSubmissionStats>("/text-submissions/stats");
		return data;
	},

	async getAll(params?: GetTextSubmissionsParams): Promise<TextSubmissionsListResponse> {
		const { data } = await http.get<TextSubmissionsListResponse>("/text-submissions", { params });
		return data;
	},

	// Admin-only GET — hits GET /text-submissions/:id (requires CAN_MANAGE_SUGGESTIONS)
	async getById(id: string): Promise<TextSubmission> {
		const { data } = await http.get<TextSubmission>(`/text-submissions/${id}`);
		return data;
	},

	async review(id: string, dto: ReviewTextSubmissionDto): Promise<TextSubmission> {
		const { data } = await http.post<TextSubmission>(`/text-submissions/${id}/review`, dto);
		return data;
	},

	// ─── New methods (owner draft lifecycle) ─────────────────────────────────

	// Owner-scoped GET with full content — hits GET /text-submissions/:id/draft
	// Separate from admin getById: no admin permission required, returns 404 for non-owner.
	async getOwnedById(id: string): Promise<TextSubmission> {
		const { data } = await http.get<TextSubmission>(`/text-submissions/${id}/draft`);
		return data;
	},

	async update(id: string, dto: UpdateTextSubmissionDto): Promise<TextSubmission> {
		const { data } = await http.patch<TextSubmission>(`/text-submissions/${id}`, dto);
		return data;
	},

	async remove(id: string): Promise<void> {
		await http.delete(`/text-submissions/${id}`);
	},

	// Transitions DRAFT|REJECTED → PENDING
	async submit(id: string): Promise<TextSubmission> {
		const { data } = await http.post<TextSubmission>(`/text-submissions/${id}/submit`);
		return data;
	},
};
