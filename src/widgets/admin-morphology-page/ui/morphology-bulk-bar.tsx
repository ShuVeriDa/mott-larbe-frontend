"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";

interface Props {
  count: number;
  activatingLoading?: boolean;
  deactivatingLoading?: boolean;
  deletingLoading?: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export const MorphologyBulkBar = ({
  count,
  activatingLoading,
  deactivatingLoading,
  deletingLoading,
  onActivate,
  onDeactivate,
  onDelete,
  onClear,
}: Props) => {
  const { t } = useI18n();

  if (count === 0) return null;

  return (
    <div className="mb-3.5 flex flex-wrap items-center gap-2.5 border-b border-acc/15 bg-acc-bg px-4 py-2">
      <span className="text-[12.5px] font-medium text-acc-t">
        {t("admin.morphology.bulk.selected", { count })}
      </span>
      <div className="ml-auto flex gap-1.5">
        <button
          onClick={onActivate}
          disabled={activatingLoading}
          className={cn(
            "h-[26px] rounded-[6px] border border-acc/25 bg-transparent px-2.5 text-[11.5px] font-medium text-acc-t transition-colors hover:bg-acc/10 disabled:opacity-50",
          )}
        >
          {t("admin.morphology.bulk.activate")}
        </button>
        <button
          onClick={onDeactivate}
          disabled={deactivatingLoading}
          className="h-[26px] rounded-[6px] border border-acc/25 bg-transparent px-2.5 text-[11.5px] font-medium text-acc-t transition-colors hover:bg-acc/10 disabled:opacity-50"
        >
          {t("admin.morphology.bulk.deactivate")}
        </button>
        <button
          onClick={onDelete}
          disabled={deletingLoading}
          className="h-[26px] rounded-[6px] border border-red/25 bg-transparent px-2.5 text-[11.5px] font-medium text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
        >
          {t("admin.morphology.bulk.delete")}
        </button>
        <button
          onClick={onClear}
          className="h-[26px] rounded-[6px] border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-3 transition-colors hover:bg-surf-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
