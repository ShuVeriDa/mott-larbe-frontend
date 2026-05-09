"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/shared/lib/i18n";
import {
	libraryTextApi,
	libraryTextKeys,
	useLibraryTextDetail,
	useLibraryTextRelated,
} from "@/entities/library-text";
import type { LibraryTextDetail } from "@/entities/library-text";
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

interface LibraryTextDetailPageProps {
	id: string;
}

export const LibraryTextDetailPage = ({ id }: LibraryTextDetailPageProps) => {
	const { t, lang } = useI18n();
	const qc = useQueryClient();

	const detail = useLibraryTextDetail(id);
	const related = useLibraryTextRelated(id);

	const [copied, setCopied] = useState(false);
	const [reportOpen, setReportOpen] = useState(false);

	const bookmarkMutation = useMutation({
		mutationFn: () => libraryTextApi.toggleBookmark(id),
		onMutate: async () => {
			await qc.cancelQueries({ queryKey: libraryTextKeys.detail(id) });
			const prev = qc.getQueryData<LibraryTextDetail>(libraryTextKeys.detail(id));
			qc.setQueryData<LibraryTextDetail>(libraryTextKeys.detail(id), (old) =>
				old ? { ...old, isFavorite: !old.isFavorite } : old,
			);
			return { prev };
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) {
				qc.setQueryData(libraryTextKeys.detail(id), ctx.prev);
			}
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: libraryTextKeys.detail(id) });
		},
	});

	const handleShare = useCallback(() => {
		const url = window.location.href;
		if (typeof navigator.share === "function") {
			navigator.share({ url }).catch(() => {});
		} else {
			navigator.clipboard
				.writeText(url)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 1800);
				})
				.catch(() => {});
		}
	}, []);

	if (detail.isPending) return <DetailSkeleton />;

	if (detail.isError) {
				const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => detail.refetch();
return (
			<div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-t-3">
				<p className="text-sm text-t-2">{t("library.textDetail.error")}</p>
				<button
					type="button"
					onClick={handleClick}
					className="text-xs text-acc-t hover:underline"
				>
					{t("library.textDetail.retry")}
				</button>
			</div>
		);
	}

	const text = detail.data;

		const handleSelect: NonNullable<React.ComponentProps<typeof DropdownMenuItem>["onSelect"]> = () => bookmarkMutation.mutate();
	const handleSelect2: NonNullable<React.ComponentProps<typeof DropdownMenuItem>["onSelect"]> = () => setReportOpen(true);
return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Topbar */}
			<div className="h-12 bg-panel border-b border-bd-1 flex items-center gap-2.5 px-5 shrink-0 max-sm:h-11 max-sm:px-3.5">
				<Link
					href={`/${lang}/texts`}
					className="flex items-center gap-1.5 text-xs text-t-2 hover:text-t-1 hover:bg-surf-2 px-2 py-1 rounded-base transition-colors"
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<path d="M10 12L6 8l4-4" />
					</svg>
					{t("library.textDetail.back")}
				</Link>

				<span className="w-px h-3.5 bg-bd-2" />

				<span className="text-xs text-t-3 hidden sm:flex items-center gap-1.5">
					<Link
						href={`/${lang}/texts`}
						className="hover:text-t-2 transition-colors"
					>
						{t("nav.texts")}
					</Link>
					<span className="text-t-4">/</span>
					<span className="text-t-2">{t("library.textDetail.breadcrumb")}</span>
				</span>

				<div className="ml-auto flex items-center gap-1.5">
					<button
						type="button"
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
					</button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
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
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-[168px]">
							<DropdownMenuItem
								onSelect={handleSelect}
								disabled={bookmarkMutation.isPending}
							>
								<BookmarkMenuIcon filled={text.isFavorite} />
								{text.isFavorite
									? t("library.textDetail.moreMenu.unbookmark")
									: t("library.textDetail.moreMenu.bookmark")}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={handleSelect2}
								variant="destructive"
							>
								<FlagIcon />
								{t("library.textDetail.moreMenu.report")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto px-8 pb-12 pt-7 [scrollbar-color:var(--bd-2)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-bd-2 max-sm:px-3.5 max-sm:pt-4 max-md:px-5">
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
			</div>

			<TextReportDialog
				id={id}
				open={reportOpen}
				onOpenChange={setReportOpen}
				t={t}
			/>
		</div>
	);
};

const BookmarkMenuIcon = ({ filled }: { filled: boolean }) => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 16 16"
		fill={filled ? "currentColor" : "none"}
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M4 2h8a1 1 0 0 1 1 1v11l-5-3-5 3V3a1 1 0 0 1 1-1z" />
	</svg>
);

const FlagIcon = () => (
	<svg
		width="13"
		height="13"
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M3 2v12M3 2h8l-2 3.5L11 9H3" />
	</svg>
);

const DetailSkeleton = () => (
	<div className="flex flex-1 flex-col overflow-hidden">
		<div className="h-12 bg-panel border-b border-bd-1 shrink-0" />
		<div className="flex-1 overflow-y-auto px-8 pb-12 pt-7 max-sm:px-3.5 max-sm:pt-4 max-md:px-5">
			<div className="max-w-[860px] animate-pulse">
				<div className="flex gap-5 mb-6">
					<div className="w-[88px] h-[126px] rounded-card bg-surf-3 shrink-0" />
					<div className="flex-1 flex flex-col gap-3 pt-1">
						<div className="flex gap-1.5">
							<div className="h-5 w-8 rounded bg-surf-3" />
							<div className="h-5 w-16 rounded bg-surf-3" />
						</div>
						<div className="h-6 w-2/3 rounded bg-surf-3" />
						<div className="h-4 w-1/2 rounded bg-surf-3" />
						<div className="flex gap-2">
							<div className="h-9 w-28 rounded-base bg-surf-3" />
							<div className="h-9 w-20 rounded-base bg-surf-3" />
						</div>
					</div>
				</div>
				<div className="h-20 rounded-card bg-surf-3 mb-4" />
				<div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-44 rounded-card bg-surf-3" />
					))}
				</div>
			</div>
		</div>
	</div>
);
