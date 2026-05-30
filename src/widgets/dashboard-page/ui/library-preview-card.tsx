"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import Link from "next/link";
import { type CSSProperties } from "react";
import { getLibraryPreviewLevelColors } from "../lib/library-preview-level-styles";
import { LibraryPreviewCardCover } from "./library-preview-card-cover";
import { LibraryPreviewCardFooter } from "./library-preview-card-footer";
import { LibraryPreviewCardMeta } from "./library-preview-card-meta";

export interface LibraryPreviewCardProps {
	item: LibraryTextListItem;
	lang: string;
}

export const LibraryPreviewCard = ({ item, lang }: LibraryPreviewCardProps) => {
	const colors = getLibraryPreviewLevelColors(item.level);
	const pct = Math.round(item.progressPercent);

	return (
		<Link
			href={`/${lang}/texts/${item.id}`}
			className="group block cursor-pointer overflow-hidden rounded-card border-[0.5px] border-bd-1 bg-surf transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-px hover:border-bd-2 hover:[box-shadow:0_4px_14px_2px_var(--card-glow)]"
			style={{ "--card-glow": `${colors.glow}90` } as CSSProperties}
		>
			<LibraryPreviewCardCover colors={colors} />
			<div className="p-2 md:p-[10px_13px_12px]">
				<LibraryPreviewCardMeta item={item} colors={colors} />
				<LibraryPreviewCardFooter item={item} pct={pct} />
			</div>
		</Link>
	);
};
