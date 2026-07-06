"use client";

import { Typography } from "@/shared/ui/typography";

import { duration, ease, variants } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, Ellipsis, Share2 } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { detailCardVariants, detailGridVariants } from "../lib/variants";
import { useLibraryTextDetailPage } from "../model";
import { BookmarkMenuIcon } from "./bookmark-menu-icon";
import { DetailSkeleton } from "./detail-skeleton";
import { FlagIcon } from "./flag-icon";
import { TextDescription } from "./text-description";
import { TextHero } from "./text-hero";
import { TextInfoCard } from "./text-info-card";
import { TextPagesCard } from "./text-pages-card";
import { TextProgressCard } from "./text-progress-card";
import { TextRelated } from "./text-related";
import { TextReportDialog } from "./text-report-dialog";
import { TextTagsCard } from "./text-tags-card";
import { TextVocabCard } from "./text-vocab-card";

interface LibraryTextDetailPageProps {
	id: string;
}

export const LibraryTextDetailPage = ({ id }: LibraryTextDetailPageProps) => {
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
	} = useLibraryTextDetailPage(id);

	if (detail.isPending) return <DetailSkeleton />;

	if (detail.isError) {
		const handleRetryClick: NonNullable<ComponentProps<"button">["onClick"]> =
			handleRetry;
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-t-3">
				<Typography tag="p" className="text-sm text-t-2">
					{t("library.textDetail.error")}
				</Typography>
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
			<motion.header
				initial={{ opacity: 0, y: -6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: duration.slow, ease: ease.enter }}
				className="h-12 bg-surf border-b border-bd-1 flex items-center gap-2.5 px-5 shrink-0 max-sm:h-11 max-sm:px-3.5"
			>
				<Link
					href={`/${lang}/texts`}
					className="flex items-center gap-1.5 text-xs text-t-2 hover:text-t-1 hover:bg-surf-2 px-2 py-1 rounded-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
				>
					<ChevronLeft size={13} aria-hidden="true" />
					{t("library.textDetail.back")}
				</Link>

				<Typography
					tag="span"
					className="w-px h-3.5 bg-bd-2"
					aria-hidden="true"
				/>

				<nav
					aria-label={t("library.textDetail.breadcrumbNav")}
					className="hidden sm:flex"
				>
					<ol className="flex items-center gap-1.5 text-xs text-t-3">
						<li>
							<Link
								href={`/${lang}/texts`}
								className="hover:text-t-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 rounded-sm"
							>
								{t("nav.texts")}
							</Link>
						</li>
						<li aria-hidden="true" className="text-t-4">
							/
						</li>
						<li aria-current="page" className="text-t-2">
							{t("library.textDetail.breadcrumb")}
						</li>
					</ol>
				</nav>

				<div className="ml-auto flex items-center gap-1.5">
					<Button
						size={"bare"}
						onClick={handleShare}
						title={t("library.textDetail.share")}
						className="w-7 h-7 rounded-base border border-bd-2 flex items-center justify-center text-t-2 hover:bg-surf-2 transition-colors"
					>
						{copied ? <Check size={13} /> : <Share2 size={13} />}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size={"bare"}
								title={t("library.textDetail.more")}
								className="w-7 h-7 rounded-base border border-bd-2 flex items-center justify-center text-t-2 hover:bg-surf-2 transition-colors data-[state=open]:bg-surf-2"
							>
								<Ellipsis size={13} />
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
			</motion.header>

			{/* Scrollable content */}
			<main className="flex justify-center overflow-y-auto px-8 pb-12 pt-7 [scrollbar-color:var(--bd-2)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-bd-2 max-sm:px-3.5 max-sm:pt-4 max-md:px-5">
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

					<motion.div
						variants={variants.fadeUp}
						initial="hidden"
						animate="visible"
					>
						<TextDescription description={text.description} t={t} />
					</motion.div>

					{text.tags.length > 0 && (
						<motion.div
							className="mb-4"
							variants={variants.fadeUp}
							initial="hidden"
							animate="visible"
						>
							<TextTagsCard tags={text.tags} t={t} />
						</motion.div>
					)}

					<motion.div
						className="grid grid-cols-2 gap-3 mb-4 max-sm:grid-cols-1 max-sm:gap-2.5"
						variants={detailGridVariants}
						initial="hidden"
						animate="visible"
					>
						<motion.div variants={detailCardVariants}>
							<TextProgressCard
								progressPercent={text.progressPercent}
								currentPage={text.currentPage}
								totalPages={text.totalPages}
								lastOpened={text.lastOpened}
								t={t}
							/>
						</motion.div>
						<motion.div variants={detailCardVariants}>
							<TextVocabCard wordStats={text.wordStats} t={t} />
						</motion.div>
						<motion.div variants={detailCardVariants}>
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
						</motion.div>
						{text.totalPages > 0 && (
							<motion.div variants={detailCardVariants}>
								<TextPagesCard
									pages={text.pages}
									currentPage={text.currentPage}
									progressPercent={text.progressPercent}
									t={t}
								/>
							</motion.div>
						)}
					</motion.div>

					<AnimatePresence>
						{related.isSuccess && related.data.length > 0 && (
							<motion.div
								key="related"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: duration.slow, ease: ease.enter }}
							>
								<TextRelated items={related.data} lang={lang} t={t} />
							</motion.div>
						)}
					</AnimatePresence>
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
