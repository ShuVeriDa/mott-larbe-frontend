"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { textScriptVersionApi } from "../api/text-script-version-api";
import { textScriptVersionKeys } from "../api/text-script-version-keys";
import { textKeys } from "../../text/api";
import type { ChScript } from "../api/types";

export const useGenerateScriptVersion = (textId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (script: ChScript) =>
			textScriptVersionApi.generate(textId, script),
		onSuccess: (_data, script) => {
			qc.invalidateQueries({ queryKey: textScriptVersionKeys.versions(textId) });
			qc.invalidateQueries({ queryKey: textKeys.scriptPages(textId) });
		},
	});
};

export const useUpdateScriptPage = (textId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			script,
			pageNumber,
			contentRich,
		}: {
			script: ChScript;
			pageNumber: number;
			contentRich: Record<string, unknown>;
		}) => textScriptVersionApi.updatePage(textId, script, pageNumber, contentRich),
		onSuccess: (_data, { script, pageNumber }) =>
			qc.invalidateQueries({
				queryKey: textScriptVersionKeys.page(textId, pageNumber, script),
			}),
	});
};

export const useDeleteScriptVersion = (textId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (script: ChScript) =>
			textScriptVersionApi.deleteVersion(textId, script),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: textScriptVersionKeys.versions(textId) }),
	});
};

export const useGenerateUserScriptVersion = (userTextId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (script: ChScript) =>
			textScriptVersionApi.generateForUser(userTextId, script),
		onSuccess: () => {
			qc.invalidateQueries({
				queryKey: textScriptVersionKeys.userVersions(userTextId),
			});
			qc.invalidateQueries({ queryKey: textKeys.scriptPages(userTextId) });
		},
	});
};

export const useUpdateUserScriptPage = (userTextId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({
			script,
			pageNumber,
			contentRich,
		}: {
			script: ChScript;
			pageNumber: number;
			contentRich: Record<string, unknown>;
		}) =>
			textScriptVersionApi.updateUserPage(
				userTextId,
				script,
				pageNumber,
				contentRich,
			),
		onSuccess: (_data, { script, pageNumber }) =>
			qc.invalidateQueries({
				queryKey: textScriptVersionKeys.userPage(userTextId, pageNumber, script),
			}),
	});
};

export const useDeleteUserScriptVersion = (userTextId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (script: ChScript) =>
			textScriptVersionApi.deleteUserVersion(userTextId, script),
		onSuccess: () =>
			qc.invalidateQueries({
				queryKey: textScriptVersionKeys.userVersions(userTextId),
			}),
	});
};
