"use client";

import type { Genre } from "@/entities/genre";
import { useGenres } from "@/entities/genre";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	Anchor,
	Award,
	Baby,
	BookHeart,
	BookMarked,
	BookOpen,
	BookText,
	Brain,
	Castle,
	Compass,
	Crown,
	Drama,
	Feather,
	Film,
	Flame,
	Ghost,
	Globe,
	GraduationCap,
	Heart,
	History,
	Landmark,
	Laugh,
	Layers,
	Leaf,
	Moon,
	Mountain,
	Music,
	Newspaper,
	Palette,
	Quote,
	Rocket,
	Scale,
	ScrollText,
	Shield,
	Skull,
	Sparkles,
	Sword,
	Theater,
	Telescope,
	Trophy,
	Users,
	Wand,
	Wind,
	Zap,
	type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { HorizontalScrollRow } from "./horizontal-scroll-row";
import { SectionHeader } from "./section-header";

interface GenresSectionProps {
	lang: string;
}

interface GenreStyle {
	gradient: string;
	iconColor: string;
	glow: string;
	icon: LucideIcon;
}

const GENRE_STYLES: Record<string, GenreStyle> = {
	// ── Поэзия ───────────────────────────────────────────────────────────────
	poetry:         { gradient: "from-violet-500/20 to-purple-600/10",  iconColor: "text-violet-400",  glow: "#8b5cf6", icon: Feather },
	poem:           { gradient: "from-violet-500/20 to-purple-600/10",  iconColor: "text-violet-400",  glow: "#8b5cf6", icon: Feather },
	lyrics:         { gradient: "from-purple-500/20 to-fuchsia-600/10", iconColor: "text-purple-400",  glow: "#a855f7", icon: Music },
	ode:            { gradient: "from-violet-500/20 to-indigo-600/10",  iconColor: "text-violet-400",  glow: "#8b5cf6", icon: Feather },
	sonnet:         { gradient: "from-fuchsia-500/20 to-purple-600/10", iconColor: "text-fuchsia-400", glow: "#d946ef", icon: Feather },

	// ── Проза ────────────────────────────────────────────────────────────────
	prose:          { gradient: "from-blue-500/20 to-indigo-600/10",    iconColor: "text-blue-400",    glow: "#3b82f6", icon: BookOpen },
	story:          { gradient: "from-blue-500/20 to-indigo-600/10",    iconColor: "text-blue-400",    glow: "#3b82f6", icon: BookOpen },
	novella:        { gradient: "from-sky-500/20 to-blue-600/10",       iconColor: "text-sky-400",     glow: "#0ea5e9", icon: BookText },
	novel:          { gradient: "from-sky-500/20 to-blue-600/10",       iconColor: "text-sky-400",     glow: "#0ea5e9", icon: BookText },
	"short-story":  { gradient: "from-blue-500/20 to-cyan-600/10",      iconColor: "text-blue-400",    glow: "#3b82f6", icon: BookOpen },
	memoir:         { gradient: "from-indigo-500/20 to-blue-600/10",    iconColor: "text-indigo-400",  glow: "#6366f1", icon: BookHeart },
	autobiography:  { gradient: "from-indigo-500/20 to-violet-600/10",  iconColor: "text-indigo-400",  glow: "#6366f1", icon: BookHeart },
	biography:      { gradient: "from-indigo-500/20 to-violet-600/10",  iconColor: "text-indigo-400",  glow: "#6366f1", icon: BookMarked },

	// ── Сказки / Фантастика ──────────────────────────────────────────────────
	"fairy-tale":   { gradient: "from-emerald-500/20 to-green-600/10",  iconColor: "text-emerald-400", glow: "#10b981", icon: Sparkles },
	fable:          { gradient: "from-lime-500/20 to-green-600/10",     iconColor: "text-lime-400",    glow: "#84cc16", icon: Wand },
	fantasy:        { gradient: "from-purple-500/20 to-violet-600/10",  iconColor: "text-purple-400",  glow: "#a855f7", icon: Wand },
	mythology:      { gradient: "from-amber-500/20 to-yellow-600/10",   iconColor: "text-amber-400",   glow: "#f59e0b", icon: Crown },
	"sci-fi":       { gradient: "from-cyan-500/20 to-blue-600/10",      iconColor: "text-cyan-400",    glow: "#06b6d4", icon: Rocket },
	"science-fiction": { gradient: "from-cyan-500/20 to-blue-600/10",   iconColor: "text-cyan-400",    glow: "#06b6d4", icon: Rocket },
	utopia:         { gradient: "from-teal-500/20 to-cyan-600/10",      iconColor: "text-teal-400",    glow: "#14b8a6", icon: Globe },
	dystopia:       { gradient: "from-slate-500/20 to-zinc-600/10",     iconColor: "text-slate-400",   glow: "#475569", icon: Skull },
	horror:         { gradient: "from-red-500/20 to-rose-600/10",       iconColor: "text-red-400",     glow: "#ef4444", icon: Ghost },
	gothic:         { gradient: "from-zinc-500/20 to-slate-700/10",     iconColor: "text-zinc-400",    glow: "#52525b", icon: Castle },
	thriller:       { gradient: "from-red-500/20 to-orange-600/10",     iconColor: "text-red-400",     glow: "#ef4444", icon: Zap },
	mystery:        { gradient: "from-slate-500/20 to-indigo-600/10",   iconColor: "text-slate-400",   glow: "#64748b", icon: Telescope },
	detective:      { gradient: "from-zinc-500/20 to-slate-600/10",     iconColor: "text-zinc-400",    glow: "#64748b", icon: Telescope },

	// ── Легенды / Эпос / Исторические ────────────────────────────────────────
	legend:         { gradient: "from-teal-500/20 to-emerald-600/10",   iconColor: "text-teal-400",    glow: "#14b8a6", icon: Mountain },
	epic:           { gradient: "from-amber-500/20 to-orange-600/10",   iconColor: "text-amber-400",   glow: "#f59e0b", icon: Sword },
	history:        { gradient: "from-orange-500/20 to-amber-600/10",   iconColor: "text-orange-400",  glow: "#f97316", icon: History },
	"historical-fiction": { gradient: "from-amber-500/20 to-orange-600/10", iconColor: "text-amber-400", glow: "#f59e0b", icon: Landmark },
	chronicle:      { gradient: "from-stone-500/20 to-amber-600/10",    iconColor: "text-stone-400",   glow: "#78716c", icon: ScrollText },
	folklore:       { gradient: "from-green-500/20 to-teal-600/10",     iconColor: "text-green-400",   glow: "#22c55e", icon: Wind },
	adventure:      { gradient: "from-green-500/20 to-emerald-600/10",  iconColor: "text-green-400",   glow: "#22c55e", icon: Compass },
	war:            { gradient: "from-red-500/20 to-rose-700/10",       iconColor: "text-red-400",     glow: "#ef4444", icon: Shield },

	// ── Журналистика / Нон-фикшн ─────────────────────────────────────────────
	journalism:     { gradient: "from-slate-500/20 to-gray-600/10",     iconColor: "text-slate-400",   glow: "#64748b", icon: Newspaper },
	essay:          { gradient: "from-zinc-500/20 to-slate-600/10",     iconColor: "text-zinc-400",    glow: "#71717a", icon: Quote },
	"non-fiction":  { gradient: "from-gray-500/20 to-slate-600/10",     iconColor: "text-gray-400",    glow: "#6b7280", icon: BookMarked },
	documentary:    { gradient: "from-neutral-500/20 to-gray-600/10",   iconColor: "text-neutral-400", glow: "#737373", icon: Film },
	research:       { gradient: "from-blue-500/20 to-slate-600/10",     iconColor: "text-blue-400",    glow: "#3b82f6", icon: GraduationCap },
	philosophy:     { gradient: "from-indigo-500/20 to-slate-600/10",   iconColor: "text-indigo-400",  glow: "#6366f1", icon: Brain },
	psychology:     { gradient: "from-violet-500/20 to-slate-600/10",   iconColor: "text-violet-400",  glow: "#8b5cf6", icon: Brain },
	science:        { gradient: "from-cyan-500/20 to-teal-600/10",      iconColor: "text-cyan-400",    glow: "#06b6d4", icon: Telescope },
	"self-help":    { gradient: "from-green-500/20 to-teal-600/10",     iconColor: "text-green-400",   glow: "#22c55e", icon: Trophy },
	"travel":       { gradient: "from-sky-500/20 to-teal-600/10",       iconColor: "text-sky-400",     glow: "#0ea5e9", icon: Compass },
	politics:       { gradient: "from-red-500/20 to-slate-600/10",      iconColor: "text-red-400",     glow: "#ef4444", icon: Scale },
	law:            { gradient: "from-slate-500/20 to-zinc-600/10",     iconColor: "text-slate-400",   glow: "#64748b", icon: Scale },

	// ── Драма / Театр ────────────────────────────────────────────────────────
	drama:          { gradient: "from-rose-500/20 to-pink-600/10",      iconColor: "text-rose-400",    glow: "#f43f5e", icon: Theater },
	tragedy:        { gradient: "from-rose-600/20 to-red-700/10",       iconColor: "text-rose-500",    glow: "#f43f5e", icon: Drama },
	comedy:         { gradient: "from-yellow-500/20 to-amber-600/10",   iconColor: "text-yellow-400",  glow: "#eab308", icon: Laugh },
	play:           { gradient: "from-pink-500/20 to-rose-600/10",      iconColor: "text-pink-400",    glow: "#ec4899", icon: Theater },

	// ── Любовный / Социальный ────────────────────────────────────────────────
	romance:        { gradient: "from-pink-500/20 to-rose-600/10",      iconColor: "text-pink-400",    glow: "#ec4899", icon: Heart },
	"love-story":   { gradient: "from-pink-500/20 to-rose-600/10",      iconColor: "text-pink-400",    glow: "#ec4899", icon: Heart },
	"children":     { gradient: "from-yellow-500/20 to-orange-600/10",  iconColor: "text-yellow-400",  glow: "#eab308", icon: Baby },
	"young-adult":  { gradient: "from-orange-500/20 to-pink-600/10",    iconColor: "text-orange-400",  glow: "#f97316", icon: Users },
	social:         { gradient: "from-teal-500/20 to-cyan-600/10",      iconColor: "text-teal-400",    glow: "#14b8a6", icon: Users },

	// ── Духовное / Природа ───────────────────────────────────────────────────
	religion:       { gradient: "from-yellow-500/20 to-amber-600/10",   iconColor: "text-yellow-400",  glow: "#eab308", icon: Moon },
	spiritual:      { gradient: "from-amber-500/20 to-yellow-600/10",   iconColor: "text-amber-400",   glow: "#f59e0b", icon: Moon },
	nature:         { gradient: "from-green-500/20 to-emerald-600/10",  iconColor: "text-green-400",   glow: "#22c55e", icon: Leaf },
	ecology:        { gradient: "from-emerald-500/20 to-teal-600/10",   iconColor: "text-emerald-400", glow: "#10b981", icon: Leaf },

	// ── Искусство ────────────────────────────────────────────────────────────
	art:            { gradient: "from-fuchsia-500/20 to-purple-600/10", iconColor: "text-fuchsia-400", glow: "#d946ef", icon: Palette },
	music:          { gradient: "from-purple-500/20 to-violet-600/10",  iconColor: "text-purple-400",  glow: "#a855f7", icon: Music },
	"cultural":     { gradient: "from-amber-500/20 to-orange-600/10",   iconColor: "text-amber-400",   glow: "#f59e0b", icon: Layers },

	// ── Другое ───────────────────────────────────────────────────────────────
	anthology:      { gradient: "from-slate-500/20 to-blue-600/10",     iconColor: "text-slate-400",   glow: "#64748b", icon: Layers },
	humor:          { gradient: "from-yellow-500/20 to-lime-600/10",    iconColor: "text-yellow-400",  glow: "#eab308", icon: Laugh },
	satire:         { gradient: "from-orange-500/20 to-red-600/10",     iconColor: "text-orange-400",  glow: "#f97316", icon: Laugh },
	aphorism:       { gradient: "from-slate-500/20 to-zinc-600/10",     iconColor: "text-slate-400",   glow: "#64748b", icon: Quote },
	proverb:        { gradient: "from-stone-500/20 to-slate-600/10",    iconColor: "text-stone-400",   glow: "#78716c", icon: Quote },
	parable:        { gradient: "from-amber-500/20 to-stone-600/10",    iconColor: "text-amber-400",   glow: "#f59e0b", icon: Flame },
	interview:      { gradient: "from-sky-500/20 to-blue-600/10",       iconColor: "text-sky-400",     glow: "#0ea5e9", icon: Users },
	diary:          { gradient: "from-pink-500/20 to-rose-600/10",      iconColor: "text-pink-400",    glow: "#ec4899", icon: BookHeart },
	letter:         { gradient: "from-indigo-500/20 to-blue-600/10",    iconColor: "text-indigo-400",  glow: "#6366f1", icon: BookMarked },
	review:         { gradient: "from-slate-500/20 to-gray-600/10",     iconColor: "text-slate-400",   glow: "#64748b", icon: Award },
};

const DEFAULT_STYLE: GenreStyle = {
	gradient: "from-slate-500/20 to-gray-600/10",
	iconColor: "text-slate-400",
	glow: "#64748b",
	icon: BookOpen,
};

const getGenreStyle = (slug: string): GenreStyle => GENRE_STYLES[slug] ?? DEFAULT_STYLE;

export const GenresSection = ({ lang }: GenresSectionProps) => {
	const { t } = useI18n();
	const { data: genres, isPending } = useGenres();

	if (!isPending && (!genres || genres.length === 0)) return null;

	return (
		<section className="flex flex-col gap-3">
			<SectionHeader title={t("dashboard.genres.title")} />

			{isPending ? (
				<div className="flex gap-2.5 overflow-hidden">
					{Array.from({ length: 7 }).map((_, i) => (
						<div
							key={i}
							className="h-[88px] w-[110px] shrink-0 animate-pulse rounded-xl bg-surf-2"
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
	const style = getGenreStyle(genre.slug);
	const Icon = style.icon;

	return (
		<Link
			href={`/${lang}/texts?genreId=${genre.id}`}
			className="group relative flex h-[88px] w-[110px] shrink-0 flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-surf-2 p-3 outline-none transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:[box-shadow:0_6px_20px_2px_var(--genre-glow)] focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
			style={{ "--genre-glow": `${style.glow}55` } as CSSProperties}
		>
			<div className={`absolute inset-0 bg-linear-to-br ${style.gradient} transition-opacity duration-200`} />

			<Icon
				size={20}
				className={`relative z-10 ${style.iconColor} transition-transform duration-200 ease-out group-hover:scale-110`}
				strokeWidth={1.6}
			/>

			<Typography
				tag="span"
				className="relative z-10 line-clamp-2 text-[12px] font-semibold leading-tight text-t-1"
			>
				{genre.name}
			</Typography>
		</Link>
	);
};
