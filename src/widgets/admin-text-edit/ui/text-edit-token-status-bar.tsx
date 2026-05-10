"use client";

import type { ProcessingStatus } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { PageContent } from "../model/use-admin-text-edit-page";

interface TextEditTokenStatusBarProps {
	processingStatus: ProcessingStatus;
	processingProgress: number;
	tokenCount: number;
	pages: PageContent[];
	textId: string;
	lang: string;
	t: ReturnType<typeof useI18n>["t"];
}

export const TextEditTokenStatusBar = ({
	processingStatus,
	processingProgress,
	tokenCount,
	pages,
	textId,
	lang,
	t,
}: TextEditTokenStatusBarProps) => {
	if (processingStatus === "RUNNING") {
		return (
			<div className="flex items-center gap-2 border-b border-bd-1 bg-acc-muted px-6 py-2 transition-colors">
				<Typography
					tag="span"
					className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-acc border-t-transparent"
				/>
				<Typography tag="span" className="flex-1 text-[11.5px] text-acc-strong">
					{t("admin.texts.editPage.tokenBar.running")}{" "}
					{processingProgress > 0 ? `${processingProgress}%` : ""}
				</Typography>
			</div>
		);
	}

	if (processingStatus === "ERROR") {
		return (
			<div className="flex items-center gap-2 border-b border-red/10 bg-red-muted px-6 py-2 transition-colors">
				<AlertTriangle className="size-4 shrink-0 text-red" />
				<Typography tag="span" className="flex-1 text-[11.5px] text-red-strong">
					{t("admin.texts.editPage.tokenBar.error")}
				</Typography>
			</div>
		);
	}

	if (processingStatus === "COMPLETED" && tokenCount > 0) {
		return (
			<div className="flex items-center gap-2 border-b border-bd-1 bg-grn-muted px-6 py-2 transition-colors">
				<CheckCircle2 className="size-4 shrink-0 text-grn" />
				<Typography tag="span" className="flex-1 text-[11.5px] text-grn-strong">
					{t("admin.texts.editPage.tokenBar.done", {
						pages: pages.length,
						tokens: tokenCount,
					})}
				</Typography>
				<a
					href={`/${lang}/admin/texts/${textId}/versions`}
					className="shrink-0 text-[11px] font-medium text-acc transition-opacity hover:opacity-75"
				>
					{t("admin.texts.editPage.tokenBar.versions")} →
				</a>
			</div>
		);
	}

	return null;
};
