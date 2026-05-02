"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { ImportMorphRulesResult } from "@/entities/morph-rule";

interface Props {
  open: boolean;
  isLoading?: boolean;
  result?: ImportMorphRulesResult | null;
  onSubmit: (file: File, overwrite: boolean) => void;
  onClose: () => void;
}

export const MorphologyImportModal = ({
  open,
  isLoading,
  result,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [dragging, setDragging] = useState(false);

  if (!open) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    onSubmit(file, overwrite);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px] max-sm:items-end max-sm:p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[480px] overflow-y-auto rounded-[14px] border border-bd-2 bg-surf p-5 shadow-md max-sm:max-w-full max-sm:rounded-b-none max-sm:rounded-t-[16px] max-sm:pb-7">
        <h2 className="font-display text-[15px] text-t-1 mb-1">
          {t("admin.morphology.importModal.title")}
        </h2>
        <p className="mb-4 text-[12px] text-t-3">
          {t("admin.morphology.importModal.subtitle")}
        </p>

        {result ? (
          <div className="mb-4 rounded-[10px] border border-bd-1 bg-surf-2 p-4">
            <div className="mb-3 text-[13px] font-semibold text-t-1">
              {t("admin.morphology.importModal.resultTitle")}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-t-3">{t("admin.morphology.importModal.created")}</span>
                <span className="font-semibold text-grn-t">{result.created}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t-3">{t("admin.morphology.importModal.updated")}</span>
                <span className="font-semibold text-acc-t">{result.updated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t-3">{t("admin.morphology.importModal.skipped")}</span>
                <span className="font-semibold text-t-2">{result.skipped}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-t-3">{t("admin.morphology.importModal.total")}</span>
                <span className="font-semibold text-t-1">{result.total}</span>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-3 rounded-lg bg-red-bg p-2.5 text-[11px] text-red-t">
                {result.errors.slice(0, 5).map((e, i) => (
                  <div key={i}>{e}</div>
                ))}
                {result.errors.length > 5 && (
                  <div className="mt-1 text-t-3">
                    + {result.errors.length - 5} {t("admin.morphology.importModal.moreErrors")}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div
              className={cn(
                "cursor-pointer rounded-[9px] border-[1.5px] border-dashed border-bd-2 p-6 text-center transition-colors",
                dragging ? "border-acc bg-acc-bg" : "hover:border-acc hover:bg-acc-bg",
              )}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.json"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="mb-2 text-t-3">
                <svg className="mx-auto" width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M5 8l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              {file ? (
                <div className="text-[13px] font-semibold text-t-1">{file.name}</div>
              ) : (
                <>
                  <div className="text-[13px] font-semibold text-t-2">
                    {t("admin.morphology.importModal.dropTitle")}
                  </div>
                  <div className="mt-1 text-[11.5px] text-t-3">
                    {t("admin.morphology.importModal.dropSub")}
                  </div>
                </>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="accent-acc"
              />
              <span className="text-[12.5px] text-t-2">
                {t("admin.morphology.importModal.overwrite")}
              </span>
            </label>

            <div className="flex justify-end gap-2 max-sm:flex-col-reverse">
              <button
                type="button"
                onClick={onClose}
                className="flex h-[30px] items-center justify-center rounded-[7px] border border-bd-2 px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-2 max-sm:h-10 max-sm:rounded-[10px] max-sm:text-[13px]"
              >
                {t("admin.morphology.importModal.cancel")}
              </button>
              <button
                type="submit"
                disabled={isLoading || !file}
                className="flex h-[30px] items-center justify-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 max-sm:h-10 max-sm:rounded-[10px] max-sm:text-[13px]"
              >
                {isLoading ? "…" : t("admin.morphology.importModal.submit")}
              </button>
            </div>
          </form>
        )}

        {result && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="flex h-[30px] items-center justify-center rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t("admin.morphology.importModal.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
