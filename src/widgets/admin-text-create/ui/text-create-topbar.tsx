"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";

interface TextCreateTopbarProps {
	isUnsaved: boolean;
	isSaving: boolean;
	onSaveDraft: () => void;
	onPublish: () => void;
}

export const TextCreateTopbar = ({
	isUnsaved,
	isSaving,
	onSaveDraft,
	onPublish,
}: TextCreateTopbarProps) => {
	const { t, lang } = useI18n();

	return (
		<div className="sticky top-0 z-20 flex h-[52px] items-center gap-2 border-b border-bd-1 bg-bg px-5 transition-colors max-sm:gap-1.5 max-sm:px-3.5">
			<div className="flex min-w-0 flex-1 items-center gap-2">
				{/* Back button */}
				<Link
					href={`/${lang}/admin/texts`}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					aria-label={t("admin.texts.createPage.back")}
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
						{t("admin.texts.createPage.newText")}
					</span>
				</nav>
			</div>

			{/* Right side */}
			<div className="flex shrink-0 items-center gap-1.5">
				{/* Unsaved indicator */}
				<div className="flex items-center gap-1.5 max-[600px]:hidden">
					{isUnsaved && (
						<span className="h-[7px] w-[7px] shrink-0 animate-pulse rounded-full bg-amb" />
					)}
					<span className="text-[11px] text-t-3">
						{isSaving
							? t("admin.texts.createPage.saving")
							: isUnsaved
								? t("admin.texts.createPage.unsaved")
								: t("admin.texts.createPage.draftSaved")}
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
					{t("admin.texts.createPage.saveDraft")}
				</button>

				<button
					type="button"
					onClick={onPublish}
					disabled={isSaving}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-acc px-3 text-xs font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M8 2v10M3 7l5-5 5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span className="max-[600px]:hidden">{t("admin.texts.createPage.publish")}</span>
					<span className="hidden max-[600px]:inline">{t("admin.texts.createPage.publish")}</span>
				</button>
			</div>
		</div>
	);
};
