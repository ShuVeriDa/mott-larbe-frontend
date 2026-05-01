"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import type { LibraryTextListItem } from "@/entities/library-text";

interface LibraryPreviewProps {
	items: LibraryTextListItem[];
	lang: string;
}

type CefrKey = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const LEVEL_CLASSES: Record<CefrKey, { badge: string; cov: string; stripe: string }> = {
	A1: { badge: "bg-amb-bg text-amb-t", cov: "bg-amb-bg", stripe: "var(--amb)" },
	A2: { badge: "bg-grn-bg text-grn-t", cov: "bg-grn-bg", stripe: "var(--grn)" },
	B1: { badge: "bg-acc-bg text-acc-t", cov: "bg-acc-bg", stripe: "var(--acc)" },
	B2: { badge: "bg-pur-bg text-pur-t", cov: "bg-pur-bg", stripe: "var(--pur)" },
	C1: { badge: "bg-ros-bg text-ros-t", cov: "bg-ros-bg", stripe: "var(--ros-t)" },
	C2: { badge: "bg-ros-bg text-ros-t", cov: "bg-ros-bg", stripe: "var(--ros-t)" },
};

const DEFAULT_LEVEL = LEVEL_CLASSES.B1;

const getLevelColors = (level: string | null) =>
	LEVEL_CLASSES[(level as CefrKey) ?? ""] ?? DEFAULT_LEVEL;

const LANG_TAG: Record<string, string> = { CHE: "ЧЕ", RU: "RU", EN: "EN" };

const ProgressColor = (pct: number): string => {
	if (pct >= 80) return "var(--grn)";
	if (pct > 0) return "var(--acc)";
	return "transparent";
};

interface LibraryCardProps {
	item: LibraryTextListItem;
	lang: string;
}

const LibraryCard = ({ item, lang }: LibraryCardProps) => {
	const { t } = useI18n();
	const colors = getLevelColors(item.level);
	const pct = Math.round(item.progressPercent);

	return (
		<Link
			href={`/${lang}/texts/${item.id}`}
			className="group overflow-hidden rounded-card border-hairline border border-bd-1 bg-surf transition-all hover:-translate-y-px hover:border-bd-2 hover:shadow-md block"
		>
			<div className={`relative flex h-[72px] items-center justify-center ${colors.cov}`}>
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
						<span className={`inline-flex items-center rounded-[4px] px-1.5 py-[2px] text-[10px] font-bold ${colors.badge}`}>
							{item.level}
						</span>
					) : null}
					<span className="text-[10px] font-medium text-t-3">
						{LANG_TAG[item.language] ?? item.language}
					</span>
				</div>

				<div className="mb-0.5 text-[12.5px] font-semibold leading-[1.35] text-t-1 line-clamp-2">
					{item.title}
				</div>
				{item.author ? (
					<div className="mb-2 text-[11px] text-t-3 truncate">{item.author}</div>
				) : (
					<div className="mb-2" />
				)}

				<div className="mb-[7px] h-[2px] overflow-hidden rounded-[2px] bg-surf-3">
					<div
						className="h-full rounded-[2px] transition-[width]"
						style={{ width: `${pct}%`, background: ProgressColor(pct) }}
					/>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-[11px] text-t-3">
						{t("dashboard.library.words", { count: item.wordCount.toLocaleString() })}
					</span>
					{pct > 0 ? (
						<span
							className="text-[11px] font-semibold"
							style={{ color: pct >= 80 ? "var(--grn)" : "var(--acc)" }}
						>
							{pct}%
						</span>
					) : (
						<span className="text-[11px] font-medium text-t-3">
							{t("dashboard.library.newText")}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
};

export const LibraryPreview = ({ items, lang }: LibraryPreviewProps) => {
	const { t } = useI18n();

	if (items.length === 0) return null;

	return (
		<section>
			<div className="mb-2.5 flex items-center justify-between">
				<span className="text-[13px] font-semibold text-t-1">
					{t("dashboard.library.title")}
				</span>
				<Link
					href={`/${lang}/texts`}
					className="text-[11.5px] text-acc transition-colors hover:underline"
				>
					{t("dashboard.library.viewAll")}
				</Link>
			</div>
			<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
				{items.map((item) => (
					<LibraryCard key={item.id} item={item} lang={lang} />
				))}
			</div>
		</section>
	);
};
