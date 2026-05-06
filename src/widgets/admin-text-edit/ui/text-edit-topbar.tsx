"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";

interface TextEditTopbarProps {
	textId: string;
	textTitle: string;
	textStatus: string;
	isUnsaved: boolean;
	isSaving: boolean;
	onSaveDraft: () => void;
	onSaveAndUpdate: () => void;
}

export const TextEditTopbar = ({
	textId,
	textTitle,
	textStatus,
	isUnsaved,
	isSaving,
	onSaveDraft,
	onSaveAndUpdate,
}: TextEditTopbarProps) => {
	const { t, lang } = useI18n();

	return (
		<div className="sticky top-0 z-20 flex h-[52px] items-center gap-2 border-b border-bd-1 bg-bg px-5 transition-colors max-sm:gap-1.5 max-sm:px-3.5">
			<div className="flex min-w-0 flex-1 items-center gap-2">
				{/* Back button */}
				<Link
					href={`/${lang}/admin/texts`}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					aria-label={t("admin.texts.editPage.back")}
				>
					<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
						<path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</Link>

				{/* Breadcrumb */}
				<nav className="flex items-center gap-1.5 overflow-hidden text-xs text-t-3" aria-label="breadcrumb">
					<Link
						href={`/${lang}/admin/texts`}
						className="shrink-0 transition-colors hover:text-t-2 max-[600px]:hidden"
					>
						{t("admin.texts.title")}
					</Link>
					<span className="shrink-0 text-t-4 max-[600px]:hidden">/</span>
					<span className="truncate font-medium text-t-2">
						{textTitle || t("admin.texts.editPage.editing")}
					</span>
				</nav>

				{/* Text ID badge */}
				<span className="shrink-0 rounded-[5px] border border-bd-2 bg-surf-2 px-2 py-[2px] font-mono text-[10.5px] text-t-3 max-[900px]:hidden">
					#{textId.slice(0, 8)}
				</span>
			</div>

			{/* Right side */}
			<div className="flex shrink-0 items-center gap-1.5">
				{/* Preview button — only for published texts */}
				{textStatus === "published" && (
					<a
						href={`/${lang}/texts/${textId}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 max-[600px]:hidden"
						aria-label={t("admin.texts.editPage.preview")}
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path d="M8 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
							<path d="M10 2h4v4M14 2L9 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{t("admin.texts.editPage.preview")}
					</a>
				)}
				{/* Unsaved indicator */}
				<div className="flex items-center gap-1.5 max-[600px]:hidden">
					{isUnsaved && (
						<span className="h-[7px] w-[7px] shrink-0 animate-pulse rounded-full bg-amb" />
					)}
					<span className="text-[11px] text-t-3">
						{isSaving
							? t("admin.texts.editPage.saving")
							: isUnsaved
								? t("admin.texts.editPage.unsaved")
								: t("admin.texts.editPage.saved")}
					</span>
				</div>

				<button
					type="button"
					onClick={onSaveDraft}
					disabled={isSaving}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50 max-[600px]:hidden"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M3 4a1 1 0 011-1h6l3 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
						<path d="M10 3v3H6V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						<path d="M5 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					</svg>
					{t("admin.texts.editPage.saveDraft")}
				</button>

				<button
					type="button"
					onClick={onSaveAndUpdate}
					disabled={isSaving}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-acc px-3 text-xs font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M2.5 8.5L6 12l7.5-8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span className="max-[600px]:hidden">
						{isSaving ? t("admin.texts.editPage.saving") : t("admin.texts.editPage.saveUpdate")}
					</span>
					<span className="hidden max-[600px]:inline">
						{t("admin.texts.editPage.saveUpdate")}
					</span>
				</button>
			</div>
		</div>
	);
};
