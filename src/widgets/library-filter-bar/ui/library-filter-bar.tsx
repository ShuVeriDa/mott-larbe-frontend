"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps, ReactNode } from 'react';
import type {
	LibraryProgressStatus,
	LibrarySortOption,
	LibraryTextLanguage,
} from "@/entities/library-text";
import { useLibraryFilters } from "@/features/library-filters";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";

const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LANGUAGES: LibraryTextLanguage[] = ["CHE", "RU"];
const PROGRESS_STATUSES: LibraryProgressStatus[] = [
	"NEW",
	"IN_PROGRESS",
	"COMPLETED",
];

const levelPillClass = (level: CefrLevel, active: boolean) => {
	if (active) {
		if (level === "A1" || level === "A2")
			return "bg-grn-bg border-grn/25 text-grn-t";
		if (level === "B1" || level === "B2")
			return "bg-amb-bg border-amb/25 text-amb-t";
		return "bg-red-bg border-red/25 text-red-t";
	}
	return "border-bd-2 bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1";
};

export const LibraryFilterBar = () => {
	const { t } = useI18n();
	const {
		level,
		lang,
		status,
		sort,
		view,
		setLevel,
		setLang,
		setStatus,
		setSort,
		setView,
	} = useLibraryFilters();

	const handleAllLevelsClick: NonNullable<ComponentProps<typeof Pill>["onClick"]> = () => setLevel("all");
	const handleAllLangsClick: NonNullable<ComponentProps<typeof Pill>["onClick"]> = () => setLang("all");
	const handleAllStatusClick: NonNullable<ComponentProps<typeof Pill>["onClick"]> = () => setStatus("all");
	const handleSortChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setSort(e.currentTarget.value as LibrarySortOption);
	const handleGridViewClick: NonNullable<ComponentProps<typeof ViewBtn>["onClick"]> = () => setView("grid");
	const handleListViewClick: NonNullable<ComponentProps<typeof ViewBtn>["onClick"]> = () => setView("list");
	return (
		<div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-bd-1 bg-surf px-5 py-2 [scrollbar-width:none] max-sm:px-3 max-sm:gap-1 [&::-webkit-scrollbar]:hidden">
			<Typography tag="span" className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden">
				{t("library.filterLevel")}
			</Typography>

			<Pill
				active={level === "all"}
				onClick={handleAllLevelsClick}
				className={
					level === "all"
						? "bg-acc-bg border-acc/25 text-acc-t"
						: "border-bd-2 bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1"
				}
			>
				{t("library.all")}
			</Pill>

			{CEFR_LEVELS.map(l => {
			  const handleClick: NonNullable<ComponentProps<typeof Pill>["onClick"]> = () => setLevel(l);
			  return (
				<Pill
					key={l}
					active={level === l}
					onClick={handleClick}
					className={levelPillClass(l, level === l)}
				>
					{l}
				</Pill>
			);
			})}

			<Divider />

			<Typography tag="span" className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden">
				{t("library.filterLang")}
			</Typography>

			<Pill
				active={lang === "all"}
				onClick={handleAllLangsClick}
				className={
					lang === "all"
						? "bg-acc-bg border-acc/25 text-acc-t"
						: "border-bd-2 bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1"
				}
			>
				{t("library.all")}
			</Pill>

			{LANGUAGES.map(l => {
			  const handleClick: NonNullable<ComponentProps<typeof Pill>["onClick"]> = () => setLang(l);
			  return (
				<Pill
					key={l}
					active={lang === l}
					onClick={handleClick}
					className={
						lang === l
							? "bg-acc-bg border-acc/25 text-acc-t"
							: "border-bd-2 bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1"
					}
				>
					{t(`library.lang.${l}`)}
				</Pill>
			);
			})}

			<Divider />

			<Typography tag="span" className="shrink-0 text-[11px] font-medium text-t-3 max-sm:hidden">
				{t("library.filterProgress")}
			</Typography>

			<Pill
				active={status === "all"}
				onClick={handleAllStatusClick}
				className={
					status === "all"
						? "bg-acc-bg border-acc/25 text-acc-t"
						: "border-bd-2 bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1"
				}
			>
				{t("library.all")}
			</Pill>

			{PROGRESS_STATUSES.map(s => {
			  const handleClick: NonNullable<ComponentProps<typeof Pill>["onClick"]> = () => setStatus(s);
			  return (
				<Pill
					key={s}
					active={status === s}
					onClick={handleClick}
					className={
						status === s
							? "bg-acc-bg border-acc/25 text-acc-t"
							: "border-bd-2 bg-transparent text-t-2 hover:bg-surf-2 hover:text-t-1"
					}
				>
					{t(`library.progress.${s.toLowerCase().replace("_", "")}`)}
				</Pill>
			);
			})}

			<Divider />

			<select
				value={sort}
				onChange={handleSortChange}
				aria-label={t("library.sort.label")}
				className="h-[26px] shrink-0 cursor-pointer rounded-base border border-bd-2 bg-surf px-2 text-[11px] text-t-2 outline-none"
			>
				<option value="level">{t("library.sort.level")}</option>
				<option value="newest">{t("library.sort.newest")}</option>
				<option value="oldest">{t("library.sort.oldest")}</option>
				<option value="alpha">{t("library.sort.alpha")}</option>
				<option value="progress">{t("library.sort.progress")}</option>
				<option value="length">{t("library.sort.length")}</option>
			</select>

			<Divider />

			<div className="flex shrink-0 overflow-hidden rounded-base border border-bd-2 max-sm:hidden">
				<ViewBtn
					active={view === "grid"}
					onClick={handleGridViewClick}
					aria-label={t("library.view.grid")}
				>
					<GridIcon />
				</ViewBtn>
				<ViewBtn
					active={view === "list"}
					onClick={handleListViewClick}
					aria-label={t("library.view.list")}
				>
					<ListIcon />
				</ViewBtn>
			</div>
		</div>
	);
};

const Pill = ({
	children,
	active,
	onClick,
	className,
}: {
	children: ReactNode;
	active: boolean;
	onClick: () => void;
	className: string;
}) => (
	<Button
		onClick={onClick}
		aria-pressed={active}
		className={cn(
			"h-[26px] shrink-0 cursor-pointer rounded-full border px-2.5 text-[11px] font-medium transition-all duration-100 [-webkit-tap-highlight-color:transparent]",
			className,
		)}
	>
		{children}
	</Button>
);

const Divider = () => (
	<Typography tag="span" className="mx-0.5 h-4 w-px shrink-0 bg-bd-2" aria-hidden="true" />
);

const ViewBtn = ({
	children,
	active,
	onClick,
	"aria-label": ariaLabel,
}: {
	children: ReactNode;
	active: boolean;
	onClick: () => void;
	"aria-label": string;
}) => (
	<Button
		onClick={onClick}
		aria-label={ariaLabel}
		aria-pressed={active}
		className={cn(
			"flex h-[26px] w-[26px] items-center justify-center transition-all duration-100",
			active ? "bg-surf-2 text-acc-t" : "bg-transparent text-t-3",
		)}
	>
		{children}
	</Button>
);

const GridIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.4"
	>
		<rect x="1" y="1" width="4" height="4" rx=".8" />
		<rect x="7" y="1" width="4" height="4" rx=".8" />
		<rect x="1" y="7" width="4" height="4" rx=".8" />
		<rect x="7" y="7" width="4" height="4" rx=".8" />
	</svg>
);

const ListIcon = () => (
	<svg
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.4"
	>
		<path
			d="M3.5 3h7M3.5 6h7M3.5 9h7M1.5 3h.1M1.5 6h.1M1.5 9h.1"
			strokeLinecap="round"
		/>
	</svg>
);
