import { http } from "@/shared/api";
import type {
	CreateTextSubmissionDto,
	GetMyTextSubmissionsParams,
	GetTextSubmissionsParams,
	ReviewTextSubmissionDto,
	TextSubmission,
	TextSubmissionStats,
	TextSubmissionsListResponse,
} from "./types";

export const textSubmissionsApi = {
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

	async getById(id: string): Promise<TextSubmission> {
		const { data } = await http.get<TextSubmission>(`/text-submissions/${id}`);
		return data;
	},

	async review(id: string, dto: ReviewTextSubmissionDto): Promise<TextSubmission> {
		const { data } = await http.post<TextSubmission>(`/text-submissions/${id}/review`, dto);
		return data;
	},
};
