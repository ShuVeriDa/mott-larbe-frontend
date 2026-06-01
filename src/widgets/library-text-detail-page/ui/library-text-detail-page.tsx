"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import Link from "next/link";
import { useLibraryTextDetailPage } from "../model";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { TextHero } from "./text-hero";
import { TextDescription } from "./text-description";
import { TextProgressCard } from "./text-progress-card";
import { TextVocabCard } from "./text-vocab-card";
import { TextInfoCard } from "./text-info-card";
import { TextPagesCard } from "./text-pages-card";
import { TextRelated } from "./text-related";
import { TextReportDialog } from "./text-report-dialog";
import { TextTagsCard } from "./text-tags-card";
import { BookmarkMenuIcon } from "./bookmark-menu-icon";
import { FlagIcon } from "./flag-icon";
import { DetailSkeleton } from "./detail-skeleton";
import type { LibraryTextDetail } from "@/entities/library-text";

interface LibraryTextDetailPageProps {
	id: string;
	initialData?: LibraryTextDetail;
}

export const LibraryTextDetailPage = ({ id, initialData }: LibraryTextDetailPageProps) => {
	const {
		t,
		lang,
		detail,
		related,
		copied,
		reportOpen,
		setReportOpen,
		bookmarkMutation,
		handleShare,
		handleRetry,
		handleToggleBookmark,
		handleOpenReport,
	} = useLibraryTextDetailPage(id, initialData);

	if (detail.isPending) return <DetailSkeleton />;

	if (detail.isError) {
		const handleRetryClick: NonNullable<
			ComponentProps<"button">["onClick"]
		> = handleRetry;
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-t-3">
				<Typography tag="p" className="text-sm text-t-2">{t("library.textDetail.error")}</Typography>
				<Button
					onClick={handleRetryClick}
					className="text-xs text-acc-t hover:underline"
				>
					{t("library.textDetail.retry")}
				</Button>
			</div>
		);
	}

	const text = detail.data;

	const handleBookmarkSelect: NonNullable<
		ComponentProps<typeof DropdownMenuItem>["onSelect"]
	> = handleToggleBookmark;
	const handleReportSelect: NonNullable<
		ComponentProps<typeof DropdownMenuItem>["onSelect"]
	> = handleOpenReport;

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Topbar */}
			<header className="h-12 bg-panel border-b border-bd-1 flex items-center gap-2.5 px-5 shrink-0 max-sm:h-11 max-sm:px-3.5">
				<Link
					href={`/${lang}/texts`}
					className="flex items-center gap-1.5 text-xs text-t-2 hover:text-t-1 hover:bg-surf-2 px-2 py-1 rounded-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						aria-hidden="true"
					>
						<path d="M10 12L6 8l4-4" />
					</svg>
					{t("library.textDetail.back")}
				</Link>

				<Typography tag="span" className="w-px h-3.5 bg-bd-2" aria-hidden="true" />

				<nav aria-label={t("library.textDetail.breadcrumbNav")} className="hidden sm:flex">
					<ol className="flex items-center gap-1.5 text-xs text-t-3">
						<li>
							<Link
								href={`/${lang}/texts`}
								className="hover:text-t-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 rounded-sm"
							>
								{t("nav.texts")}
							</Link>
						</li>
						<li aria-hidden="true" className="text-t-4">/</li>
						<li aria-current="page" className="text-t-2">{t("library.textDetail.breadcrumb")}</li>
					</ol>
				</nav>

				<div className="ml-auto flex items-center gap-1.5">
					<Button
						onClick={handleShare}
						title={t("library.textDetail.share")}
						className="w-7 h-7 rounded-base border border-bd-2 flex items-center justify-center text-t-2 hover:bg-surf-2 transition-colors"
					>
						{copied ? (
							<svg
								width="13"
								height="13"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<polyline
									points="2,8 6,12 14,4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : (
							<svg
								width="13"
								height="13"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<circle cx="12" cy="4" r="1.5" />
								<circle cx="4" cy="8" r="1.5" />
								<circle cx="12" cy="12" r="1.5" />
								<path d="M5.5 7.5l5-2.5M5.5 8.5l5 2.5" />
							</svg>
						)}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								title={t("library.textDetail.more")}
								className="w-7 h-7 rounded-base border border-bd-2 flex items-center justify-center text-t-2 hover:bg-surf-2 transition-colors data-[state=open]:bg-surf-2"
							>
								<svg
									width="13"
									height="13"
									viewBox="0 0 16 16"
									fill="currentColor"
								>
									<circle cx="8" cy="3" r="1.3" />
									<circle cx="8" cy="8" r="1.3" />
									<circle cx="8" cy="13" r="1.3" />
								</svg>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-[168px]">
							<DropdownMenuItem
								onSelect={handleBookmarkSelect}
								disabled={bookmarkMutation.isPending}
							>
								<BookmarkMenuIcon filled={text.isFavorite} />
								{text.isFavorite
									? t("library.textDetail.moreMenu.unbookmark")
									: t("library.textDetail.moreMenu.bookmark")}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={handleReportSelect}
								variant="destructive"
							>
								<FlagIcon />
								{t("library.textDetail.moreMenu.report")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>

			{/* Scrollable content */}
			<main className="flex-1 overflow-y-auto px-8 pb-12 pt-7 [scrollbar-color:var(--bd-2)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-bd-2 max-sm:px-3.5 max-sm:pt-4 max-md:px-5">
				<div className="max-w-[860px]">
					<TextHero
						id={id}
						lang={lang}
						title={text.title}
						language={text.language}
						level={text.level}
						author={text.author}
						wordCount={text.wordCount}
						readingTime={text.readingTime}
						progressPercent={text.progressPercent}
						currentPage={text.currentPage}
						totalPages={text.totalPages}
						imageUrl={text.imageUrl}
						t={t}
					/>

					<TextDescription description={text.description} t={t} />

					{text.tags.length > 0 && (
						<div className="mb-4">
							<TextTagsCard tags={text.tags} t={t} />
						</div>
					)}

					<div className="grid grid-cols-2 gap-3 mb-4 animate-[fadeUp_0.3s_0.1s_ease_both] max-sm:grid-cols-1 max-sm:gap-2.5">
						<TextProgressCard
							progressPercent={text.progressPercent}
							currentPage={text.currentPage}
							totalPages={text.totalPages}
							lastOpened={text.lastOpened}
							t={t}
						/>
						<TextVocabCard wordStats={text.wordStats} t={t} />
						<TextInfoCard
							level={text.level}
							language={text.language}
							author={text.author}
							source={text.source}
							publishedAt={text.publishedAt}
							totalPages={text.totalPages}
							wordCount={text.wordCount}
							lang={lang}
							t={t}
						/>
						{text.totalPages > 0 && (
							<TextPagesCard
								pages={text.pages}
								currentPage={text.currentPage}
								progressPercent={text.progressPercent}
								t={t}
							/>
						)}
					</div>

					{related.isSuccess && related.data.length > 0 && (
						<TextRelated items={related.data} lang={lang} t={t} />
					)}
				</div>
			</main>

			<TextReportDialog
				id={id}
				open={reportOpen}
				onOpenChange={setReportOpen}
				t={t}
			/>
		</div>
	);
};

