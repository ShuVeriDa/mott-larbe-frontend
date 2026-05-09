"use client";

import Link from "next/link";
import { useState } from "react";
import type { LibraryTextLanguage, LibraryTextListItem } from "@/entities/library-text";
import { useLibraryTexts } from "@/entities/library-text";
import type { CefrLevel } from "@/shared/types";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

type CefrKey = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const LEVEL_CLASSES: Record<CefrKey, { badge: string; cov: string; stripe: string }> = {
	A1: { badge: "bg-amb-bg text-amb-t", cov: "bg-amb-bg", stripe: "var(--amb)" },
	A2: { badge: "bg-grn-bg text-grn-t", cov: "bg-grn-bg", stripe: "var(--grn)" },
	B1: { badge: "bg-acc-bg text-acc-t", cov: "bg-acc-bg", stripe: "var(--acc)" },
	B2: { badge: "bg-pur-bg text-pur-t", cov: "bg-pur-bg", stripe: "var(--pur)" },
	C1: { badge: "bg-ros-bg text-ros-t", cov: "bg-ros-bg", stripe: "var(--ros-t)" },
	C2: { badge: "bg-ros-bg text-ros-t", cov: "bg-ros-bg", stripe: "var(--ros-t)" },
};

const DEFAULT_LEVEL_COLORS = LEVEL_CLASSES.B1;

const getLevelColors = (level: string | null) =>
	LEVEL_CLASSES[(level as CefrKey) ?? ""] ?? DEFAULT_LEVEL_COLORS;

const LANG_TAG: Record<string, string> = { CHE: "ЧЕ", RU: "RU", EN: "EN" };

const progressColor = (pct: number): string => {
	if (pct >= 80) return "var(--grn)";
	if (pct > 0) return "var(--acc)";
	return "transparent";
};

const LANG_FILTERS: LibraryTextLanguage[] = ["CHE", "RU", "EN"];
const LEVEL_FILTERS: CefrLevel[] = ["A1", "A2", "B1", "B2"];

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
			className="group block overflow-hidden rounded-card border-hairline border border-bd-1 bg-surf transition-all hover:-translate-y-px hover:border-bd-2 hover:shadow-md"
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
						<span
							className={`inline-flex items-center rounded-[4px] px-1.5 py-[2px] text-[10px] font-bold ${colors.badge}`}
						>
							{item.level}
						</span>
					) : null}
					<span className="text-[10px] font-medium text-t-3">
						{LANG_TAG[item.language] ?? item.language}
					</span>
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
						style={{ width: `${pct}%`, background: progressColor(pct) }}
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

interface FilterButtonProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

const FilterButton = ({ active, onClick, children }: FilterButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"h-[22px] rounded-[5px] px-2 text-[10.5px] font-medium transition-colors",
			active
				? "bg-acc-bg text-acc-t"
				: "text-t-3 hover:bg-surf-2 hover:text-t-2",
		)}
	>
		{children}
	</button>
);

interface LibraryPreviewProps {
	lang: string;
}

export const LibraryPreview = ({ lang }: LibraryPreviewProps) => {
	const { t } = useI18n();
	const [filterLang, setFilterLang] = useState<LibraryTextLanguage | undefined>();
	const [filterLevel, setFilterLevel] = useState<CefrLevel | undefined>();

	const { data: library } = useLibraryTexts({
		orderBy: "newest",
		limit: 6,
		language: filterLang ? [filterLang] : undefined,
		level: filterLevel ? [filterLevel] : undefined,
	});

	const items = library?.items ?? [];

	const viewAllHref = (() => {
		const params = new URLSearchParams();
		if (filterLang) params.set("language", filterLang);
		if (filterLevel) params.set("level", filterLevel);
		const qs = params.toString();
		return `/${lang}/texts${qs ? `?${qs}` : ""}`;
	})();

		const handleClick: NonNullable<React.ComponentProps<typeof FilterButton>["onClick"]> = () => setFilterLang(undefined);
	const handleClick2: NonNullable<React.ComponentProps<typeof FilterButton>["onClick"]> = () => setFilterLevel(undefined);
return (
		<section>
			<div className="mb-2.5 flex items-center justify-between gap-2">
				<span className="text-[13px] font-semibold text-t-1">
					{t("dashboard.library.title")}
				</span>
				<Link
					href={viewAllHref}
					className="shrink-0 text-[11.5px] text-acc transition-colors hover:underline"
				>
					{t("dashboard.library.viewAll")}
				</Link>
			</div>

			<div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
				<div className="flex items-center gap-[3px]">
					<FilterButton
						active={filterLang === undefined}
						onClick={handleClick}
					>
						{t("dashboard.library.langAll")}
					</FilterButton>
					{LANG_FILTERS.map((l) => {
					  const handleClick: NonNullable<React.ComponentProps<typeof FilterButton>["onClick"]> = () =>
								setFilterLang(filterLang === l ? undefined : l);
					  return (
						<FilterButton
							key={l}
							active={filterLang === l}
							onClick={handleClick
							}
						>
							{LANG_TAG[l]}
						</FilterButton>
					);
					})}
				</div>

				<div className="h-3 w-px bg-bd-2" />

				<div className="flex items-center gap-[3px]">
					<FilterButton
						active={filterLevel === undefined}
						onClick={handleClick2}
					>
						{t("dashboard.library.levelAll")}
					</FilterButton>
					{LEVEL_FILTERS.map((lvl) => {
					  const handleClick: NonNullable<React.ComponentProps<typeof FilterButton>["onClick"]> = () =>
								setFilterLevel(filterLevel === lvl ? undefined : lvl);
					  return (
						<FilterButton
							key={lvl}
							active={filterLevel === lvl}
							onClick={handleClick
							}
						>
							{lvl}
						</FilterButton>
					);
					})}
				</div>
			</div>

			{items.length > 0 ? (
				<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
					{items.map((item) => (
						<LibraryCard key={item.id} item={item} lang={lang} />
					))}
				</div>
			) : (
				<div className="flex h-[120px] items-center justify-center rounded-card border-hairline border border-bd-1 bg-surf-2">
					<span className="text-[12.5px] text-t-3">
						{t("dashboard.library.newText")}
					</span>
				</div>
			)}
		</section>
	);
};
