import { http } from "@/shared/api";
import type { ChScript, TextScriptVersionInfo, TextScriptPage } from "./types";

export const textScriptVersionApi = {
	// ─── Library texts ──────────────────────────────────────────────────────

	getVersions: async (textId: string): Promise<TextScriptVersionInfo[]> => {
		const { data } = await http.get<TextScriptVersionInfo[]>(
			`/texts/${textId}/script-versions`,
		);
		return data;
	},

	generate: async (textId: string, script: ChScript): Promise<void> => {
		await http.post(`/admin/texts/${textId}/script-versions`, { script });
	},

	updatePage: async (
		textId: string,
		script: ChScript,
		pageNumber: number,
		contentRich: Record<string, unknown>,
	): Promise<TextScriptPage> => {
		const { data } = await http.patch<TextScriptPage>(
			`/admin/texts/${textId}/script-versions/${script}/pages/${pageNumber}`,
			{ contentRich },
		);
		return data;
	},

	deleteVersion: async (textId: string, script: ChScript): Promise<void> => {
		await http.delete(`/admin/texts/${textId}/script-versions/${script}`);
	},

	// ─── User texts ──────────────────────────────────────────────────────────

	getUserVersions: async (userTextId: string): Promise<TextScriptVersionInfo[]> => {
		const { data } = await http.get<TextScriptVersionInfo[]>(
			`/user-texts/${userTextId}/script-versions`,
		);
		return data;
	},

	generateForUser: async (userTextId: string, script: ChScript): Promise<void> => {
		await http.post(`/user-texts/${userTextId}/script-versions`, { script });
	},

	updateUserPage: async (
		userTextId: string,
		script: ChScript,
		pageNumber: number,
		contentRich: Record<string, unknown>,
	): Promise<TextScriptPage> => {
		const { data } = await http.patch<TextScriptPage>(
			`/user-texts/${userTextId}/script-versions/${script}/pages/${pageNumber}`,
			{ contentRich },
		);
		return data;
	},

	deleteUserVersion: async (userTextId: string, script: ChScript): Promise<void> => {
		await http.delete(`/user-texts/${userTextId}/script-versions/${script}`);
	},
};
