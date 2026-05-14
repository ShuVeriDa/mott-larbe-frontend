"use client";

import Link from "next/link";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, useState } from "react";
import type { ProcessingStatus } from "@/entities/admin-text";
import { adminTextApi } from "@/entities/admin-text";
import { MetaSection, MetaToggle } from "@/shared/ui/admin-text-meta-fields";
import { useI18n } from "@/shared/lib/i18n";
import { Clock, History, Trash2 } from "lucide-react";

interface Props {
	processingStatus: ProcessingStatus;
	tokenCount: number;
	autoTokenizeOnSave: boolean;
	useNormalization: boolean;
	useMorphAnalysis: boolean;
	textId: string;
	lang: string;
	t: ReturnType<typeof useI18n>["t"];
	onTokenize: () => void;
	onAutoTokenizeChange: (v: boolean) => void;
	onNormalizationChange: (v: boolean) => void;
	onMorphAnalysisChange: (v: boolean) => void;
}

export const TokenizationSection = ({
	processingStatus,
	tokenCount,
	autoTokenizeOnSave,
	useNormalization,
	useMorphAnalysis,
	textId,
	lang,
	t,
	onTokenize,
	onAutoTokenizeChange,
	onNormalizationChange,
	onMorphAnalysisChange,
}: Props) => {
	const tokenStatusLabel = t(`admin.texts.editPage.tokenStatus.${processingStatus}`);
	const tokenStatusClass =
		processingStatus === "COMPLETED"
			? "bg-grn-muted text-grn-strong"
			: processingStatus === "RUNNING"
				? "bg-amb-muted text-amb-strong"
				: processingStatus === "ERROR"
					? "bg-red-muted text-red-strong"
					: "bg-surf-3 text-t-3";

	const [clearingCache, setClearingCache] = useState(false);
	const [cacheCleared, setCacheCleared] = useState<number | null>(null);

	const handleTokenize: NonNullable<ComponentProps<"button">["onClick"]> = () => onTokenize();
	const handleAutoTokenizeChange = (v: boolean) => onAutoTokenizeChange(v);
	const handleNormalizationChange = (v: boolean) => onNormalizationChange(v);
	const handleMorphAnalysisChange = (v: boolean) => onMorphAnalysisChange(v);

	const handleClearCache = async () => {
		setClearingCache(true);
		setCacheCleared(null);
		try {
			const result = await adminTextApi.clearDictionaryCache(textId);
			setCacheCleared(result.deleted);
		} finally {
			setClearingCache(false);
		}
	};

	return (
		<MetaSection title={t("admin.texts.editPage.sections.tokenization")}>
			<div className="mb-2 flex items-center justify-between">
				<Typography tag="span" className="text-xs text-t-2">
					{t("admin.texts.editPage.tokenStatusLabel")}
				</Typography>
				<Typography tag="span" className={`rounded-[4px] px-2 py-0.5 text-[10.5px] font-semibold ${tokenStatusClass}`}>
					{tokenStatusLabel}
				</Typography>
			</div>

			{tokenCount > 0 && (
				<Typography tag="p" className="mb-2 text-[11.5px] leading-relaxed text-t-3">
					<Typography tag="strong" className="text-t-2">{tokenCount}</Typography>{" "}
					{t("admin.texts.editPage.tokenCountSuffix")}
				</Typography>
			)}

			{processingStatus !== "RUNNING" && (
				<Button
					onClick={handleTokenize}
					className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-base border border-acc/25 bg-acc-muted px-3 py-[7px] text-[11.5px] font-medium text-acc transition-opacity hover:opacity-80"
				>
					<Clock className="size-3" />
					{t("admin.texts.editPage.tokenizeNow")}
				</Button>
			)}

			<Link
				href={`/${lang}/admin/texts/${textId}/versions`}
				className="mb-3 flex items-center gap-1.5 rounded-base border border-acc/15 bg-acc-muted px-3 py-[7px] text-[11.5px] font-medium text-acc transition-opacity hover:opacity-80"
			>
				<History className="size-3" />
				{t("admin.texts.editPage.tokenHistoryLink")}
			</Link>

			<button
				type="button"
				onClick={handleClearCache}
				disabled={clearingCache}
				className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-base border border-red/25 bg-red-muted px-3 py-[7px] text-[11.5px] font-medium text-red transition-opacity hover:opacity-80 disabled:opacity-50"
			>
				<Trash2 className="size-3" />
				{clearingCache ? "Очищаем..." : "Очистить кэш слов"}
			</button>
			{cacheCleared !== null ? (
				<Typography tag="p" className="mb-2 text-[11px] text-t-3">
					Удалено записей: {cacheCleared}
				</Typography>
			) : null}

			<div className="mb-2.5 flex items-center justify-between gap-2">
				<div>
					<div className="text-xs text-t-1">{t("admin.texts.createPage.tokenizeLabel")}</div>
					<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.tokenizeSub")}</div>
				</div>
				<MetaToggle checked={autoTokenizeOnSave} onChange={handleAutoTokenizeChange} />
			</div>
			<div className="mb-2.5 flex items-center justify-between gap-2">
				<div>
					<div className="text-xs text-t-1">{t("admin.texts.createPage.normalizationLabel")}</div>
					<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.normalizationSub")}</div>
				</div>
				<MetaToggle checked={useNormalization} onChange={handleNormalizationChange} />
			</div>
			<div className="flex items-center justify-between gap-2">
				<div>
					<div className="text-xs text-t-1">{t("admin.texts.createPage.morphLabel")}</div>
					<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.morphSub")}</div>
				</div>
				<MetaToggle checked={useMorphAnalysis} onChange={handleMorphAnalysisChange} />
			</div>
		</MetaSection>
	);
};
