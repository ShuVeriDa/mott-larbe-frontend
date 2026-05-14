import { http } from "@/shared/api";
import type {
	AdminTextDetail,
	AdminTextListItem,
	AdminTextUnknownWords,
	AdminTextsListResponse,
	AdminTextsStats,
	BulkImportResult,
	BulkTextsResult,
	CreateTextDto,
	FetchAdminTextsQuery,
	ProcessResult,
	ProcessTextDto,
	ProcessingStatus,
	PublishResult,
	RestoreVersionResult,
	RetryVersionResult,
	TextVersionDetail,
	TextVersionsListResponse,
	UpdateTextDto,
} from "./types";

export const adminTextApi = {
	list: async (query: FetchAdminTextsQuery = {}): Promise<AdminTextsListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.search) params.search = query.search;
		if (query.level) params.level = query.level;
		if (query.tagId) params.tagId = query.tagId;
		if (query.status && query.status !== "all") params.status = query.status;
		if (query.sortBy) params.sortBy = query.sortBy;
		if (query.sortOrder) params.sortOrder = query.sortOrder;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 20;

		const { data } = await http.get<{ data: AdminTextListItem[]; total: number; page: number; limit: number }>("/admin/texts", { params });
		return { items: data.data, total: data.total, page: data.page, limit: data.limit };
	},

	stats: async (): Promise<AdminTextsStats> => {
		const { data } = await http.get<AdminTextsStats>("/admin/texts/stats");
		return data;
	},

	publish: async (id: string): Promise<PublishResult> => {
		const { data } = await http.post<PublishResult>(`/admin/texts/${id}/publish`);
		return data;
	},

	unpublish: async (id: string): Promise<PublishResult> => {
		const { data } = await http.post<PublishResult>(`/admin/texts/${id}/unpublish`);
		return data;
	},

	process: async (id: string, dto: ProcessTextDto): Promise<ProcessResult> => {
		const { data } = await http.post<ProcessResult>(`/admin/texts/${id}/process`, dto);
		return data;
	},

	tokenize: async (id: string): Promise<ProcessResult> => {
		const { data } = await http.post<ProcessResult>(`/admin/texts/${id}/tokenize`);
		return data;
	},

	clearDictionaryCache: async (id: string): Promise<{ deleted: number }> => {
		const { data } = await http.post<{ deleted: number }>(`/admin/texts/${id}/clear-cache`);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/admin/texts/${id}`);
	},

	bulkPublish: async (ids: string[]): Promise<BulkTextsResult> => {
		const { data } = await http.post<BulkTextsResult>("/admin/texts/bulk/publish", { ids });
		return data;
	},

	bulkUnpublish: async (ids: string[]): Promise<BulkTextsResult> => {
		const { data } = await http.post<BulkTextsResult>("/admin/texts/bulk/unpublish", { ids });
		return data;
	},

	bulkTokenize: async (ids: string[]): Promise<BulkTextsResult> => {
		const { data } = await http.post<BulkTextsResult>("/admin/texts/bulk/tokenize", { ids });
		return data;
	},

	bulkDelete: async (ids: string[]): Promise<BulkTextsResult> => {
		const { data } = await http.post<BulkTextsResult>("/admin/texts/bulk/delete", { ids });
		return data;
	},

	getById: async (id: string): Promise<AdminTextDetail> => {
		const { data } = await http.get<AdminTextDetail>(`/admin/texts/${id}`);
		return data;
	},

	create: async (dto: CreateTextDto): Promise<AdminTextDetail> => {
		const { data } = await http.post<AdminTextDetail>("/admin/texts", dto);
		return data;
	},

	update: async (id: string, dto: UpdateTextDto): Promise<AdminTextDetail> => {
		const { data } = await http.patch<AdminTextDetail>(`/admin/texts/${id}`, dto);
		return data;
	},

	uploadCover: async (id: string, file: File): Promise<{ imageUrl: string }> => {
		const formData = new FormData();
		formData.append("file", file);
		const { data } = await http.post<{ imageUrl: string }>(
			`/admin/texts/${id}/cover`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
		return data;
	},

	getVersions: async (textId: string, status?: ProcessingStatus): Promise<TextVersionsListResponse> => {
		const params: Record<string, unknown> = {};
		if (status) params.status = status;
		const { data } = await http.get<TextVersionsListResponse>(`/admin/texts/${textId}/versions`, { params });
		return data;
	},

	getVersionDetail: async (textId: string, versionId: string): Promise<TextVersionDetail> => {
		const { data } = await http.get<TextVersionDetail>(`/admin/texts/${textId}/versions/${versionId}`);
		return data;
	},

	restoreVersion: async (textId: string, versionId: string): Promise<RestoreVersionResult> => {
		const { data } = await http.post<RestoreVersionResult>(`/admin/texts/${textId}/versions/${versionId}/restore`);
		return data;
	},

	retryVersion: async (textId: string, versionId: string): Promise<RetryVersionResult> => {
		const { data } = await http.post<RetryVersionResult>(`/admin/texts/${textId}/versions/${versionId}/retry`);
		return data;
	},

	downloadVersion: async (textId: string, versionId: string, versionNumber?: number): Promise<void> => {
		const response = await http.get<Blob>(`/admin/texts/${textId}/versions/${versionId}/download`, {
			responseType: "blob",
		});
		const contentDisposition = (response.headers as Record<string, string>)["content-disposition"] ?? "";
		const serverFilename = contentDisposition.match(/filename="?([^";\n]+)"?/)?.[1];
		const fallbackFilename = versionNumber !== undefined
			? `text-${textId}-v${versionNumber}.json`
			: `text-${textId}-${versionId}.json`;
		const url = URL.createObjectURL(response.data);
		const a = document.createElement("a");
		a.href = url;
		a.download = serverFilename ?? fallbackFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	},

	bulkImport: async (items: CreateTextDto[]): Promise<BulkImportResult> => {
		const { data } = await http.post<BulkImportResult>("/admin/texts/bulk-import", { items });
		return data;
	},

	getUnknownWords: async (textId: string): Promise<AdminTextUnknownWords> => {
		const { data } = await http.get<AdminTextUnknownWords>(`/admin/texts/${textId}/unknown-words`);
		return data;
	},
};
