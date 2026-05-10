"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import type { AdminDictNavEntry } from "@/entities/dictionary";
import { ACCESS_TOKEN_STORAGE_KEY, API_URL } from "@/shared/config";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { UseQueryResult } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";
import { ChevronLeft, ChevronRight, MoreVertical, Plus, Trash2, Download } from "lucide-react";

interface DictionaryEntryTopbarProps {
	lang: string;
	baseForm: string;
	lemmaId: string;
	next: UseQueryResult<AdminDictNavEntry | null>;
	prev: UseQueryResult<AdminDictNavEntry | null>;
	onOpenModal: (m: DictModal) => void;
	onDelete: () => void;
	isDeleting: boolean;
}


export const DictionaryEntryTopbar = ({
	lang,
	baseForm,
	lemmaId,
	next,
	prev,
	onOpenModal,
	onDelete,
	isDeleting,
}: DictionaryEntryTopbarProps) => {
	const { t } = useI18n();
	const router = useRouter();

	const handleExport = async () => {
		const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? "";
		const url = `${API_URL}/admin/dictionary/export?ids=${lemmaId}`;
		const res = await fetch(url, {
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		if (!res.ok) return;
		const blob = await res.blob();
		const objectUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = objectUrl;
		a.download = `dictionary-export-${lemmaId}.json`;
		a.click();
		URL.revokeObjectURL(objectUrl);
	};

	const ghostBtn =
		"flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:opacity-40";

	const handlePrevClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		prev.data && router.push(`/${lang}/admin/dictionary/${prev.data.id}`);
	const handleNextClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		next.data && router.push(`/${lang}/admin/dictionary/${next.data.id}`);
	const handleAddLemmaClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onOpenModal({ type: "addLemma" });
return (
		<header className=" flex items-center gap-2.5 border-b border-bd-1 bg-surf px-[22px] py-[14px] transition-colors max-sm:px-3.5 max-sm:py-3">
			{/* Breadcrumb */}
			<div className="flex items-center gap-1.5 overflow-hidden">
				<Link
					href={`/${lang}/admin`}
					className="shrink-0 text-[13px] text-t-3 transition-colors hover:text-t-2"
				>
					Admin
				</Link>
				<Typography tag="span" className="text-[13px] text-t-4">/</Typography>
				<Link
					href={`/${lang}/admin/dictionary`}
					className="shrink-0 text-[13px] text-t-3 transition-colors hover:text-t-2"
				>
					{t("admin.nav.dictionary")}
				</Link>
				<Typography tag="span" className="text-[13px] text-t-4">/</Typography>
				<Typography tag="span" className="truncate font-display text-[15px] text-t-1">
					{baseForm || "…"}
				</Typography>
			</div>

			{/* Actions */}
			<div className="ml-auto flex shrink-0 items-center gap-2">
				{/* Prev */}
				<Button
					className={cn(
						ghostBtn,
						"max-sm:[&_.btn-label]:hidden max-sm:min-w-[34px] max-sm:justify-center max-sm:px-2",
					)}
					disabled={!prev.data}
					onClick={handlePrevClick}
					title={prev.data?.baseForm}
				>
					<ChevronLeft className="size-[13px]" />
					<Typography tag="span" className="btn-label">{t("admin.dictionaryDetail.prev")}</Typography>
				</Button>

				{/* Next */}
				<Button
					className={cn(
						ghostBtn,
						"max-sm:[&_.btn-label]:hidden max-sm:min-w-[34px] max-sm:justify-center max-sm:px-2",
					)}
					disabled={!next.data}
					onClick={handleNextClick}
					title={next.data?.baseForm}
				>
					<Typography tag="span" className="btn-label">{t("admin.dictionaryDetail.next")}</Typography>
					<ChevronRight className="size-[13px]" />
				</Button>

				<div className="h-[18px] w-px bg-bd-2" />

				{/* Actions dropdown */}
				<div className="relative">
					<details className="group">
						<summary className={cn(ghostBtn, "cursor-pointer list-none")}>
							<MoreVertical className="size-[13px]" />
							<Typography tag="span">{t("admin.dictionaryDetail.actions")}</Typography>
						</summary>
						<div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[180px] rounded-[10px] border border-bd-2 bg-surf p-1 shadow-md">
							<Button
								className="flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
								onClick={handleAddLemmaClick}
							>
								<Plus className="size-3" />
								{t("admin.dictionaryDetail.addLemma")}
							</Button>
							<Button
								className="flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
								onClick={handleExport}
							>
								<Download className="size-[13px]" />
								{t("admin.dictionaryDetail.export")}
							</Button>
							<div className="my-0.5 h-px bg-bd-1" />
							<Button
								className="flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
								onClick={onDelete}
								disabled={isDeleting}
							>
								<Trash2 className="size-[13px]" />
								{t("admin.dictionaryDetail.deleteEntry")}
							</Button>
						</div>
					</details>
				</div>
			</div>
		</header>
	);
};
