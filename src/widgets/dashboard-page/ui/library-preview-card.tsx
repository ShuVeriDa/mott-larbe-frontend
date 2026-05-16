"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import Link from "next/link";
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
			className="group block cursor-pointer overflow-hidden rounded-card border-hairline border border-bd-1 bg-surf transition-all hover:-translate-y-px hover:border-bd-2 hover:shadow-md"
		>
			<LibraryPreviewCardCover colors={colors} />
			<div className="p-[10px_13px_12px]">
				<LibraryPreviewCardMeta item={item} colors={colors} />
				<LibraryPreviewCardFooter item={item} pct={pct} />
			</div>
		</Link>
	);
};
