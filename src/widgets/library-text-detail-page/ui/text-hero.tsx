"use client";

import type { LibraryTextLanguage } from "@/entities/library-text";
import { cn } from "@/shared/lib/cn";
import type { CefrLevel } from "@/shared/types";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { CefrBadge } from "@/shared/ui/cefr-badge";
import { duration, ease } from "@/shared/lib/animation";
import { motion } from "framer-motion";
import Link from "next/link";
import { TextCover } from "./text-cover";
import { TextReadersCount } from "./text-readers-count";

import { Typography } from "@/shared/ui/typography";
type Translator = (
	key: string,
	vars?: Record<string, string | number>,
) => string;

interface TextHeroProps {
	id: string;
	lang: string;
	title: string;
	language: LibraryTextLanguage;
	level: CefrLevel | null;
	author: string | null;
	wordCount: number;
	readingTime: number;
	readersCount: number;
	progressPercent: number;
	currentPage: number;
	totalPages: number;
	imageUrl: string | null;
	t: Translator;
}

export const TextHero = ({
	id,
	lang,
	title,
	language,
	level,
	author,
	wordCount,
	readingTime,
	readersCount,
	progressPercent,
	currentPage,
	totalPages,
	imageUrl,
	t,
}: TextHeroProps) => {
	const readPage = currentPage > 0 ? currentPage : 1;
	const readerHref = `/${lang}/reader/${id}/p/${readPage}`;
	const restartHref = `/${lang}/reader/${id}/p/1`;
	const isCompleted = progressPercent >= 100;
	const isStarted = progressPercent > 0;
	const isNotReady = totalPages === 0;

	return (
		<motion.div
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: duration.slower, ease: ease.enter }}
			className="flex gap-5 mb-6 max-sm:gap-3.5"
		>
			<TextCover language={language} imageUrl={imageUrl} title={title} priority />

			<div className="flex-1 min-w-0 flex flex-col gap-2.5">
				<div className="flex items-center gap-1.5 flex-wrap">
					<CefrBadge level={level} />
					<Badge variant="acc">{t(`shared.lang.${language}`)}</Badge>
					<Badge variant="neu">
						{t("library.textDetail.status.published")}
					</Badge>
					{isCompleted && (
						<Badge variant="grn">
							{t("library.textDetail.status.completed")}
						</Badge>
					)}
				</div>

				<Typography
					tag="h1"
					className="font-display text-[22px] font-normal text-t-1 leading-[1.3] tracking-[-0.2px] max-sm:text-[18px]"
				>
					{title}
				</Typography>

				<div className="flex items-center gap-2.5 text-xs text-t-3 flex-wrap max-sm:gap-1.5 max-sm:text-[11px]">
					{author && <Typography tag="span">{author}</Typography>}
					{author && (
						<Typography
							tag="span"
							className="w-[2px] h-[2px] rounded-full bg-t-4"
						/>
					)}
					<Typography tag="span">
						{wordCount.toLocaleString()} {t("library.card.wordsUnit")}
					</Typography>
					<Typography
						tag="span"
						className="w-[2px] h-[2px] rounded-full bg-t-4"
					/>
					<Typography tag="span">
						~{readingTime} {t("library.card.minUnit")}
					</Typography>
					{readersCount > 0 && (
						<>
							<Typography
								tag="span"
								className="w-[2px] h-[2px] rounded-full bg-t-4"
							/>
							<TextReadersCount count={readersCount} t={t} />
						</>
					)}
				</div>

				<div className="flex items-center gap-2 mt-0.5 flex-wrap max-[380px]:gap-1.5">
					{isNotReady ? (
						<Typography
							tag="span"
							className={cn(
								buttonVariants({ variant: "ghost", size: "lg" }),
								"cursor-default opacity-50",
							)}
						>
							{t("library.textDetail.cta.notReady")}
						</Typography>
					) : isCompleted ? (
						<Link
							href={restartHref}
							className={buttonVariants({ variant: "action", size: "lg" })}
						>
							{t("library.textDetail.cta.restart")}
						</Link>
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

					{isStarted && !isNotReady && (
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
				</div>
			</div>
		</motion.div>
	);
};
