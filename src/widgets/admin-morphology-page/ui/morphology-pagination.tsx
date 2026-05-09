"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (p: number) => void;
}

export const MorphologyPagination = ({
  page,
  totalPages,
  total,
  limit,
  onChange,
}: Props) => {
  const { t } = useI18n();

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

    const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(page - 1);
  const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(page + 1);
return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-bd-1 px-4 py-3">
      <Typography tag="span" className="text-[12px] text-t-3">
        {t("admin.morphology.pagination.showing", { from, to, total })}
      </Typography>
      <div className="flex gap-1">
        <Button
          disabled={page === 1}
          onClick={handleClick}
          className="flex size-7 items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-t-2 transition-colors hover:bg-surf-2 disabled:cursor-default disabled:opacity-35"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        {pages.map((p, i) => {
          if (p === "…") {
            return (
              <Typography tag="span"
                key={`ellipsis-${i}`}
                className="flex size-7 items-center justify-center text-[12px] text-t-3"
              >
                …
              </Typography>
            );
          }

          const handlePageClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(p);

          return (
            <Button
              key={p}
              onClick={handlePageClick}
              className={cn(
                "flex size-7 items-center justify-center rounded-[6px] border text-[12px] font-medium transition-colors",
                page === p
                  ? "border-acc bg-acc text-white"
                  : "border-bd-2 bg-surf text-t-2 hover:bg-surf-2",
              )}
            >
              {p}
            </Button>
          );
        })}

        <Button
          disabled={page === totalPages}
          onClick={handleClick2}
          className="flex size-7 items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-t-2 transition-colors hover:bg-surf-2 disabled:cursor-default disabled:opacity-35"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};
