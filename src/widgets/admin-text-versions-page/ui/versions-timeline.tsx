"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { TextVersionListItem, ProcessingStatus } from "@/entities/admin-text";
import { VersionItem } from "./version-item";

type StatusFilter = ProcessingStatus | "all";

const groupByDate = (versions: TextVersionListItem[], locale: string) => {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const yesterday = today - 86400000;

	const groups: { label: string; items: TextVersionListItem[] }[] = [];
	const seen = new Map<string, number>();

	for (const v of versions) {
		const d = new Date(v.createdAt);
		const dayTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

		let label: string;
		if (dayTs === today) label = "__today__";
		else if (dayTs === yesterday) label = "__yesterday__";
		else label = d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });

		if (!seen.has(label)) {
			seen.set(label, groups.length);
			groups.push({ label, items: [] });
		}
		groups[seen.get(label)!].items.push(v);
	}
	return groups;
};

interface VersionsTimelineProps {
	versions: TextVersionListItem[];
	statusFilter: StatusFilter;
	onStatusFilterChange: (f: StatusFilter) => void;
	onVersionClick: (id: string) => void;
	onRestore: (id: string) => void;
	onRetry: (id: string) => void;
	onDownload: (id: string) => void;
	selectedVersionId: string | null;
	isLoading: boolean;
}

export const VersionsTimeline = ({
	versions,
	statusFilter,
	onStatusFilterChange,
	onVersionClick,
	onRestore,
	onRetry,
	onDownload,
	selectedVersionId,
	isLoading,
}: VersionsTimelineProps) => {
	const { t, lang } = useI18n();

	const tabs: { key: StatusFilter; label: string }[] = [
		{ key: "all", label: t("admin.texts.versions.tabs.all") },
		{ key: "COMPLETED", label: t("admin.texts.versions.tabs.COMPLETED") },
		{ key: "ERROR", label: t("admin.texts.versions.tabs.ERROR") },
		{ key: "RUNNING", label: t("admin.texts.versions.tabs.RUNNING") },
	];

	const groups = groupByDate(versions, lang);

	const resolveLabel = (raw: string) => {
		if (raw === "__today__") return t("admin.texts.versions.timeline.today");
		if (raw === "__yesterday__") return t("admin.texts.versions.timeline.yesterday");
		return raw;
	};

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			{/* Filter tabs */}
			<div className="flex items-center justify-between gap-3 border-b border-bd-1 px-4 py-3 max-sm:flex-col max-sm:items-start max-sm:gap-2">
				<span className="text-[12.5px] font-semibold text-t-1">
					{t("admin.texts.versions.pageTitle")}
				</span>
				<div className="flex rounded-[8px] bg-surf-2 p-[3px]">
					{tabs.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => onStatusFilterChange(key)}
							className={cn(
								"rounded-[5px] px-3 py-1 text-[12px] font-medium transition-colors",
								statusFilter === key
									? "bg-surf text-t-1 shadow-sm"
									: "bg-transparent text-t-3 hover:text-t-2",
							)}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{/* Loading skeleton */}
			{isLoading && (
				<div className="flex flex-col gap-0 py-2">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="flex gap-0 px-4 py-2.5">
							<div className="flex w-7 flex-col items-center py-1">
								<div className="w-px flex-1 bg-bd-1" />
								<div className="size-2 animate-pulse rounded-full bg-surf-3" />
								<div className="w-px flex-1 bg-bd-1" />
							</div>
							<div className="ml-2 flex flex-1 flex-col gap-1.5 py-1">
								<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
								<div className="h-2.5 w-40 animate-pulse rounded bg-surf-3" />
							</div>
						</div>
					))}
				</div>
			)}

			{/* Empty state */}
			{!isLoading && versions.length === 0 && (
				<div className="px-5 py-10 text-center">
					<svg className="mx-auto mb-2.5 text-t-4" width="32" height="32" viewBox="0 0 32 32" fill="none">
						<circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
						<circle cx="16" cy="11" r="2" fill="currentColor" />
						<path d="M16 17v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
					<div className="text-[13px] font-medium text-t-2">{t("admin.texts.versions.timeline.empty")}</div>
					<div className="mt-1 text-[12px] text-t-3">{t("admin.texts.versions.timeline.emptySub")}</div>
				</div>
			)}

			{/* Timeline groups */}
			{!isLoading && groups.map((group) => {
				const allItems = group.items;
				return (
					<div key={group.label}>
						<div className="sticky top-0 z-10 border-b border-t border-bd-1 bg-surf-2 px-4 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
							{resolveLabel(group.label)}
						</div>
						{allItems.map((item, idx) => (
							<VersionItem
								key={item.id}
								item={item}
								isFirst={idx === 0}
								isLast={idx === allItems.length - 1}
								isActive={selectedVersionId === item.id}
								onClick={() => onVersionClick(item.id)}
								onRestore={() => onRestore(item.id)}
								onRetry={() => onRetry(item.id)}
								onDownload={() => onDownload(item.id)}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
};
