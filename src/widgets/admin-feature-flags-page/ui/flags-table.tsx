"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { FeatureFlagItem, FeatureFlagCategory } from "@/entities/feature-flag";
import { FlagToggle } from "./flag-toggle";
import { FlagEnvChip } from "./flag-env-chip";
import { FlagCategoryBadge } from "./flag-category-badge";
import { FlagRowActions } from "./flag-row-actions";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

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
	t: (key: string, params?: Record<string, string | number>) => string;
}

const SkeletonRow = () => (
	<tr>
		{Array.from({ length: 8 }).map((_, i) => (
			<td key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</td>
		))}
	</tr>
);

export const FlagsTable = ({
	items,
	isLoading,
	onToggle,
	onEdit,
	onDuplicate,
	onDelete,
	t,
}: FlagsTableProps) => {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const toggleExpand = (id: string) => {
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
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr>
						<th className="w-9 pb-2 pl-3.5" />
						<th className="pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.key")}
						</th>
						<th className="w-[100px] pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.status")}
						</th>
						<th className="w-[160px] pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.envs")}
						</th>
						<th className="w-[90px] pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.rollout")}
						</th>
						<th className="w-[76px] pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.overrides")}
						</th>
						<th className="w-[90px] pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1">
							{t("admin.featureFlags.table.updated")}
						</th>
						<th className="w-16 pb-2 pr-3.5 border-b border-bd-1" />
					</tr>
				</thead>
				<tbody>
					{isLoading
						? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
						: grouped.map(([category, flags]) => (
								<>
									<tr key={`cat-${category}`} className="bg-surf-2">
										<td
											colSpan={8}
											className="border-b border-bd-1 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3"
										>
											<FlagCategoryBadge category={category} t={t} />
											<span className="ml-2 text-t-3">
												{t("admin.featureFlags.table.categoryCount", { count: flags.length })}
											</span>
										</td>
									</tr>
									{flags.map((flag) => (
										<>
											<tr
												key={flag.id}
												className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
											>
												<td className="pl-3.5">
													<button
														type="button"
														onClick={() => toggleExpand(flag.id)}
														className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
													>
														<svg
															className={cn(
																"size-3.5 transition-transform",
																expanded.has(flag.id) && "rotate-90",
															)}
															viewBox="0 0 15 15"
															fill="none"
															stroke="currentColor"
															strokeWidth="1.4"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path d="M6 4l4 4-4 4" />
														</svg>
													</button>
												</td>
												<td className="py-3 pl-3.5">
													<span className="rounded-[5px] border border-bd-1 bg-surf-2 px-1.5 py-0.5 font-mono text-[11.5px] text-t-1">
														{flag.key}
													</span>
													{flag.description && (
														<p className="mt-0.5 text-[11.5px] text-t-3 line-clamp-1">
															{flag.description}
														</p>
													)}
												</td>
												<td className="py-3 pl-3.5">
													<FlagToggle
														enabled={flag.isEnabled}
														onChange={(v) => onToggle(flag.id, v)}
													/>
												</td>
												<td className="py-3 pl-3.5">
													<div className="flex flex-wrap gap-1">
														{flag.environments.map((env) => (
															<FlagEnvChip key={env} env={env} />
														))}
													</div>
												</td>
												<td className="py-3 pl-3.5">
													<div className="flex items-center gap-2">
														<div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-surf-3">
															<div
																className="h-full rounded-[3px] bg-acc"
																style={{ width: `${flag.rolloutPercent}%` }}
															/>
														</div>
														<span className="shrink-0 text-[11px] text-t-2">
															{flag.rolloutPercent}%
														</span>
													</div>
												</td>
												<td className="py-3 pl-3.5">
													{flag.overridesCount > 0 ? (
														<span className="inline-flex cursor-pointer items-center gap-[3px] rounded px-1.5 py-[1.5px] text-[10.5px] bg-pur-bg text-pur-t hover:opacity-80">
															<svg className="size-2.5" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
																<circle cx="7.5" cy="5" r="2" />
																<path d="M2.5 13c0-2.5 2.5-4 5-4s5 1.5 5 4" strokeLinecap="round" />
															</svg>
															{flag.overridesCount}
														</span>
													) : (
														<span className="text-t-3">—</span>
													)}
												</td>
												<td className="py-3 pl-3.5 text-[11.5px] text-t-3">
													{formatDate(flag.updatedAt)}
												</td>
												<td className="py-3 pr-3.5">
													<FlagRowActions
														flag={flag}
														onEdit={onEdit}
														onDuplicate={onDuplicate}
														onDelete={onDelete}
														t={t}
													/>
												</td>
											</tr>
											{expanded.has(flag.id) && (
												<tr key={`${flag.id}-exp`} className="bg-surf-2">
													<td colSpan={8} className="px-3.5 pb-3.5 pt-2.5">
														<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-t-3">
															{t("admin.featureFlags.expandDetails")}
														</p>
														<div className="flex flex-wrap gap-4 text-[12px] text-t-2">
															<div>
																<span className="text-t-3">{t("admin.featureFlags.table.category")}: </span>
																<FlagCategoryBadge category={flag.category} t={t} />
															</div>
															{flag.updatedBy && (
																<div>
																	<span className="text-t-3">{t("admin.featureFlags.table.updatedBy")}: </span>
																	<span className="text-acc-t">{flag.updatedBy.name} {flag.updatedBy.surname}</span>
																</div>
															)}
															{flag.description && (
																<div>
																	<span className="text-t-3">{t("admin.featureFlags.table.description")}: </span>
																	{flag.description}
																</div>
															)}
														</div>
													</td>
												</tr>
											)}
										</>
									))}
								</>
							))}
				</tbody>
			</table>
		</div>
	);
};
