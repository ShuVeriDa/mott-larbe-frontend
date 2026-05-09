"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import Link from "next/link";
import { Bookmark, ChevronLeft, PanelRightOpen, Settings } from "lucide-react";
import { useToggleBookmark } from "@/features/bookmark-text";
import { useWordLookupStore } from "@/features/word-lookup";
import type { TextPageResponse } from "@/entities/text";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { ReaderPager } from "./reader-pager";

const iconBtnClass = cn(
	"inline-flex h-[30px] w-[30px] items-center justify-center rounded-base",
	"text-t-3 transition-colors duration-100",
	"hover:bg-surf-2 hover:text-t-2",
	"aria-pressed:bg-acc-bg aria-pressed:text-acc-t",
);

export interface ReaderTopbarProps {
	textId: string;
	lang: string;
	currentPage: number;
	data: TextPageResponse;
	onOpenSettings: () => void;
}

export const ReaderTopbar = ({
	textId,
	lang,
	currentPage,
	data,
	onOpenSettings,
}: ReaderTopbarProps) => {
	const { t } = useI18n();
	const { mutate: toggleBookmark, isPending: bookmarking } = useToggleBookmark();
	const { success, error } = useToast();

	const panelOpen = useWordLookupStore((s) => s.panelOpen);
	const togglePanel = useWordLookupStore((s) => s.togglePanel);

	const onBookmark = () => {
		toggleBookmark(textId, {
			onSuccess: ({ bookmarked }) =>
				success(
					bookmarked
						? t("reader.toasts.bookmarkAdded")
						: t("reader.toasts.bookmarkRemoved"),
				),
			onError: () => error(t("reader.toasts.bookmarkFailed")),
		});
	};

	const metaParts = [data.author, data.level, data.language].filter(Boolean);

	return (
		<header className="flex h-[46px] shrink-0 items-center gap-2 border-b border-hairline border-bd-1 bg-surf px-4">
			<Link
				href={`/${lang}/texts`}
				className="inline-flex shrink-0 items-center gap-1.5 rounded-base px-2 py-1 text-[12.5px] text-t-2 transition-colors duration-100 hover:bg-surf-2 hover:text-t-1"
			>
				<ChevronLeft className="size-3.5" strokeWidth={1.6} />
				<Typography tag="span" className="max-md:hidden">{t("reader.topbar.back")}</Typography>
			</Link>

			<Typography tag="span"
				aria-hidden="true"
				className="h-4 w-px shrink-0 bg-bd-2 max-md:hidden"
			/>

			<div className="min-w-0 flex-1">
				<div className="truncate text-[13px] font-semibold text-t-1">
					{data.title}
				</div>
				<div className="truncate text-[11px] text-t-3 max-md:hidden">
					{metaParts.join(" · ")}
				</div>
			</div>

			<ReaderPager
				textId={textId}
				lang={lang}
				currentPage={currentPage}
				totalPages={data.totalPages}
			/>

			<Typography tag="span" aria-hidden="true" className="h-4 w-px shrink-0 bg-bd-2" />

			<div className="flex shrink-0 items-center gap-1">
				<Button
					onClick={togglePanel}
					aria-pressed={panelOpen}
					aria-label={t("reader.topbar.togglePanel")}
					className={cn(iconBtnClass, "max-md:hidden")}
				>
					<PanelRightOpen className="size-[15px]" strokeWidth={1.4} />
				</Button>
				<Button
					onClick={onOpenSettings}
					aria-label={t("reader.topbar.settings")}
					className={iconBtnClass}
				>
					<Settings className="size-[15px]" strokeWidth={1.4} />
				</Button>
				<Button
					onClick={onBookmark}
					disabled={bookmarking}
					aria-pressed={Boolean(data.bookmarked)}
					aria-label={t("reader.topbar.bookmark")}
					className={iconBtnClass}
				>
					<Bookmark
						className="size-[15px]"
						strokeWidth={1.4}
						fill={data.bookmarked ? "currentColor" : "none"}
					/>
				</Button>
			</div>
		</header>
	);
};
