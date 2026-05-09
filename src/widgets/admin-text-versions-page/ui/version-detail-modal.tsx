"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, ReactNode, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { useAdminTextVersionDetail } from "@/entities/admin-text/model/use-admin-text-versions";
import type { VersionLogLevel, VersionPageStatus } from "@/entities/admin-text";

type ModalTab = "overview" | "pages" | "log";

const LogLevelClass: Record<VersionLogLevel, string> = {
	INFO: "text-t-2",
	OK: "text-grn-t",
	WARN: "text-amb-t",
	ERROR: "text-red-t",
};

const PageStatusClass: Record<VersionPageStatus, string> = {
	OK: "text-grn-t",
	ERROR: "text-red-t",
	SKIPPED: "text-t-3",
};

const formatDuration = (ms: number | null): string => {
	if (ms === null) return "—";
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
};

interface MetaCellProps {
	label: string;
	value: ReactNode;
	mono?: boolean;
}

const MetaCell = ({ label, value, mono }: MetaCellProps) => (
	<div className="rounded-[8px] bg-surf-2 px-3 py-2.5">
		<div className="mb-[3px] text-[10.5px] text-t-3">{label}</div>
		<div className={cn("text-[13px] font-medium text-t-1", mono && "font-mono text-[11.5px] text-t-2 font-normal")}>{value}</div>
	</div>
);

// ── Sub-components ─────────────────────────────────────────────────────────────

type VersionData = NonNullable<ReturnType<typeof useAdminTextVersionDetail>["data"]>;

const OverviewTab = ({
	version,
	t,
}: {
	version: VersionData;
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<div className="p-4">
		<div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
			{t("admin.texts.versions.modal.overview")}
		</div>
		<div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
			<MetaCell
				label={t("admin.texts.versions.modal.totalTokens")}
				value={version.totalTokenCount.toLocaleString()}
			/>
			<MetaCell
				label={t("admin.texts.versions.modal.totalWords")}
				value={version.totalWordCount.toLocaleString()}
			/>
			<MetaCell
				label={t("admin.texts.versions.modal.totalChars")}
				value={version.totalCharCount.toLocaleString()}
			/>
			<MetaCell
				label={t("admin.texts.versions.modal.duration")}
				value={formatDuration(version.durationMs)}
			/>
			<MetaCell
				label={t("admin.texts.versions.modal.trigger")}
				value={t(`admin.texts.versions.trigger.${version.trigger}`)}
			/>
			<MetaCell
				label={t("admin.texts.versions.modal.initiator")}
				value={version.initiator?.name ?? "—"}
				mono
			/>
		</div>

		{version.errorMessage && (
			<div className="mt-3 rounded-[8px] bg-red-bg px-3 py-2.5 font-mono text-[11px] leading-relaxed text-red-t">
				{version.errorMessage}
			</div>
		)}
	</div>
);

const PagesTab = ({
	version,
	t,
}: {
	version: VersionData;
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<table className="w-full border-collapse text-[12px]">
		<thead>
			<tr>
				{[
					t("admin.texts.versions.modal.colPage"),
					t("admin.texts.versions.modal.colTokens"),
					t("admin.texts.versions.modal.colWords"),
					t("admin.texts.versions.modal.colChars"),
					t("admin.texts.versions.modal.colStatus"),
				].map((h) => (
					<th
						key={h}
						className="border-b border-bd-1 bg-surf-2 px-2.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3"
					>
						{h}
					</th>
				))}
			</tr>
		</thead>
		<tbody>
			{version.pages.map((page) => (
				<tr key={page.pageId} className="hover:bg-surf-2">
					<td className="border-b border-bd-1 px-2.5 py-2 text-t-2">{page.pageNumber}</td>
					<td className="border-b border-bd-1 px-2.5 py-2 tabular-nums text-t-2">{page.tokenCount.toLocaleString()}</td>
					<td className="border-b border-bd-1 px-2.5 py-2 tabular-nums text-t-2">{page.wordCount.toLocaleString()}</td>
					<td className="border-b border-bd-1 px-2.5 py-2 tabular-nums text-t-2">{page.charCount.toLocaleString()}</td>
					<td className={cn("border-b border-bd-1 px-2.5 py-2 font-medium", PageStatusClass[page.status])}>
						{page.status}
					</td>
				</tr>
			))}
		</tbody>
	</table>
);

const LogTab = ({
	version,
	t,
}: {
	version: VersionData;
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<div className="m-4 overflow-y-auto rounded-[8px] bg-surf-3 px-3 py-2.5 max-h-[300px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4">
		{version.logs.length === 0 ? (
			<Typography tag="span" className="text-[12px] text-t-3">{t("admin.texts.versions.modal.noLogs")}</Typography>
		) : (
			<div className="flex flex-col gap-1 font-mono text-[11px] leading-[1.7]">
				{version.logs.map((log) => (
					<div key={log.id} className="flex gap-2">
						<Typography tag="span" className="shrink-0 text-t-3">
							{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
						</Typography>
						<Typography tag="span" className={LogLevelClass[log.level]}>{log.message}</Typography>
					</div>
				))}
			</div>
		)}
	</div>
);

// ── Main component ─────────────────────────────────────────────────────────────

interface VersionDetailModalProps {
	textId: string;
	versionId: string;
	onClose: () => void;
	onRestore: (id: string) => void;
	onRetry: (id: string) => void;
	onDownload: (versionId: string, versionNumber?: number) => void;
	isRestoring: boolean;
	isRetrying: boolean;
}

export const VersionDetailModal = ({
	textId,
	versionId,
	onClose,
	onRestore,
	onRetry,
	onDownload,
	isRestoring,
	isRetrying,
}: VersionDetailModalProps) => {
	const { t } = useI18n();
	const [tab, setTab] = useState<ModalTab>("overview");

	const { data: version, isLoading } = useAdminTextVersionDetail(textId, versionId);

	const tabs: { key: ModalTab; label: string }[] = [
		{ key: "overview", label: t("admin.texts.versions.modal.overview") },
		{ key: "pages", label: t("admin.texts.versions.modal.pages") },
		{ key: "log", label: t("admin.texts.versions.modal.log") },
	];

	const canRestore = version?.status === "COMPLETED" && !version.isCurrent;
	const canRetry = version?.status === "ERROR";

	const handleDownloadClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		if (!version) return;
		onDownload(versionId, version.version);
	};
	const handleRetryClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onRetry(versionId);
	const handleRestoreClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onRestore(versionId);

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal box */}
			<div
				role="dialog"
				aria-modal="true"
				className="fixed inset-0 z-50 flex items-center justify-center p-5 max-sm:items-end max-sm:p-0"
			>
				<div className="flex max-h-[80vh] w-[560px] max-w-full flex-col overflow-hidden rounded-[14px] border border-bd-2 bg-surf shadow-lg max-sm:max-h-[88vh] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[16px]">
					{/* Header */}
					<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-4.5 py-3.5 max-sm:px-4 max-sm:py-3">
						<Typography tag="span" className="font-display text-[15px] text-t-1">
							{version
								? t("admin.texts.versions.modal.title").replace("{n}", String(version.version))
								: t("admin.texts.versions.modal.title").replace("{n}", "…")}
						</Typography>
						<Button
							onClick={onClose}
							className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
						>
							<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
								<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
							</svg>
						</Button>
					</div>

					{/* Tabs */}
					<div className="flex shrink-0 gap-0 border-b border-bd-1 px-4">
						{tabs.map(({ key, label }) => {
							const handleTabClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setTab(key);
							return (
								<Button
									key={key}
									onClick={handleTabClick}
									className={cn(
										"-mb-px border-b-2 px-3 py-2.5 text-[12.5px] transition-colors",
										tab === key
											? "border-acc font-medium text-t-1"
											: "border-transparent text-t-3 hover:text-t-2",
									)}
								>
									{label}
								</Button>
							);
						})}
					</div>

					{/* Body */}
					<div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-0">
						{isLoading ? (
							<div className="p-4">
								<div className="grid grid-cols-2 gap-2">
									{[...Array(6)].map((_, i) => (
										<div key={i} className="h-14 animate-pulse rounded-[8px] bg-surf-2" />
									))}
								</div>
							</div>
						) : version ? (
							<>
								{tab === "overview" && <OverviewTab version={version} t={t} />}
								{tab === "pages" && <PagesTab version={version} t={t} />}
								{tab === "log" && <LogTab version={version} t={t} />}
							</>
						) : null}
					</div>

					{/* Footer */}
					<div className="flex shrink-0 items-center justify-end gap-2 border-t border-bd-1 px-4 py-3 max-sm:px-4 max-sm:pb-5">
						<Button
							onClick={onClose}
							className="flex h-[30px] items-center rounded-base border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
						>
							{t("admin.texts.versions.modal.close")}
						</Button>
						{version && (
							<Button
								onClick={handleDownloadClick}
								className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							>
								<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
									<path d="M8 3v7M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
								</svg>
								{t("admin.texts.versions.modal.download")}
							</Button>
						)}
						{canRetry && (
							<Button
								onClick={handleRetryClick}
								disabled={isRetrying}
								className="flex h-[30px] items-center gap-1.5 rounded-base bg-amb px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-60"
							>
								{isRetrying && <Typography tag="span" className="inline-block size-3 animate-spin rounded-full border border-white/30 border-t-white" />}
								{isRetrying ? t("admin.texts.versions.modal.retrying") : t("admin.texts.versions.modal.retry")}
							</Button>
						)}
						{canRestore && (
							<Button
								onClick={handleRestoreClick}
								disabled={isRestoring}
								className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-60"
							>
								{isRestoring && <Typography tag="span" className="inline-block size-3 animate-spin rounded-full border border-white/30 border-t-white" />}
								{isRestoring ? t("admin.texts.versions.modal.restoring") : t("admin.texts.versions.modal.restore")}
							</Button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
