"use client";

import { useI18n } from "@/shared/lib/i18n";

interface Props {
  onAdd: () => void;
  onImport: () => void;
}

export const MorphologyTopbar = ({ onAdd, onImport }: Props) => {
  const { t } = useI18n();

  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-bd-1 bg-bg px-5 py-3.5 transition-colors">
      <div>
        <h1 className="font-display text-[16px] text-t-1">
          {t("admin.morphology.title")}
        </h1>
        <p className="mt-0.5 text-[12px] text-t-3">
          {t("admin.morphology.subtitle")}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onImport}
          className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M8 2v8M5 8l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12h10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="max-sm:hidden">{t("admin.morphology.import")}</span>
        </button>

        <button
          onClick={onAdd}
          className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
          {t("admin.morphology.add")}
        </button>
      </div>
    </div>
  );
};
