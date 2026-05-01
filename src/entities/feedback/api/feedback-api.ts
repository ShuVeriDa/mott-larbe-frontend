import { http } from "@/shared/api";
import type {
	AddMessageDto,
	CreateFeedbackDto,
	FeedbackMessage,
	FeedbackThread,
	GetFeedbackDto,
	PaginatedFeedback,
	UnreadCountResponse,
} from "./types";

export const feedbackApi = {
	list: async (query: GetFeedbackDto = {}): Promise<PaginatedFeedback> => {
		const { data } = await http.get<PaginatedFeedback>("/feedback", {
			params: {
				...(query.type ? { type: query.type } : {}),
				...(query.status ? { status: query.status } : {}),
				page: query.page ?? 1,
				limit: query.limit ?? 20,
			},
		});
		return data;
	},

	getById: async (threadId: string): Promise<FeedbackThread> => {
		const { data } = await http.get<FeedbackThread>(`/feedback/${threadId}`);
		return data;
	},

	getUnreadCount: async (): Promise<UnreadCountResponse> => {
		const { data } =
			await http.get<UnreadCountResponse>("/feedback/unread-count");
		return data;
	},

	create: async (dto: CreateFeedbackDto): Promise<FeedbackThread> => {
		const { data } = await http.post<FeedbackThread>("/feedback", dto);
		return data;
	},

	addMessage: async (
		threadId: string,
		dto: AddMessageDto,
	): Promise<FeedbackMessage> => {
		const { data } = await http.post<FeedbackMessage>(
			`/feedback/${threadId}/messages`,
			dto,
		);
		return data;
	},

	markRead: async (threadId: string): Promise<{ success: true }> => {
		const { data } = await http.patch<{ success: true }>(
			`/feedback/${threadId}/read`,
		);
		return data;
	},
};
