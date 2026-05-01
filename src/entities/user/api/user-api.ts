import { http } from "@/shared/api";
import type { UpdateUserDto, UserProfile } from "./types";

export const userApi = {
	getMe: async (): Promise<UserProfile> => {
		const { data } = await http.get<UserProfile>("/users/me");
		return data;
	},

	update: async (dto: UpdateUserDto): Promise<UserProfile> => {
		const { data } = await http.patch<UserProfile>("/users", dto);
		return data;
	},
};
