"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminTextDetail } from "@/entities/admin-text";

const LangLabel: Record<string, string> = {
	CHE: "admin.texts.versions.sidebar.langCHE",
	RU: "admin.texts.versions.sidebar.langRU",
	AR: "admin.texts.versions.sidebar.langAR",
	EN: "admin.texts.versions.sidebar.langEN",
};

const StatusBadgeClass: Record<string, string> = {
	published: "bg-grn-bg text-grn-t",
	draft: "bg-surf-3 text-t-2",
	archived: "bg-amb-bg text-amb-t",
};

const LevelBadgeClass: Record<string, string> = {
	A1: "bg-grn-bg text-grn-t",
	A2: "bg-grn-bg text-grn-t",
	B1: "bg-acc-bg text-acc-t",
	B2: "bg-acc-bg text-acc-t",
	C1: "bg-pur-bg text-pur-t",
	C2: "bg-pur-bg text-pur-t",
};

interface SectionCardProps {
	title: string;
	children: React.ReactNode;
}

const SectionCard = ({ title, children }: SectionCardProps) => (
	<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
		<div className="border-b border-bd-1 px-3.5 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.4px] text-t-2">
			{title}
		</div>
		{children}
	</div>
);

interface InfoRowProps {
	label: string;
	children: React.ReactNode;
}

const InfoRow = ({ label, children }: InfoRowProps) => (
	<div className="flex items-start justify-between gap-2 border-b border-bd-1 px-3.5 py-2 text-[12px] last:border-none">
		<span className="shrink-0 text-t-3">{label}</span>
		<span className="text-right font-medium text-t-1">{children}</span>
	</div>
);

interface SettingRowProps {
	label: string;
	value: boolean;
	onLabel: string;
	offLabel: string;
}

const SettingRow = ({ label, value, onLabel, offLabel }: SettingRowProps) => (
	<div className="flex items-center justify-between gap-2 px-3.5 py-2 text-[12px]">
		<span className="text-t-2">{label}</span>
		<span className={cn(
			"rounded px-1.5 py-px text-[11px] font-semibold",
			value ? "bg-grn-bg text-grn-t" : "bg-surf-3 text-t-3",
		)}>
			{value ? onLabel : offLabel}
		</span>
	</div>
);

interface VersionsSidebarProps {
	text: AdminTextDetail | undefined;
	isLoading: boolean;
	onRunTokenization: () => void;
	isRunning: boolean;
}

export const VersionsSidebar = ({ text, isLoading, onRunTokenization, isRunning }: VersionsSidebarProps) => {
	const { t } = useI18n();

	const totalChars = text?.pages.reduce((s, p) => s + (p.contentRaw?.length ?? 0), 0) ?? 0;

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3">
				{[120, 96, 80].map((h) => (
					<div key={h} className="animate-pulse rounded-card border border-bd-1 bg-surf" style={{ height: h }} />
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{/* Text info */}
			<SectionCard title={t("admin.texts.versions.sidebar.textInfo")}>
				<div>
					<InfoRow label={t("admin.texts.versions.sidebar.status")}>
						{text ? (
							<span className={cn("rounded px-1.5 py-px text-[10.5px] font-semibold", StatusBadgeClass[text.status] ?? "bg-surf-3 text-t-2")}>
								{t(`admin.texts.status.${text.status}`)}
							</span>
						) : "—"}
					</InfoRow>
					<InfoRow label={t("admin.texts.versions.sidebar.level")}>
						{text?.level ? (
							<span className={cn("rounded px-1.5 py-px text-[10px] font-semibold uppercase", LevelBadgeClass[text.level] ?? "bg-surf-3 text-t-2")}>
								{text.level}
							</span>
						) : t("admin.texts.versions.sidebar.noLevel")}
					</InfoRow>
					<InfoRow label={t("admin.texts.versions.sidebar.language")}>
						{text?.language ? t(LangLabel[text.language] ?? "admin.texts.versions.sidebar.langEN") : "—"}
					</InfoRow>
					<InfoRow label={t("admin.texts.versions.sidebar.pagesCount")}>
						{text?.pages.length ?? "—"}
					</InfoRow>
					<InfoRow label={t("admin.texts.versions.sidebar.author")}>
						{text?.author ?? t("admin.texts.versions.sidebar.noAuthor")}
					</InfoRow>
					<InfoRow label={t("admin.texts.versions.sidebar.createdAt")}>
						{text ? new Date(text.createdAt).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" }) : "—"}
					</InfoRow>
				</div>
			</SectionCard>

			{/* Page distribution */}
			{text && text.pages.length > 0 && (
				<SectionCard title={t("admin.texts.versions.sidebar.pageBreakdown")}>
					<div className="flex flex-col gap-1.5 px-3.5 py-2.5">
						{text.pages.map((page) => {
							const pct = totalChars > 0 ? Math.round(((page.contentRaw?.length ?? 0) / totalChars) * 100) : 0;
							return (
								<div key={page.id}>
									<div className="mb-1 flex items-center justify-between">
										<span className="text-[11.5px] text-t-2">
											{t("admin.texts.versions.sidebar.pageN").replace("{n}", String(page.pageNumber))}
											{page.title && <span className="ml-1 text-t-3">— {page.title}</span>}
										</span>
										<span className="text-[11px] text-t-3">{pct}%</span>
									</div>
									<div className="h-1 overflow-hidden rounded-full bg-surf-3">
										<div className="h-full rounded-full bg-acc transition-all" style={{ width: `${pct}%` }} />
									</div>
								</div>
							);
						})}
					</div>
				</SectionCard>
			)}

			{/* Processing settings */}
			{text && (
				<SectionCard title={t("admin.texts.versions.sidebar.settings")}>
					<div className="py-1">
						<SettingRow
							label={t("admin.texts.versions.sidebar.normalization")}
							value={text.useNormalization}
							onLabel={t("admin.texts.versions.sidebar.on")}
							offLabel={t("admin.texts.versions.sidebar.off")}
						/>
						<SettingRow
							label={t("admin.texts.versions.sidebar.morphAnalysis")}
							value={text.useMorphAnalysis}
							onLabel={t("admin.texts.versions.sidebar.on")}
							offLabel={t("admin.texts.versions.sidebar.off")}
						/>
						<SettingRow
							label={t("admin.texts.versions.sidebar.autoOnSave")}
							value={text.autoTokenizeOnSave}
							onLabel={t("admin.texts.versions.sidebar.on")}
							offLabel={t("admin.texts.versions.sidebar.off")}
						/>
					</div>
					<div className="border-t border-bd-1 p-3.5">
						<button
							type="button"
							onClick={onRunTokenization}
							disabled={isRunning}
							className="flex h-[34px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-[8px] bg-acc font-sans text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-60"
						>
							{isRunning ? (
								<>
									<span className="inline-block size-3 animate-spin rounded-full border border-white/30 border-t-white" />
									{t("admin.texts.versions.sidebar.runBtnRunning")}
								</>
							) : (
								<>
									<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
										<path d="M5 3.5l8 4.5-8 4.5V3.5z" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
									{t("admin.texts.versions.sidebar.runBtn")}
								</>
							)}
						</button>
					</div>
				</SectionCard>
			)}
		</div>
	);
};
