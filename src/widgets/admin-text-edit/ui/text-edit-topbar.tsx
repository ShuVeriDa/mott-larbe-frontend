"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";
import { ChevronLeft, ExternalLink, Save, Check } from "lucide-react";

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
		<header className=" flex min-h-[52px] items-center gap-2 border-b border-bd-1 bg-surf px-5 transition-colors max-sm:gap-1.5 max-sm:px-3.5">
			<div className="flex min-w-0 flex-1 items-center gap-2">
				{/* Back button */}
				<Link
					href={`/${lang}/admin/texts`}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-base border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					aria-label={t("admin.texts.editPage.back")}
				>
					<ChevronLeft className="size-[13px]" />
				</Link>

				{/* Breadcrumb */}
				<nav
					className="flex items-center gap-1.5 overflow-hidden text-xs text-t-3"
					aria-label="breadcrumb"
				>
					<Link
						href={`/${lang}/admin/texts`}
						className="shrink-0 transition-colors hover:text-t-2 max-[600px]:hidden"
					>
						{t("admin.texts.title")}
					</Link>
					<Typography tag="span" className="shrink-0 text-t-4 max-[600px]:hidden">/</Typography>
					<Typography tag="span" className="truncate font-medium text-t-2">
						{textTitle || t("admin.texts.editPage.editing")}
					</Typography>
				</nav>

				{/* Text ID badge */}
				<Typography tag="span" className="shrink-0 rounded-[5px] border border-bd-2 bg-surf-2 px-2 py-[2px] font-mono text-[10.5px] text-t-3 max-[900px]:hidden">
					#{textId.slice(0, 8)}
				</Typography>
			</div>

			{/* Right side */}
			<div className="flex shrink-0 items-center gap-1.5">
				{/* Preview button — only for published texts */}
				{textStatus === "published" && (
					<a
						href={`/${lang}/texts/${textId}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 max-[600px]:hidden"
						aria-label={t("admin.texts.editPage.preview")}
					>
						<ExternalLink className="size-3" />
						{t("admin.texts.editPage.preview")}
					</a>
				)}
				{/* Unsaved indicator */}
				<div className="flex items-center gap-1.5 max-[600px]:hidden">
					{isUnsaved && (
						<Typography tag="span" className="h-[7px] w-[7px] shrink-0 animate-pulse rounded-full bg-amb" />
					)}
					<Typography tag="span" className="text-[11px] text-t-3">
						{isSaving
							? t("admin.texts.editPage.saving")
							: isUnsaved
								? t("admin.texts.editPage.unsaved")
								: t("admin.texts.editPage.saved")}
					</Typography>
				</div>

				<Button
					onClick={onSaveDraft}
					disabled={isSaving}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50 max-[600px]:hidden"
				>
					<Save className="size-3" />
					{t("admin.texts.editPage.saveDraft")}
				</Button>

				<Button
					onClick={onSaveAndUpdate}
					disabled={isSaving}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-xs font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Check className="size-3" />
					<Typography tag="span" className="max-[600px]:hidden">
						{isSaving
							? t("admin.texts.editPage.saving")
							: t("admin.texts.editPage.saveUpdate")}
					</Typography>
					<Typography tag="span" className="hidden max-[600px]:inline">
						{t("admin.texts.editPage.saveUpdate")}
					</Typography>
				</Button>
			</div>
		</header>
	);
};
