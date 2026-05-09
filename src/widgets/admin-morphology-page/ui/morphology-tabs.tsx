"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { MorphRuleStats, MorphRuleStatus } from "@/entities/morph-rule";

interface Props {
  active: MorphRuleStatus;
  stats?: MorphRuleStats;
  onChange: (s: MorphRuleStatus) => void;
}

export const MorphologyTabs = ({ active, stats, onChange }: Props) => {
  const { t } = useI18n();

  const tabs: { key: MorphRuleStatus; label: string; count?: number }[] = [
    { key: "all", label: t("admin.morphology.tabs.all"), count: stats?.total },
    {
      key: "active",
      label: t("admin.morphology.tabs.active"),
      count: stats?.active,
    },
    {
      key: "inactive",
      label: t("admin.morphology.tabs.inactive"),
      count: stats?.inactive,
    },
    {
      key: "regex",
      label: t("admin.morphology.tabs.regex"),
      count: stats?.regexCount,
    },
  ];

  return (
    <div className="mb-3.5 overflow-x-auto [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:h-0">
      <div className="inline-flex min-w-full gap-0 rounded-[9px] bg-surf-2 p-[3px]">
        {tabs.map((tab) => {
          const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(tab.key);
          return (
          <button
            key={tab.key}
            onClick={handleClick}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] px-3 py-1 text-[12px] font-medium transition-colors",
              active === tab.key
                ? "bg-surf text-t-1 shadow-sm"
                : "text-t-3 hover:text-t-2",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded px-1.5 py-px text-[10px] font-semibold",
                  active === tab.key
                    ? "bg-surf-3 text-t-2"
                    : "bg-surf-3 text-t-3",
                )}
              >
                {tab.count.toLocaleString()}
              </span>
            )}
          </button>
        );
        })}
      </div>
    </div>
  );
};
