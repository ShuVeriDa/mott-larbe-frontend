import Link from "next/link";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import type { CefrLevel } from "@/shared/types";
import type { LibraryTextLanguage } from "@/entities/library-text";
import { TextCover } from "./text-cover";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

interface TextHeroProps {
	id: string;
	lang: string;
	title: string;
	language: LibraryTextLanguage;
	level: CefrLevel | null;
	author: string | null;
	wordCount: number;
	readingTime: number;
	progressPercent: number;
	currentPage: number;
	totalPages: number;
	isFavorite: boolean;
	imageUrl: string | null;
	t: Translator;
	onToggleBookmark: () => void;
	isBookmarking: boolean;
}

const CEFR_VARIANT: Record<CefrLevel, "acc" | "grn" | "amb" | "pur" | "red"> = {
	A1: "acc",
	A2: "grn",
	B1: "amb",
	B2: "pur",
	C1: "red",
	C2: "red",
};

export const TextHero = ({
	id,
	lang,
	title,
	language,
	level,
	author,
	wordCount,
	readingTime,
	progressPercent,
	currentPage,
	totalPages,
	isFavorite,
	imageUrl,
	t,
	onToggleBookmark,
	isBookmarking,
}: TextHeroProps) => {
	const readPage = currentPage > 0 ? currentPage : 1;
	const readerHref = `/${lang}/reader/${id}/p/${readPage}`;
	const isCompleted = progressPercent >= 100;
	const isStarted = progressPercent > 0;

	return (
		<div className="flex gap-5 mb-6 animate-[fadeUp_0.3s_ease_both] max-sm:gap-3.5">
			<TextCover language={language} imageUrl={imageUrl} />

			<div className="flex-1 min-w-0 flex flex-col gap-2.5">
				<div className="flex items-center gap-1.5 flex-wrap">
					{level && (
						<Badge variant={CEFR_VARIANT[level]}>{level}</Badge>
					)}
					<Badge variant="acc">{t(`library.lang.${language}`)}</Badge>
					<Badge variant="neu">
						{t("library.textDetail.status.published")}
					</Badge>
				</div>

				<h1 className="font-display text-[22px] font-normal text-t-1 leading-[1.3] tracking-[-0.2px] max-sm:text-[18px]">
					{title}
				</h1>

				<div className="flex items-center gap-2.5 text-xs text-t-3 flex-wrap max-sm:gap-1.5 max-sm:text-[11px]">
					{author && <span>{author}</span>}
					{author && (
						<span className="w-[2px] h-[2px] rounded-full bg-t-4" />
					)}
					<span>
						{wordCount.toLocaleString()} {t("library.card.wordsUnit")}
					</span>
					<span className="w-[2px] h-[2px] rounded-full bg-t-4" />
					<span>
						~{readingTime} {t("library.card.minUnit")}
					</span>
				</div>

				<div className="flex items-center gap-2 mt-0.5 flex-wrap max-[380px]:gap-1.5">
					{isCompleted ? (
						<span
							className={cn(
								buttonVariants({ variant: "ghost", size: "lg" }),
								"cursor-default opacity-50",
							)}
						>
							{t("library.textDetail.cta.completed")}
						</span>
					) : (
						<Link
							href={readerHref}
							className={buttonVariants({ variant: "action", size: "lg" })}
						>
							{isStarted
								? t("library.textDetail.cta.continue")
								: t("library.textDetail.cta.start")}
						</Link>
					)}

					{isStarted && !isCompleted && (
						<Link
							href={readerHref}
							className={buttonVariants({ variant: "ghost", size: "lg" })}
						>
							{t("library.textDetail.cta.page", {
								cur: currentPage,
								total: totalPages,
							})}
						</Link>
					)}

					<button
						type="button"
						onClick={onToggleBookmark}
						disabled={isBookmarking}
						className={cn(
							"w-8 h-8 rounded-base border border-bd-2 flex items-center justify-center",
							"text-t-3 hover:text-t-1 hover:bg-surf-2 transition-colors",
							"disabled:opacity-40 disabled:cursor-default",
							isFavorite && "text-amb-t border-amb/30 bg-amb-bg",
						)}
					>
						<BookmarkIcon filled={isFavorite} />
					</button>
				</div>
			</div>
		</div>
	);
};

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
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
