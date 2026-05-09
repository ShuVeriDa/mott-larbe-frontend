"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { MorphRule } from "@/entities/morph-rule";

// ─── Sub-components ────────────────────────────────────────────────────────

const PatternCell = ({ rule }: { rule: MorphRule }) => {
  const suffix = rule.suffix;
  const isRegex = rule.isRegex;

  return (
    <div className="flex flex-col gap-[3px]">
      <div className="font-mono text-[13.5px] font-semibold text-t-1">
        {isRegex ? (
          <Typography tag="span">{suffix}</Typography>
        ) : (
          <>
            <Typography tag="span" className="text-t-3">.*</Typography>
            <Typography tag="span" className="rounded bg-acc-bg px-[3px] font-bold text-acc-t">
              {suffix}
            </Typography>
          </>
        )}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-t-3">
        {rule.description}
        {isRegex && (
          <Typography tag="span" className="rounded bg-pur-bg px-1 py-px text-[9.5px] font-bold uppercase tracking-[0.3px] text-pur-t">
            Regex
          </Typography>
        )}
      </div>
    </div>
  );
};

const ReplaceCell = ({ rule }: { rule: MorphRule }) => (
  <div className="flex items-center gap-1.5">
    <Typography tag="span" className="rounded bg-red-bg px-1.5 py-px font-mono text-[12px] font-semibold text-red-t">
      {rule.suffix}
    </Typography>
    <svg
      className="shrink-0 text-t-3"
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3 8h10M9 5l4 3-4 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <Typography tag="span" className="rounded bg-grn-bg px-1.5 py-px font-mono text-[12px] font-semibold text-grn-t">
      {rule.add || "∅"}
    </Typography>
  </div>
);

const PosCell = ({ pos }: { pos: string | null }) => {
  if (!pos) return <Typography tag="span" className="text-[12px] text-t-3">—</Typography>;
  const lower = pos.toLowerCase();
  const cls =
    lower === "noun"
      ? "bg-acc-bg text-acc-t"
      : lower === "verb"
        ? "bg-grn-bg text-grn-t"
        : lower === "adj"
          ? "bg-pur-bg text-pur-t"
          : "bg-surf-3 text-t-2";
  return (
    <Typography tag="span" className={cn("inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold italic", cls)}>
      {pos.toLowerCase()}
    </Typography>
  );
};

const PriorityCell = ({ priority }: { priority: number }) => {
  const cls =
    priority <= 1
      ? "bg-red-bg text-red-t"
      : priority === 2
        ? "bg-amb-bg text-amb-t"
        : "bg-grn-bg text-grn-t";
  return (
    <Typography tag="span"
      className={cn(
        "inline-flex size-5 items-center justify-center rounded-[5px] text-[11px] font-bold",
        cls,
      )}
    >
      {priority}
    </Typography>
  );
};

const MatchBar = ({
  count,
  max,
}: {
  count: number;
  max: number;
}) => {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex min-w-[90px] items-center gap-1.5">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-surf-3">
        <div
          className="h-full rounded-full bg-pur"
          style={{ width: `${pct}%` }}
        />
      </div>
      <Typography tag="span" className="min-w-[32px] text-right font-[tabular-nums] text-[11px] text-t-3">
        {count.toLocaleString()}
      </Typography>
    </div>
  );
};

const StatusBadge = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] bg-grn-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-grn-t">
      <Typography tag="span" className="size-1.5 rounded-full bg-current opacity-70" />
      Active
    </Typography>
  ) : (
    <Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] bg-surf-3 px-1.5 py-0.5 text-[10.5px] font-semibold text-t-2">
      <Typography tag="span" className="size-1.5 rounded-full bg-current opacity-70" />
      Inactive
    </Typography>
  );

const SkeletonRow = () => (
  <tr className="border-b border-bd-1">
    {Array.from({ length: 10 }).map((_, i) => (
      <td key={i} className="px-3.5 py-2.5">
        <div className="h-3 animate-pulse rounded bg-surf-3" />
      </td>
    ))}
  </tr>
);

// ─── Main table ────────────────────────────────────────────────────────────

interface Props {
  items: MorphRule[];
  isLoading?: boolean;
  selectedIds: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  onToggleAll: () => void;
  onToggleId: (id: string) => void;
  onEdit: (rule: MorphRule) => void;
  onToggleActive: (rule: MorphRule) => void;
  onDelete: (id: string) => void;
}

export const MorphologyTable = ({
  items,
  isLoading,
  selectedIds,
  allSelected,
  someSelected,
  onToggleAll,
  onToggleId,
  onEdit,
  onToggleActive,
  onDelete,
}: Props) => {
  const { t } = useI18n();

  const maxMatches = items.reduce((m, r) => Math.max(m, r.matchCount), 0);

  return (
    <div className="hidden overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-colors sm:block">
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="border-b border-bd-1 bg-surf-2">
              <th className="w-8 py-2.5 pl-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={onToggleAll}
                  className="size-[15px] cursor-pointer appearance-none rounded bg-surf accent-acc"
                />
              </th>
              <th className="w-8 px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                #
              </th>
              <th className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                {t("admin.morphology.table.pattern")}
              </th>
              <th className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                {t("admin.morphology.table.replace")}
              </th>
              <th className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                {t("admin.morphology.table.pos")}
              </th>
              <th className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                {t("admin.morphology.table.type")}
              </th>
              <th className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                {t("admin.morphology.table.priority")}
              </th>
              <th className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                {t("admin.morphology.table.matches")}
              </th>
              <th className="px-3.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
                {t("admin.morphology.table.status")}
              </th>
              <th className="px-3.5 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : items.map((rule, idx) => {
                const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = () => onToggleId(rule.id);
                const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onToggleActive(rule);
                const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onEdit(rule);
                const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => onDelete(rule.id);
                return (
                  <tr
                    key={rule.id}
                    className={cn(
                      "group border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2",
                      !rule.isActive && "opacity-50",
                    )}
                  >
                    <td className="py-2.5 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(rule.id)}
                        onChange={handleChange}
                        className="size-[15px] cursor-pointer appearance-none rounded border border-bd-2 bg-surf accent-acc checked:bg-acc"
                      />
                    </td>
                    <td className="px-3.5 py-2.5 text-[12px] text-t-3">
                      {idx + 1}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <PatternCell rule={rule} />
                    </td>
                    <td className="px-3.5 py-2.5">
                      <ReplaceCell rule={rule} />
                    </td>
                    <td className="px-3.5 py-2.5">
                      <PosCell pos={rule.pos} />
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-2.5 text-[12px] text-t-3">
                      {t(`admin.morphology.ruleType.${rule.type}` as never) || rule.type}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <PriorityCell priority={rule.priority} />
                    </td>
                    <td className="px-3.5 py-2.5">
                      <MatchBar count={rule.matchCount} max={maxMatches} />
                    </td>
                    <td className="px-3.5 py-2.5">
                      <StatusBadge isActive={rule.isActive} />
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!rule.isActive && (
                          <Button
                            onClick={handleClick}
                            title={t("admin.morphology.row.activate")}
                            className="flex size-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M3 8a5 5 0 1010 0A5 5 0 003 8z"
                                stroke="currentColor"
                                strokeWidth="1.3"
                              />
                              <path
                                d="M6 8l2 2 3-3"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                        )}
                        <Button
                          onClick={handleClick2}
                          title={t("admin.morphology.row.edit")}
                          className="flex size-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M10.5 3.5l2 2L5 13H3v-2l7.5-7.5z"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Button>
                        <Button
                          onClick={handleClick3}
                          title={t("admin.morphology.row.delete")}
                          className="flex size-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                            />
                            <path
                              d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                            />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
