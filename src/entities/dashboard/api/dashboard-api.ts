import { http } from "@/shared/api";
import type { DashboardResponse } from "./types";

export const dashboardApi = {
	me: async (): Promise<DashboardResponse> => {
		const { data } = await http.get<DashboardResponse>("/dashboard/me");
		return data;
	},
};
