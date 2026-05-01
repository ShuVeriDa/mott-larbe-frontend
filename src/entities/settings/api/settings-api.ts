import { http } from "@/shared/api";
import type {
	AllSettings,
	ExportFormat,
	UpdateGoalsDto,
	UpdateNotificationsDto,
	UpdatePreferencesDto,
	UserGoals,
	UserNotifications,
	UserPreferences,
} from "./types";

export const settingsApi = {
	getAll: async (): Promise<AllSettings> => {
		const { data } = await http.get<AllSettings>("/settings");
		return data;
	},

	updatePreferences: async (
		dto: UpdatePreferencesDto,
	): Promise<UserPreferences> => {
		const { data } = await http.patch<UserPreferences>(
			"/settings/preferences",
			dto,
		);
		return data;
	},

	updateGoals: async (dto: UpdateGoalsDto): Promise<UserGoals> => {
		const { data } = await http.patch<UserGoals>("/settings/goals", dto);
		return data;
	},

	updateNotifications: async (
		dto: UpdateNotificationsDto,
	): Promise<UserNotifications> => {
		const { data } = await http.patch<UserNotifications>(
			"/settings/notifications",
			dto,
		);
		return data;
	},

	exportVocabulary: async (format: ExportFormat): Promise<Blob> => {
		const { data } = await http.get("/settings/export/vocabulary", {
			params: { format },
			responseType: "blob",
		});
		return data as Blob;
	},

	exportProgress: async (): Promise<Blob> => {
		const { data } = await http.get("/settings/export/progress", {
			responseType: "blob",
		});
		return data as Blob;
	},

	exportArchive: async (): Promise<Blob> => {
		const { data } = await http.get("/settings/export/archive", {
			responseType: "blob",
		});
		return data as Blob;
	},

	resetProgress: async (): Promise<{ success: boolean }> => {
		const { data } = await http.post<{ success: boolean }>(
			"/settings/reset/progress",
		);
		return data;
	},

	clearVocabulary: async (): Promise<{ success: boolean }> => {
		const { data } = await http.post<{ success: boolean }>(
			"/settings/reset/vocabulary",
		);
		return data;
	},

	deleteAccount: async (
		confirmEmail: string,
	): Promise<{ success: boolean; message: string }> => {
		const { data } = await http.delete<{ success: boolean; message: string }>(
			"/users",
			{ data: { confirmEmail } },
		);
		return data;
	},
};
