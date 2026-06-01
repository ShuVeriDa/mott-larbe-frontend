"use client";

import type { Genre } from "@/entities/genre";
import { useGenres } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import type { CSSProperties } from "react";
import { HorizontalScrollRow } from "./horizontal-scroll-row";
import { SectionHeader } from "./section-header";

interface GenresSectionProps {
	lang: string;
}

const GENRE_COLORS: Record<string, { bg: string; color: string; glow: string }> = {
	poetry:      { bg: "bg-pur-bg",  color: "text-pur-t",  glow: "#9333ea" },
	poem:        { bg: "bg-pur-bg",  color: "text-pur-t",  glow: "#9333ea" },
	prose:       { bg: "bg-acc-bg",  color: "text-acc-t",  glow: "#2563eb" },
	story:       { bg: "bg-acc-bg",  color: "text-acc-t",  glow: "#2563eb" },
	novella:     { bg: "bg-acc-bg",  color: "text-acc-t",  glow: "#2563eb" },
	novel:       { bg: "bg-acc-bg",  color: "text-acc-t",  glow: "#2563eb" },
	"fairy-tale":{ bg: "bg-grn-bg",  color: "text-grn-t",  glow: "#22c55e" },
	legend:      { bg: "bg-grn-bg",  color: "text-grn-t",  glow: "#22c55e" },
	epic:        { bg: "bg-amb-bg",  color: "text-amb-t",  glow: "#f59e0b" },
	history:     { bg: "bg-amb-bg",  color: "text-amb-t",  glow: "#f59e0b" },
	journalism:  { bg: "bg-surf-3",  color: "text-t-2",    glow: "#6b7280" },
	drama:       { bg: "bg-pur-bg",  color: "text-pur-t",  glow: "#9333ea" },
	fable:       { bg: "bg-grn-bg",  color: "text-grn-t",  glow: "#22c55e" },
	essay:       { bg: "bg-surf-3",  color: "text-t-2",    glow: "#6b7280" },
	religion:    { bg: "bg-amb-bg",  color: "text-amb-t",  glow: "#f59e0b" },
};

const DEFAULT_COLORS = { bg: "bg-surf-3", color: "text-t-2", glow: "#6b7280" };

const getGenreColors = (slug: string) => GENRE_COLORS[slug] ?? DEFAULT_COLORS;

export const GenresSection = ({ lang }: GenresSectionProps) => {
	const { t } = useI18n();
	const { data: genres, isPending } = useGenres();

	if (!isPending && (!genres || genres.length === 0)) return null;

	return (
		<section className="flex flex-col gap-3">
			<SectionHeader title={t("dashboard.genres.title")} />

			{isPending ? (
				<div className="flex gap-2.5 overflow-hidden">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="h-[80px] w-[68px] shrink-0 animate-pulse rounded-card bg-surf-2 md:w-[76px] lg:w-[82px] xl:w-[92px]"
						/>
					))}
				</div>
			) : (
				<HorizontalScrollRow>
					{(genres ?? []).map((genre) => (
						<GenreCard key={genre.id} genre={genre} lang={lang} />
					))}
				</HorizontalScrollRow>
			)}
		</section>
	);
};

interface GenreCardProps {
	genre: Genre;
	lang: string;
}

const GenreCard = ({ genre, lang }: GenreCardProps) => {
	const colors = getGenreColors(genre.slug);

	return (
		<Link
			href={`/${lang}/texts?genreId=${genre.id}`}
			className="group flex w-[68px] shrink-0 flex-col items-center gap-1.5 rounded-card border border-bd-1 bg-surf p-2 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-px hover:border-bd-2 hover:[box-shadow:0_4px_14px_2px_var(--genre-glow)] md:w-[76px] md:p-2.5 lg:w-[82px] xl:w-[92px] xl:p-3"
			style={{ "--genre-glow": `${colors.glow}90` } as CSSProperties}
		>
			<div
				className={`flex size-8 items-center justify-center rounded-lg md:size-9 lg:size-10 xl:size-11 ${colors.bg} ${colors.color} transition-transform duration-150 group-hover:scale-105`}
			>
				<BookIcon />
			</div>
			<Typography
				tag="span"
				className="line-clamp-2 text-center text-[10px] leading-tight text-t-2 md:text-[11px]"
			>
				{genre.name}
			</Typography>
		</Link>
	);
};

const BookIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-4" aria-hidden="true">
		<path d="M3 2h4.5a2 2 0 0 1 2 2v9a2 2 0 0 0-2-2H3V2z" strokeLinejoin="round" />
		<path d="M13 2H8.5a2 2 0 0 0-2 2v9a2 2 0 0 1 2-2H13V2z" strokeLinejoin="round" />
	</svg>
);
