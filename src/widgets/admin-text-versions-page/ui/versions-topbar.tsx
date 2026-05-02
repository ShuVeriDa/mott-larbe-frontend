"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminTextDetail } from "@/entities/admin-text";

interface VersionsTopbarProps {
	textId: string;
	text: AdminTextDetail | undefined;
	onRunTokenization: () => void;
	isRunning: boolean;
}

export const VersionsTopbar = ({ textId, text, onRunTokenization, isRunning }: VersionsTopbarProps) => {
	const { t, lang } = useI18n();

	return (
		<div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-bd-1 bg-bg px-[22px] py-3 transition-colors max-sm:px-3.5">
			<Link
				href={`/${lang}/admin/texts`}
				className="flex size-7 shrink-0 items-center justify-center rounded-[7px] border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
				aria-label={t("admin.texts.versions.backToTexts")}
			>
				<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
					<path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</Link>

			<div className="flex min-w-0 items-center gap-1.5 text-[12.5px]">
				<Link href={`/${lang}/admin/texts`} className="shrink-0 text-t-3 transition-colors hover:text-t-1">
					{t("admin.texts.title")}
				</Link>
				<span className="text-t-4">/</span>
				<span className="max-w-[160px] truncate text-t-3 max-sm:hidden">
					{text?.title ?? textId}
				</span>
				<span className="text-t-4 max-sm:hidden">/</span>
				<span className="font-medium text-t-1">{t("admin.texts.versions.pageTitle")}</span>
			</div>

			<div className="ml-auto flex shrink-0 items-center gap-2">
				<Link
					href={`/${lang}/admin/texts/${textId}/edit`}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 max-sm:px-2"
				>
					<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
						<path d="M10.5 3.5l2 2L5 13H3v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span className="max-sm:hidden">{t("admin.texts.actions.edit")}</span>
				</Link>
				<button
					type="button"
					onClick={onRunTokenization}
					disabled={isRunning}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-60 max-sm:px-2"
				>
					{isRunning ? (
						<span className="inline-block size-3 animate-spin rounded-full border border-white/30 border-t-white" />
					) : (
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path d="M5 3.5l8 4.5-8 4.5V3.5z" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					)}
					<span className="max-sm:hidden">
						{isRunning ? t("admin.texts.versions.sidebar.runBtnRunning") : t("admin.texts.versions.sidebar.runBtn")}
					</span>
				</button>
			</div>
		</div>
	);
};
