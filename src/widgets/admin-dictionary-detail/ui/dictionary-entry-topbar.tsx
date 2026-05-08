"use client";

import type { AdminDictNavEntry } from "@/entities/dictionary";
import { ACCESS_TOKEN_STORAGE_KEY, API_URL } from "@/shared/config";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { UseQueryResult } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";

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

const IconPrev = () => (
	<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
		<path
			d="M10 3l-3 3 3 3"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M6 12l3-3-3-3"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
			strokeLinejoin="round"
			opacity=".3"
		/>
	</svg>
);

const IconNext = () => (
	<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
		<path
			d="M6 3l3 3-3 3"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
			strokeLinejoin="round"
			opacity=".3"
		/>
		<path
			d="M10 12l-3-3 3-3"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const IconDots = () => (
	<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
		<circle cx="8" cy="4" r="1" fill="currentColor" />
		<circle cx="8" cy="8" r="1" fill="currentColor" />
		<circle cx="8" cy="12" r="1" fill="currentColor" />
	</svg>
);

const IconPlus = () => (
	<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
		<path
			d="M8 3v10M3 8h10"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
		/>
	</svg>
);

const IconTrash = () => (
	<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
		<path
			d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
		/>
		<path
			d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
		/>
	</svg>
);

const IconExport = () => (
	<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
		<path
			d="M8 3v7M5.5 7.5L8 10l2.5-2.5"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M3 12h10"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
		/>
	</svg>
);

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
		"flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:opacity-40";

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
				<span className="text-[13px] text-t-4">/</span>
				<Link
					href={`/${lang}/admin/dictionary`}
					className="shrink-0 text-[13px] text-t-3 transition-colors hover:text-t-2"
				>
					{t("admin.nav.dictionary")}
				</Link>
				<span className="text-[13px] text-t-4">/</span>
				<span className="truncate font-display text-[15px] text-t-1">
					{baseForm || "…"}
				</span>
			</div>

			{/* Actions */}
			<div className="ml-auto flex shrink-0 items-center gap-2">
				{/* Prev */}
				<button
					className={cn(
						ghostBtn,
						"max-sm:[&_.btn-label]:hidden max-sm:min-w-[34px] max-sm:justify-center max-sm:px-2",
					)}
					disabled={!prev.data}
					onClick={() =>
						prev.data &&
						router.push(`/${lang}/admin/dictionary/${prev.data.id}`)
					}
					title={prev.data?.baseForm}
				>
					<IconPrev />
					<span className="btn-label">{t("admin.dictionaryDetail.prev")}</span>
				</button>

				{/* Next */}
				<button
					className={cn(
						ghostBtn,
						"max-sm:[&_.btn-label]:hidden max-sm:min-w-[34px] max-sm:justify-center max-sm:px-2",
					)}
					disabled={!next.data}
					onClick={() =>
						next.data &&
						router.push(`/${lang}/admin/dictionary/${next.data.id}`)
					}
					title={next.data?.baseForm}
				>
					<span className="btn-label">{t("admin.dictionaryDetail.next")}</span>
					<IconNext />
				</button>

				<div className="h-[18px] w-px bg-bd-2" />

				{/* Actions dropdown */}
				<div className="relative">
					<details className="group">
						<summary className={cn(ghostBtn, "cursor-pointer list-none")}>
							<IconDots />
							<span>{t("admin.dictionaryDetail.actions")}</span>
						</summary>
						<div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[180px] rounded-[10px] border border-bd-2 bg-surf p-1 shadow-md">
							<button
								className="flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
								onClick={() => onOpenModal({ type: "addLemma" })}
							>
								<IconPlus />
								{t("admin.dictionaryDetail.addLemma")}
							</button>
							<button
								className="flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
								onClick={handleExport}
							>
								<IconExport />
								{t("admin.dictionaryDetail.export")}
							</button>
							<div className="my-0.5 h-px bg-bd-1" />
							<button
								className="flex w-full items-center gap-2 rounded-md px-2.5 py-[7px] text-left text-[12.5px] text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
								onClick={onDelete}
								disabled={isDeleting}
							>
								<IconTrash />
								{t("admin.dictionaryDetail.deleteEntry")}
							</button>
						</div>
					</details>
				</div>
			</div>
		</header>
	);
};
