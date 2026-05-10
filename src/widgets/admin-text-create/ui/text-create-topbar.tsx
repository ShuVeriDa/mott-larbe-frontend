"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";
import type { ComponentProps } from "react";
import type { SaveState } from "../model/use-admin-text-create-page";
import { AlignLeft, Check, ChevronLeft, ChevronRight, Save, Upload } from "lucide-react";

interface TextCreateTopbarProps {
	saveState: SaveState;
	isSaving: boolean;
	isMetaPanelVisible: boolean;
	onSaveDraft: () => void;
	onPublish: () => void;
	onToggleMetaPanel: () => void;
}

export const TextCreateTopbar = ({
	saveState,
	isSaving,
	isMetaPanelVisible,
	onSaveDraft,
	onPublish,
	onToggleMetaPanel,
}: TextCreateTopbarProps) => {
	const { t, lang } = useI18n();
	const handleToggleMetaPanel: NonNullable<ComponentProps<"button">["onClick"]> =
		() => onToggleMetaPanel();

	const statusLabel =
		saveState === "saving"
			? t("admin.texts.createPage.saving")
			: saveState === "unsaved"
				? t("admin.texts.createPage.unsaved")
				: saveState === "saved"
					? t("admin.texts.createPage.draftSaved")
					: null;

	return (
		<header className=" flex min-h-[52px] items-center gap-2 border-b border-bd-1 bg-surf px-5 transition-colors max-sm:gap-1.5 max-sm:px-3.5 ">
			<div className="flex min-w-0 flex-1 items-center gap-2">
				{/* Back button */}
				<Link
					href={`/${lang}/admin/texts`}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-base border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					aria-label={t("admin.texts.createPage.back")}
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
						{t("admin.texts.createPage.newText")}
					</Typography>
				</nav>
			</div>

			{/* Right side */}
			<div className="flex shrink-0 items-center gap-1.5">
				{/* Save state indicator — hidden until there is a meaningful state */}
				{statusLabel && (
					<div className="flex items-center gap-1.5 max-[767px]:hidden">
						{saveState === "unsaved" && (
							<Typography tag="span" className="h-[7px] w-[7px] shrink-0 animate-pulse rounded-full bg-amb" />
						)}
						{saveState === "saved" && (
							<Check className="size-[11px] shrink-0 text-grn" />
						)}
						<Typography tag="span" className="text-[11px] text-t-3">{statusLabel}</Typography>
					</div>
				)}

				<Button
					onClick={handleToggleMetaPanel}
					className="hidden h-[30px] items-center gap-1 rounded-base border border-bd-2 bg-transparent px-2.5 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 min-[768px]:flex"
					aria-label={t("admin.texts.createPage.sections.settings")}
				>
					<AlignLeft className="size-3.5" />
					<Typography tag="span" className="max-[960px]:hidden">
						{t("admin.texts.createPage.sections.settings")}
					</Typography>
					{isMetaPanelVisible ? (
						<ChevronRight className="size-3.5 text-t-4" />
					) : (
						<ChevronLeft className="size-3.5 text-t-4" />
					)}
				</Button>

				<Button
					onClick={onSaveDraft}
					disabled={isSaving}
					aria-label={t("admin.texts.createPage.saveDraft")}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50 max-[767px]:h-8 max-[767px]:w-8 max-[767px]:justify-center max-[767px]:gap-0 max-[767px]:px-0"
				>
					<Save className="size-3" />
					<Typography tag="span" className="max-[767px]:hidden">
						{t("admin.texts.createPage.saveDraft")}
					</Typography>
				</Button>

				<Button
					onClick={onPublish}
					disabled={isSaving}
					aria-label={t("admin.texts.createPage.publish")}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-xs font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50 max-[767px]:h-8 max-[767px]:w-8 max-[767px]:justify-center max-[767px]:gap-0 max-[767px]:px-0"
				>
					<Upload className="size-3" />
					<Typography tag="span" className="max-[767px]:hidden">
						{t("admin.texts.createPage.publish")}
					</Typography>
				</Button>
			</div>
		</header>
	);
};
