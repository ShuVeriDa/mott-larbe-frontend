"use client";

import { cn } from "@/shared/lib/cn";
import type { FeatureFlagItem } from "@/entities/feature-flag";
import { FlagToggle } from "./flag-toggle";
import { FlagEnvChip } from "./flag-env-chip";
import { FlagCategoryBadge } from "./flag-category-badge";
import { FlagRowActions } from "./flag-row-actions";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

interface FlagsMobileListProps {
	items: FeatureFlagItem[];
	isLoading: boolean;
	onToggle: (id: string, enabled: boolean) => void;
	onEdit: (flag: FeatureFlagItem) => void;
	onDuplicate: (flag: FeatureFlagItem) => void;
	onDelete: (flag: FeatureFlagItem) => void;
	onAddOverride: (flagId: string) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}

export const FlagsMobileList = ({
	items,
	isLoading,
	onToggle,
	onEdit,
	onDuplicate,
	onDelete,
	onAddOverride,
	t,
}: FlagsMobileListProps) => {
	if (isLoading) {
		return (
			<div className="hidden max-sm:block">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="mb-2 overflow-hidden rounded-card border border-bd-1 bg-surf p-3"
					>
						<div className="mb-2 h-4 w-40 animate-pulse rounded bg-surf-3" />
						<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="hidden max-sm:block">
			{items.map((flag) => (
				<div
					key={flag.id}
					className="mb-2 overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors"
				>
					<div className="flex items-start gap-2.5 p-3">
						<div className="min-w-0 flex-1">
							<span
								className={cn(
									"mb-1 inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-[5px] border border-bd-1 bg-surf-2 px-1.5 py-0.5 font-mono text-[11.5px] text-t-1",
								)}
							>
								{flag.key}
							</span>
							{flag.description && (
								<p className="mb-1.5 text-[12px] text-t-2">{flag.description}</p>
							)}
							<div className="flex flex-wrap items-center gap-1.5">
								<FlagCategoryBadge category={flag.category} t={t} />
								{flag.environments.map((env) => (
									<FlagEnvChip key={env} env={env} />
								))}
								<span className="text-[11px] text-t-3">{formatDate(flag.updatedAt)}</span>
							</div>
						</div>
						<div className="flex shrink-0 flex-col items-end gap-2">
							<FlagToggle enabled={flag.isEnabled} onChange={(v) => onToggle(flag.id, v)} />
							<FlagRowActions
								flag={flag}
								onEdit={onEdit}
								onDuplicate={onDuplicate}
								onDelete={onDelete}
								onAddOverride={onAddOverride}
								t={t}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
