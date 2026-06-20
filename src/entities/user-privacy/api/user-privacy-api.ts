import { http } from "@/shared/api";
import type { UpdatePrivacyDto, UserPrivacySettings } from "./types";

export const userPrivacyApi = {
	getMyPrivacy: () =>
		http.get<UserPrivacySettings>("/users/me/privacy").then((r) => r.data),

	updateMyPrivacy: (dto: UpdatePrivacyDto) =>
		http.patch<UserPrivacySettings>("/users/me/privacy", dto).then((r) => r.data),
};
