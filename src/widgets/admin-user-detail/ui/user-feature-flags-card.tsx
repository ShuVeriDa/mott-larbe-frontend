"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { useAdminUserFeatureFlags } from "@/entities/admin-user/model/use-admin-user-feature-flags";
import { cn } from "@/shared/lib/cn";

interface UserFeatureFlagsCardProps {
	featureFlags: ReturnType<typeof useAdminUserFeatureFlags>;
}

export const UserFeatureFlagsCard = ({ featureFlags }: UserFeatureFlagsCardProps) => {
	const { t } = useI18n();
	const { query, setOverride } = featureFlags;
	const flags = query.data ?? [];

	const handleToggle = (flagId: string, currentEffective: boolean, hasOverride: boolean) => {
		const newValue = !currentEffective;
		setOverride.mutate({ flagId, value: newValue });
	};

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex items-center justify-between border-b border-bd-1 px-3.5 py-3">
				<span className="text-[13px] font-semibold text-t-1">
					{t("admin.userDetail.featureFlags.title")}
				</span>
				<span className="text-[11px] text-t-3">
					{t("admin.userDetail.featureFlags.subtitle")}
				</span>
			</div>

			{query.isLoading ? (
				<div className="divide-y divide-bd-1">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between px-3.5 py-[9px]">
							<div className="space-y-1">
								<div className="h-3 w-32 animate-pulse rounded bg-surf-3" />
								<div className="h-2.5 w-48 animate-pulse rounded bg-surf-3" />
							</div>
							<div className="size-8 animate-pulse rounded-full bg-surf-3" />
						</div>
					))}
				</div>
			) : (
				<div>
					{flags.map((flag) => {
						const isOn = flag.effectiveValue;
						const hasOverride = flag.userOverride !== null;
												const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => handleToggle(flag.flagId, isOn, hasOverride);
return (
							<div
								key={flag.flagId}
								className="flex items-center justify-between gap-2 border-b border-bd-1 px-3.5 py-2 last:border-b-0"
							>
								<div>
									<div
										className={cn(
											"text-[12.5px] font-medium text-t-1",
											hasOverride && "text-acc-t",
										)}
									>
										{flag.key}
									</div>
									{flag.description && (
										<div className="text-[11px] text-t-3">{flag.description}</div>
									)}
								</div>
								<button
									onClick={handleClick}
									disabled={setOverride.isPending}
									className={cn(
										"relative h-[18px] w-8 shrink-0 rounded-full border-none transition-colors disabled:opacity-60",
										isOn ? "bg-acc" : "bg-surf-4",
									)}
									aria-pressed={isOn}
								>
									<span
										className={cn(
											"absolute top-0.5 size-3.5 rounded-full bg-white shadow-sm transition-transform",
											isOn ? "left-[calc(100%-2px)] -translate-x-full" : "left-0.5",
										)}
									/>
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
