"use client";

import type { Genre } from "@/entities/genre";
import { useHoverProps } from "@/shared/lib/animation";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ComponentType, CSSProperties } from "react";

interface GenreStyle {
	gradient: string;
	iconColor: string;
	glow: string;
	icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

interface GenreCardProps {
	genre: Genre;
	lang: string;
	style: GenreStyle;
	index: number;
}

export const GenreCard = ({ genre, lang, style, index }: GenreCardProps) => {
	const Icon = style.icon;
	const hoverProps = useHoverProps({ y: -4 }, { scale: 0.97 }, { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 });

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "0px -40px 0px 0px" }}
			{...hoverProps}
		>
			<Link
				href={`/${lang}/texts?genreId=${genre.id}`}
				className="group relative flex h-[88px] w-[110px] shrink-0 flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-surf-2 p-3 outline-none transition-shadow duration-250 ease-out hover:[box-shadow:0_8px_24px_4px_var(--genre-glow)] focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
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
		</motion.div>
	);
};
