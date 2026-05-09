"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { ReactNode } from 'react';
import type { MorphRuleStats } from "@/entities/morph-rule";

interface Props {
  stats?: MorphRuleStats;
  isLoading?: boolean;
}

const StatCard = ({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  valueClass?: string;
}) => (
  <div className="rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3 transition-colors">
    <div className="mb-1 text-[10.5px] font-medium tracking-[0.3px] text-t-3">
      {label}
    </div>
    <div className={`text-[20px] font-semibold leading-none text-t-1 ${valueClass ?? ""}`}>
      {value}
    </div>
    {sub && (
      <div className="mt-0.5 text-[10.5px] text-t-3">{sub}</div>
    )}
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3">
    <div className="mb-2 h-2.5 w-20 animate-pulse rounded bg-surf-3" />
    <div className="h-6 w-14 animate-pulse rounded bg-surf-3" />
  </div>
);

export const MorphologyStatsRow = ({ stats, isLoading }: Props) => {
  const { t } = useI18n();

  if (isLoading || !stats) {
    return (
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      <StatCard
        label={t("admin.morphology.stats.total")}
        value={stats.total.toLocaleString()}
        sub={t("admin.morphology.stats.totalSub")}
      />
      <StatCard
        label={t("admin.morphology.stats.coverage")}
        value={`${stats.coveragePct}%`}
        valueClass="text-grn"
        sub={
          <Typography tag="span">
            <Typography tag="span"
              className="mr-1 inline-block size-1.5 rounded-full bg-grn align-middle"
            />
            {t("admin.morphology.stats.coverageSub")}
          </Typography>
        }
      />
      <StatCard
        label={t("admin.morphology.stats.matches")}
        value={stats.totalMatches.toLocaleString()}
        sub={t("admin.morphology.stats.matchesSub")}
      />
      <StatCard
        label={t("admin.morphology.stats.inactive")}
        value={stats.inactive}
        valueClass="text-amb"
        sub={t("admin.morphology.stats.inactiveSub")}
      />
    </div>
  );
};
