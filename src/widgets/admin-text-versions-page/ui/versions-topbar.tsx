"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type { AdminTextDetail } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";
import { ChevronLeft, Pencil, Play } from "lucide-react";

interface VersionsTopbarProps {
	textId: string;
	text: AdminTextDetail | undefined;
	onRunTokenization: () => void;
	isRunning: boolean;
}

export const VersionsTopbar = ({
	textId,
	text,
	onRunTokenization,
	isRunning,
}: VersionsTopbarProps) => {
	const { t, lang } = useI18n();

	const shortId = textId.length > 8 ? `#${textId.slice(0, 8)}` : `#${textId}`;

	return (
		<header className=" flex items-center gap-2.5 border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-sm:px-3.5">
			<Link
				href={`/${lang}/admin/texts`}
				className="flex size-7 shrink-0 items-center justify-center rounded-base border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
				aria-label={t("admin.texts.versions.backToTexts")}
			>
				<ChevronLeft className="size-3" />
			</Link>

			<div className="flex min-w-0 items-center gap-1.5 text-[12.5px]">
				<Link
					href={`/${lang}/admin/texts`}
					className="shrink-0 text-t-3 transition-colors hover:text-t-1"
				>
					{t("admin.texts.title")}
				</Link>
				<Typography tag="span" className="text-t-4">/</Typography>
				<Typography tag="span" className="max-w-[160px] truncate text-t-3 max-sm:hidden">
					{text?.title ?? textId}
				</Typography>
				<Typography tag="span" className="text-t-4 max-sm:hidden">/</Typography>
				<Typography tag="span" className="font-medium text-t-1">
					{t("admin.texts.versions.pageTitle")}
				</Typography>
			</div>

			<Typography tag="span" className="shrink-0 rounded-[5px] bg-surf-2 px-1.5 py-0.5 font-mono text-[10.5px] text-t-3 max-sm:hidden">
				{shortId}
			</Typography>

			<div className="ml-auto flex shrink-0 items-center gap-2">
				<Link
					href={`/${lang}/admin/texts/${textId}/edit`}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 max-sm:px-2"
				>
					<Pencil className="size-[13px]" />
					<Typography tag="span" className="max-sm:hidden">{t("admin.texts.actions.edit")}</Typography>
				</Link>
				<Button
					onClick={onRunTokenization}
					disabled={isRunning}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-60 max-sm:px-2"
				>
					{isRunning ? (
						<Typography tag="span" className="inline-block size-3 animate-spin rounded-full border border-white/30 border-t-white" />
					) : (
						<Play className="size-[13px]" />
					)}
					<Typography tag="span" className="max-sm:hidden">
						{isRunning
							? t("admin.texts.versions.sidebar.runBtnRunning")
							: t("admin.texts.versions.sidebar.runBtn")}
					</Typography>
				</Button>
			</div>
		</header>
	);
};
