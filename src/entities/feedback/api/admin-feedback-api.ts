import { http } from "@/shared/api";
import type {
	AdminFeedbackMessage,
	AdminFeedbackStats,
	AdminFeedbackThread,
	AssignFeedbackDto,
	GetAdminFeedbackDto,
	AdminReplyDto,
	PaginatedAdminFeedback,
	TransferFeedbackDto,
	UpdateFeedbackPriorityDto,
	UpdateFeedbackStatusDto,
} from "./admin-types";
import type { AdminFeedbackAssignee } from "./admin-types";

export const adminFeedbackApi = {
	list: async (query: GetAdminFeedbackDto = {}): Promise<PaginatedAdminFeedback> => {
		const params: Record<string, unknown> = {
			page: query.page ?? 1,
			limit: query.limit ?? 25,
		};
		if (query.tab) params.tab = query.tab;
		if (query.type) params.type = query.type;
		if (query.status) params.status = query.status;
		if (query.priority) params.priority = query.priority;
		if (query.search) params.search = query.search;

		const { data } = await http.get<PaginatedAdminFeedback>("/admin/feedback", { params });
		return data;
	},

	getById: async (threadId: string): Promise<AdminFeedbackThread> => {
		const { data } = await http.get<AdminFeedbackThread>(`/admin/feedback/${threadId}`);
		return data;
	},

	getStats: async (): Promise<AdminFeedbackStats> => {
		const { data } = await http.get<AdminFeedbackStats>("/admin/feedback/stats");
		return data;
	},

	getAssignees: async (): Promise<AdminFeedbackAssignee[]> => {
		const { data } = await http.get<AdminFeedbackAssignee[]>("/admin/feedback/assignees");
		return data;
	},

	reply: async (threadId: string, dto: AdminReplyDto): Promise<AdminFeedbackMessage> => {
		const { data } = await http.post<AdminFeedbackMessage>(
			`/admin/feedback/${threadId}/messages`,
			dto,
		);
		return data;
	},

	updateStatus: async (
		threadId: string,
		dto: UpdateFeedbackStatusDto,
	): Promise<AdminFeedbackThread> => {
		const { data } = await http.patch<AdminFeedbackThread>(
			`/admin/feedback/${threadId}/status`,
			dto,
		);
		return data;
	},

	updatePriority: async (
		threadId: string,
		dto: UpdateFeedbackPriorityDto,
	): Promise<AdminFeedbackThread> => {
		const { data } = await http.patch<AdminFeedbackThread>(
			`/admin/feedback/${threadId}/priority`,
			dto,
		);
		return data;
	},

	assign: async (threadId: string, dto: AssignFeedbackDto): Promise<AdminFeedbackThread> => {
		const { data } = await http.patch<AdminFeedbackThread>(
			`/admin/feedback/${threadId}/assignee`,
			dto,
		);
		return data;
	},

	markRead: async (threadId: string): Promise<{ success: true; marked: number }> => {
		const { data } = await http.patch<{ success: true; marked: number }>(
			`/admin/feedback/${threadId}/read`,
		);
		return data;
	},

	transfer: async (
		threadId: string,
		dto: TransferFeedbackDto,
	): Promise<{ thread: AdminFeedbackThread }> => {
		const { data } = await http.post<{ thread: AdminFeedbackThread }>(
			`/admin/feedback/${threadId}/transfer`,
			dto,
		);
		return data;
	},

	deleteThread: async (threadId: string): Promise<{ success: true }> => {
		const { data } = await http.delete<{ success: true }>(`/admin/feedback/${threadId}`);
		return data;
	},

	export: async (query: GetAdminFeedbackDto & { format?: "json" | "csv" } = {}): Promise<Blob> => {
		const params: Record<string, unknown> = { format: query.format ?? "csv" };
		if (query.tab) params.tab = query.tab;
		if (query.type) params.type = query.type;
		if (query.status) params.status = query.status;
		if (query.search) params.search = query.search;

		const { data } = await http.get<Blob>("/admin/feedback/export", {
			params,
			responseType: "blob",
		});
		return data;
	},
};
