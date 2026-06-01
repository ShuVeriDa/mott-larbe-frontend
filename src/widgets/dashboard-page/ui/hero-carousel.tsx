"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { LANG_TAG } from "@/shared/lib/lang-tag";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/shared/ui/carousel";
import { Typography } from "@/shared/ui/typography";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { getLibraryPreviewLevelColors } from "../lib/library-preview-level-styles";

interface HeroCarouselProps {
	items: LibraryTextListItem[];
	lang: string;
}

const AUTOPLAY_DELAY = 5000;

export const HeroCarousel = ({ items, lang }: HeroCarouselProps) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	const handleDotClick = useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api],
	);

	// Track current slide
	useEffect(() => {
		if (!api) return;
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());
		const onSelect = () => setCurrent(api.selectedScrollSnap());
		api.on("select", onSelect);
		return () => { api.off("select", onSelect); };
	}, [api]);

	// Autoplay
	useEffect(() => {
		if (!api) return;
		const id = setInterval(() => {
			if (api.canScrollNext()) {
				api.scrollNext();
			} else {
				api.scrollTo(0);
			}
		}, AUTOPLAY_DELAY);
		return () => clearInterval(id);
	}, [api]);

	if (items.length === 0) return null;

	return (
		<section className="relative" aria-label="Featured texts">
			<Carousel
				setApi={setApi}
				opts={{ loop: true, align: "start" }}
				className="w-full"
			>
				<CarouselContent className="-ml-0">
					{items.map((item, i) => (
						<CarouselItem key={item.id} className="pl-0">
							<HeroSlide item={item} lang={lang} isActive={i === current} />
						</CarouselItem>
					))}
				</CarouselContent>

				{/* Arrow buttons — inside the slide, overlaid */}
				<HeroArrow direction="prev" onClick={() => api?.scrollPrev()} />
				<HeroArrow direction="next" onClick={() => api?.scrollNext()} />
			</Carousel>

			{/* Dot indicators */}
			{count > 1 && (
				<div className="mt-3 flex items-center justify-center gap-1.5">
					{Array.from({ length: count }).map((_, i) => (
						<button
							key={i}
							type="button"
							aria-label={`Slide ${i + 1}`}
							onClick={() => handleDotClick(i)}
							className={cn(
								"rounded-full transition-all duration-300",
								i === current
									? "w-5 h-[6px] bg-acc"
									: "size-[6px] bg-bd-2 hover:bg-bd-3",
							)}
						/>
					))}
				</div>
			)}
		</section>
	);
};

interface HeroSlideProps {
	item: LibraryTextListItem;
	lang: string;
	isActive: boolean;
}

const HeroSlide = ({ item, lang, isActive }: HeroSlideProps) => {
	const { t } = useI18n();
	const colors = getLibraryPreviewLevelColors(item.level);
	const pct = Math.round(item.progressPercent);

	return (
		<Link
			href={`/${lang}/texts/${item.id}`}
			tabIndex={isActive ? 0 : -1}
			className="group relative flex h-[200px] w-full overflow-hidden rounded-card border border-bd-1 bg-surf transition-[border-color,box-shadow] hover:border-bd-2 hover:[box-shadow:0_4px_20px_4px_var(--card-glow)] md:h-[240px] lg:h-[280px]"
			style={{ "--card-glow": `${colors.glow}60` } as CSSProperties}
		>
			{/* Colored background */}
			<div className={`absolute inset-0 ${colors.cov} opacity-60`} />

			{/* Left accent stripe */}
			<div
				aria-hidden="true"
				className="absolute left-0 top-0 bottom-0 w-1"
				style={{ background: colors.stripe }}
			/>

			{/* Book icon — decorative */}
			<div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 max-sm:right-4">
				<BookOpen
					size={120}
					style={{ color: colors.stripe }}
					aria-hidden="true"
					className="md:!size-[150px] lg:!size-[180px]"
				/>
			</div>

			{/* Content */}
			<div className="relative flex flex-1 flex-col justify-between p-5 max-sm:p-4">
				{/* Top badges */}
				<div className="flex items-center gap-2">
					{item.level && (
						<Typography
							tag="span"
							className={`rounded-[5px] px-2 py-[3px] text-[11px] font-bold ${colors.badge}`}
						>
							{t(`shared.cefrLevel.${item.level}`)}
						</Typography>
					)}
					<Typography
						tag="span"
						className="rounded-[5px] bg-surf/60 px-2 py-[3px] text-[11px] font-medium text-t-2 backdrop-blur-sm"
					>
						{LANG_TAG[item.language] ?? item.language}
					</Typography>
					{item.isNew && (
						<Typography
							tag="span"
							className="rounded-[5px] bg-acc px-2 py-[3px] text-[11px] font-bold uppercase tracking-wide text-white"
						>
							{t("library.card.badgeNew")}
						</Typography>
					)}
				</div>

				{/* Title + author */}
				<div>
					<Typography
						tag="h3"
						className="mb-1 line-clamp-2 text-[18px] font-bold leading-tight text-t-1 md:text-[22px] lg:text-[26px]"
					>
						{item.title}
					</Typography>
					{item.author && (
						<Typography tag="p" className="text-[12px] text-t-3">
							{item.author}
						</Typography>
					)}
				</div>

				{/* Footer: progress or word count + CTA */}
				<div className="flex items-center justify-between gap-3">
					<div className="flex-1">
						{pct > 0 ? (
							<div className="flex items-center gap-2">
								<div className="h-[3px] flex-1 overflow-hidden rounded-full bg-surf/40">
									<div
										className="h-full rounded-full"
										style={{
											width: `${pct}%`,
											background: pct >= 80 ? "var(--grn)" : "var(--acc)",
										}}
									/>
								</div>
								<Typography tag="span" className="text-[11px] text-t-2">
									{pct}%
								</Typography>
							</div>
						) : (
							<Typography tag="span" className="text-[11px] text-t-3">
								{item.wordCount.toLocaleString()} {t("library.card.wordsUnit")}
								{item.readingTime > 0 && ` · ${item.readingTime} ${t("library.card.minUnit")}`}
							</Typography>
						)}
					</div>

					<Typography
						tag="span"
						className={`shrink-0 rounded-base px-3 py-[6px] text-[12px] font-semibold transition-opacity group-hover:opacity-90 ${colors.badge}`}
					>
						{pct > 0 ? t("dashboard.continueReading.continue") : t("library.card.start")}
					</Typography>
				</div>
			</div>
		</Link>
	);
};

interface HeroArrowProps {
	direction: "prev" | "next";
	onClick: () => void;
}

const HeroArrow = ({ direction, onClick }: HeroArrowProps) => {
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		onClick();
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
			className={cn(
				"absolute top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full border border-bd-2 bg-surf/80 shadow-md backdrop-blur-sm transition-opacity hover:opacity-90 max-sm:hidden",
				direction === "prev" ? "left-3" : "right-3",
			)}
		>
			{direction === "prev" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
		</button>
	);
};

const ChevronLeftIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 text-t-1" aria-hidden="true">
		<path d="M9 2.5 4.5 7 9 11.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const ChevronRightIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 text-t-1" aria-hidden="true">
		<path d="M5 2.5 9.5 7 5 11.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
