"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import {
	getLibraryPreviewLevelColors,
	getLibraryPreviewProgressBarColor,
} from "../lib/library-preview-level-styles";
import { LANG_TAG } from "@/shared/lib/lang-tag/lang-tag";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

export interface LibraryPreviewCardProps {
	item: LibraryTextListItem;
	lang: string;
}

export const LibraryPreviewCard = ({ item, lang }: LibraryPreviewCardProps) => {
	const { t } = useI18n();
	const colors = getLibraryPreviewLevelColors(item.level);
	const pct = Math.round(item.progressPercent);

	return (
		<Link
			href={`/${lang}/texts/${item.id}`}
			className="group block overflow-hidden rounded-card border-hairline border border-bd-1 bg-surf transition-all hover:-translate-y-px hover:border-bd-2 hover:shadow-md"
		>
			<div
				className={`relative flex h-[72px] items-center justify-center ${colors.cov}`}
			>
				<div
					aria-hidden="true"
					className="absolute left-0 top-0 bottom-0 w-[3px]"
					style={{ background: colors.stripe }}
				/>
				<svg
					width="26"
					height="26"
					viewBox="0 0 28 28"
					fill="none"
					aria-hidden="true"
					className="opacity-70"
				>
					<path
						d="M5 22L14 7l9 15"
						stroke={colors.stripe}
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M8 17h12"
						stroke={colors.stripe}
						strokeWidth="1.6"
						strokeLinecap="round"
					/>
				</svg>
			</div>

			<div className="p-[10px_13px_12px]">
				<div className="mb-1.5 flex items-center gap-[5px]">
					{item.level ? (
						<Typography
							tag="span"
							className={`inline-flex items-center rounded-[4px] px-1.5 py-[2px] text-[10px] font-bold ${colors.badge}`}
						>
							{t(`shared.cefrLevel.${item.level}`)}
						</Typography>
					) : null}
					<Typography tag="span" className="text-[10px] font-medium text-t-3">
						{LANG_TAG[item.language] ?? item.language}
					</Typography>
				</div>

				<div className="mb-0.5 line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-t-1">
					{item.title}
				</div>
				{item.author ? (
					<div className="mb-2 truncate text-[11px] text-t-3">{item.author}</div>
				) : (
					<div className="mb-2" />
				)}

				<div className="mb-[7px] h-[2px] overflow-hidden rounded-[2px] bg-surf-3">
					<div
						className="h-full rounded-[2px] transition-[width]"
						style={{
							width: `${pct}%`,
							background: getLibraryPreviewProgressBarColor(pct),
						}}
					/>
				</div>

				<div className="flex items-center justify-between">
					<Typography tag="span" className="text-[11px] text-t-3">
						{t("dashboard.library.words", {
							count: item.wordCount.toLocaleString(),
						})}
					</Typography>
					{pct > 0 ? (
						<Typography
							tag="span"
							className="text-[11px] font-semibold"
							style={{ color: pct >= 80 ? "var(--grn)" : "var(--acc)" }}
						>
							{pct}%
						</Typography>
					) : (
						<Typography tag="span" className="text-[11px] font-medium text-t-3">
							{t("dashboard.library.newText")}
						</Typography>
					)}
				</div>
			</div>
		</Link>
	);
};
