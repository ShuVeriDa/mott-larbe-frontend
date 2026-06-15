"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { ComponentProps, useState } from 'react';
import { ChevronRight, User } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { FeatureFlagItem, FeatureFlagCategory } from "@/entities/feature-flag";
import { useAdminFeatureFlagItemHistory } from "@/entities/feature-flag";
import { formatDateCompact } from "@/shared/lib/format-date";
import { FlagToggle } from "./flag-toggle";
import { FlagEnvChip } from "./flag-env-chip";
import { FlagCategoryBadge } from "./flag-category-badge";
import { FlagRowActions } from "./flag-row-actions";

const groupByCategory = (items: FeatureFlagItem[]): [FeatureFlagCategory, FeatureFlagItem[]][] => {
	const map = new Map<FeatureFlagCategory, FeatureFlagItem[]>();
	for (const item of items) {
		const list = map.get(item.category) ?? [];
		list.push(item);
		map.set(item.category, list);
	}
	return Array.from(map.entries());
};

interface FlagsTableProps {
	items: FeatureFlagItem[];
	isLoading: boolean;
	onToggle: (id: string, enabled: boolean) => void;
	onEdit: (flag: FeatureFlagItem) => void;
	onDuplicate: (flag: FeatureFlagItem) => void;
	onDelete: (flag: FeatureFlagItem) => void;
	onAddOverride: (flagId: string) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
	<TableRow>
		{Array.from({ length: 8 }).map((_, i) => (
			<TableCell key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</TableCell>
		))}
	</TableRow>
);

const ExpandedRow = ({
	flag,
	t,
}: {
	flag: FeatureFlagItem;
	t: (key: string, params?: Record<string, string | number>) => string;
}) => {
	const historyQuery = useAdminFeatureFlagItemHistory(flag.id, 5);
	const items = historyQuery.data ?? [];

	return (
		<TableRow className="bg-surf-2">
			<TableCell colSpan={8} className="px-3.5 pb-3.5 pt-2.5">
				<div className="flex flex-wrap gap-4 text-[12px] text-t-2 mb-3">
					<div>
						<Typography tag="span" className="text-t-3">{t("admin.featureFlags.table.category")}: </Typography>
						<FlagCategoryBadge category={flag.category} t={t} />
					</div>
					{flag.updatedBy && (
						<div>
							<Typography tag="span" className="text-t-3">{t("admin.featureFlags.table.updatedBy")}: </Typography>
							<Typography tag="span" className="text-acc-t">{flag.updatedBy.name} {flag.updatedBy.surname}</Typography>
						</div>
					)}
					{flag.description && (
						<div>
							<Typography tag="span" className="text-t-3">{t("admin.featureFlags.table.description")}: </Typography>
							{flag.description}
						</div>
					)}
				</div>

				<SectionLabel className="mb-1.5">
					{t("admin.featureFlags.expandDetails")}
				</SectionLabel>
				{historyQuery.isLoading ? (
					<div className="space-y-1.5">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="h-3 w-2/3 animate-pulse rounded bg-surf-3" />
						))}
					</div>
				) : items.length === 0 ? (
					<Typography tag="p" className="text-[11.5px] text-t-3">{t("admin.featureFlags.expandNoHistory")}</Typography>
				) : (
					<div className="space-y-1">
						{items.map((h) => (
							<div key={h.id} className="flex items-center gap-2 text-[11.5px]">
								<Typography tag="span" className="shrink-0 text-t-3">
									{new Date(h.createdAt).toLocaleString("ru-RU", {
										day: "numeric",
										month: "short",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Typography>
								<Typography tag="span" className="text-t-2">
									{t(`admin.featureFlags.history.eventType.${h.eventType}`)}
								</Typography>
								{h.actor && (
									<Typography tag="span" className="text-acc-t">
										{h.actor.name} {h.actor.surname}
									</Typography>
								)}
							</div>
						))}
					</div>
				)}
			</TableCell>
		</TableRow>
	);
};

const FlagRow = ({
	flag,
	isExpanded,
	onToggleExpand,
	onToggle,
	onEdit,
	onDuplicate,
	onDelete,
	onAddOverride,
	t,
}: {
	flag: FeatureFlagItem;
	isExpanded: boolean;
	onToggleExpand: (id: string) => void;
	onToggle: (id: string, enabled: boolean) => void;
	onEdit: (flag: FeatureFlagItem) => void;
	onDuplicate: (flag: FeatureFlagItem) => void;
	onDelete: (flag: FeatureFlagItem) => void;
	onAddOverride: (flagId: string) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}) => {
	const handleExpandClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onToggleExpand(flag.id);
	const handleToggleChange: NonNullable<ComponentProps<typeof FlagToggle>["onChange"]> = (v) => onToggle(flag.id, v);

	return (
		<>
			<TableRow className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2">
				<TableCell className="pl-3.5">
					<Button
						onClick={handleExpandClick}
						aria-expanded={isExpanded}
						aria-label={flag.key}
						className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<ChevronRight className={cn("size-3.5 transition-transform", isExpanded && "rotate-90")} />
					</Button>
				</TableCell>
				<TableCell className="py-3 pl-3.5">
					<Typography tag="span" className="rounded-[5px] border border-bd-1 bg-surf-2 px-1.5 py-0.5 font-mono text-[11.5px] text-t-1">
						{flag.key}
					</Typography>
					{flag.description && (
						<Typography tag="p" className="mt-0.5 text-[11.5px] text-t-3 line-clamp-1">
							{flag.description}
						</Typography>
					)}
				</TableCell>
				<TableCell className="py-3 pl-3.5">
					<FlagToggle enabled={flag.isEnabled} onChange={handleToggleChange} />
				</TableCell>
				<TableCell className="py-3 pl-3.5">
					<div className="flex flex-wrap gap-1">
						{flag.environments.map((env) => (
							<FlagEnvChip key={env} env={env} />
						))}
					</div>
				</TableCell>
				<TableCell className="py-3 pl-3.5">
					<div className="flex items-center gap-2">
						<div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-surf-3">
							<div
								className="h-full rounded-[3px] bg-acc"
								style={{ width: `${flag.rolloutPercent}%` }}
							/>
						</div>
						<Typography tag="span" className="shrink-0 text-[11px] text-t-2">
							{flag.rolloutPercent}%
						</Typography>
					</div>
				</TableCell>
				<TableCell className="py-3 pl-3.5">
					{flag.overridesCount > 0 ? (
						<Typography tag="span" className="inline-flex cursor-pointer items-center gap-[3px] rounded px-1.5 py-[1.5px] text-[10.5px] bg-pur-bg text-pur-t hover:opacity-80">
							<User className="size-2.5" />
							{flag.overridesCount}
						</Typography>
					) : (
						<Typography tag="span" className="text-t-3">—</Typography>
					)}
				</TableCell>
				<TableCell className="py-3 pl-3.5 text-[11.5px] text-t-3">
					{formatDateCompact(flag.updatedAt)}
				</TableCell>
				<TableCell className="py-3 pr-3.5">
					<FlagRowActions
						flag={flag}
						onEdit={onEdit}
						onDuplicate={onDuplicate}
						onDelete={onDelete}
						onAddOverride={onAddOverride}
						t={t}
					/>
				</TableCell>
			</TableRow>
			{isExpanded && <ExpandedRow key={`${flag.id}-exp`} flag={flag} t={t} />}
		</>
	);
};

// ── Main component ─────────────────────────────────────────────────────────────

export const FlagsTable = ({
	items,
	isLoading,
	onToggle,
	onEdit,
	onDuplicate,
	onDelete,
	onAddOverride,
	t,
}: FlagsTableProps) => {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const handleToggleExpand = (id: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const grouped = groupByCategory(items);

	return (
		<div className="overflow-x-auto max-sm:hidden">
			<Table className="border-collapse text-[12.5px]" aria-label={t("admin.featureFlags.table.key")}>
				<TableHeader>
					<TableRow>
						<TableHead className="w-9 pb-2 pl-3.5" />
						<TableHead className="pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.key")}
						</TableHead>
						<TableHead className="w-[100px] pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.status")}
						</TableHead>
						<TableHead className="w-[160px] pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.envs")}
						</TableHead>
						<TableHead className="w-[90px] pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.rollout")}
						</TableHead>
						<TableHead className="w-[76px] pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.overrides")}
						</TableHead>
						<TableHead className="w-[90px] pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.updated")}
						</TableHead>
						<TableHead className="w-16 pb-2 pr-3.5 border-b border-bd-1" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading
						? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
						: grouped.map(([category, flags]) => (
							<>
								<TableRow key={`cat-${category}`} className="bg-surf-2">
									<TableCell
										colSpan={8}
										className="border-b border-bd-1 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3"
									>
										<FlagCategoryBadge category={category} t={t} />
										<Typography tag="span" className="ml-2 text-t-3">
											{t("admin.featureFlags.table.categoryCount", { count: flags.length })}
										</Typography>
									</TableCell>
								</TableRow>
								{flags.map((flag) => (
									<FlagRow
										key={flag.id}
										flag={flag}
										isExpanded={expanded.has(flag.id)}
										onToggleExpand={handleToggleExpand}
										onToggle={onToggle}
										onEdit={onEdit}
										onDuplicate={onDuplicate}
										onDelete={onDelete}
										onAddOverride={onAddOverride}
										t={t}
									/>
								))}
							</>
						))}
				</TableBody>
			</Table>
		</div>
	);
};
