import type { TipTapDoc } from "@/entities/text";

export type ChScript = "LATIN" | "ARABIC";
export type ScriptVersionStatus = "IDLE" | "RUNNING" | "COMPLETED" | "ERROR";

export interface TextScriptVersionInfo {
	script: ChScript;
	status: ScriptVersionStatus;
	errorMessage: string | null;
	updatedAt: string;
}

export interface TextScriptPage {
	pageNumber: number;
	contentRich: TipTapDoc;
}
