"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import type { AdminDashboardFeatureFlag } from "@/entities/admin-dashboard";

interface FlagToggleProps {
	flag: AdminDashboardFeatureFlag;
	onToggle: (id: string, current: boolean) => void;
}

const FlagToggle = ({ flag, onToggle }: FlagToggleProps) => {
  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onToggle(flag.id, flag.isEnabled);
  return (
	<Button
		onClick={handleClick}
		aria-label={flag.key}
		aria-checked={flag.isEnabled}
		role="switch"
		className={cn(
			"relative h-[18px] w-[34px] shrink-0 rounded-full border-none transition-colors",
			flag.isEnabled ? "bg-acc" : "bg-surf-4",
		)}
	>
		<Typography tag="span"
			className={cn(
				"absolute top-[2px] size-[14px] rounded-full bg-white shadow-sm transition-[left] duration-200",
				flag.isEnabled ? "left-[18px]" : "left-[2px]",
			)}
		/>
	</Button>
);
};

interface DashboardFeatureFlagsCardProps {
	flags: AdminDashboardFeatureFlag[];
	onToggle: (id: string, current: boolean) => void;
}

export const DashboardFeatureFlagsCard = ({ flags, onToggle }: DashboardFeatureFlagsCardProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	return (
		<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.dashboard.featureFlags.title")}
				</Typography>
				<Link
					href={`/${params.lang}/admin/feature-flags`}
					className="shrink-0 text-[11.5px] text-acc hover:underline"
				>
					{t("admin.dashboard.featureFlags.manage")}
				</Link>
			</div>
			<div className="px-4 pb-4 pt-1">
				{flags.map((flag, idx) => (
					<div
						key={flag.id}
						className={cn(
							"flex min-w-0 items-center gap-3 py-2.5",
							idx < flags.length - 1 && "border-b border-bd-1",
						)}
					>
						<div className="min-w-0 flex-1">
							<div className="truncate text-[12.5px] font-medium text-t-1">{flag.key}</div>
							{flag.description && (
								<div className="truncate text-[11px] text-t-3">{flag.description}</div>
							)}
						</div>
						<FlagToggle flag={flag} onToggle={onToggle} />
					</div>
				))}
				{flags.length === 0 && (
					<div className="py-8 text-center text-[13px] text-t-3">—</div>
				)}
			</div>
		</div>
	);
};

export const DashboardFeatureFlagsCardSkeleton = () => (
	<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf">
		<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
			<div className="h-3.5 w-28 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-20 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="px-4 pb-4 pt-1">
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className="flex items-center gap-3 border-b border-bd-1 py-2.5 last:border-b-0">
					<div className="flex-1 space-y-1.5">
						<div className="h-3 w-40 animate-pulse rounded bg-surf-3" />
						<div className="h-2.5 w-56 animate-pulse rounded bg-surf-3" />
					</div>
					<div className="h-[18px] w-[34px] animate-pulse rounded-full bg-surf-3" />
				</div>
			))}
		</div>
	</div>
);
