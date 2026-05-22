"use client";

import type { DictionaryExportRun, ExportRunStatus } from "@/entities/ai-translation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { CheckCircle, CircleDashed, XCircle } from "lucide-react";

const statusIcon = (status: ExportRunStatus) => {
  if (status === "ok") return <CheckCircle className="size-3.5 text-grn" strokeWidth={1.6} />;
  if (status === "error") return <XCircle className="size-3.5 text-red" strokeWidth={1.6} />;
  return <CircleDashed className="size-3.5 animate-spin text-t-3" strokeWidth={1.6} />;
};

const statusLabelKey = (status: ExportRunStatus) => {
  if (status === "ok") return "aiTranslation.admin.exportRunStatusOk";
  if (status === "error") return "aiTranslation.admin.exportRunStatusError";
  return "aiTranslation.admin.exportRunStatusRunning";
};

const triggeredLabelKey = (triggeredBy: string) =>
  triggeredBy === "cron"
    ? "aiTranslation.admin.exportRunTriggeredCron"
    : "aiTranslation.admin.exportRunTriggeredManual";

interface AiCacheExportHistoryProps {
  runs: DictionaryExportRun[];
}

export const AiCacheExportHistory = ({ runs }: AiCacheExportHistoryProps) => {
  const { t } = useI18n();

  return (
    <div className="mt-4 overflow-hidden rounded-card border border-bd-1 bg-surf">
      <div className="border-b border-hairline border-bd-1 px-4 py-2.5">
        <Typography tag="span" className="text-[12px] font-semibold uppercase tracking-[0.5px] text-t-3">
          {t("aiTranslation.admin.exportHistory")}
        </Typography>
      </div>
      {runs.length === 0 ? (
        <div className="px-4 py-6 text-center text-[12.5px] text-t-3">
          {t("aiTranslation.admin.exportHistoryEmpty")}
        </div>
      ) : (
        <div>
          {runs.map((run) => (
            <ExportRunRow key={run.id} run={run} />
          ))}
        </div>
      )}
    </div>
  );
};

const ExportRunRow = ({ run }: { run: DictionaryExportRun }) => {
  const { t } = useI18n();

  const startedAt = new Date(run.startedAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center gap-3 border-b border-hairline border-bd-1 px-4 py-2.5 last:border-b-0">
      <div className="shrink-0">{statusIcon(run.status)}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span
            className={cn(
              "text-[12.5px] font-medium",
              run.status === "ok" ? "text-t-1" : run.status === "error" ? "text-red" : "text-t-2",
            )}
          >
            {t(statusLabelKey(run.status))}
          </span>
          <span className="text-[11px] text-t-3">{t(triggeredLabelKey(run.triggeredBy))}</span>
          <span className="text-[11px] text-t-3">{startedAt}</span>
        </div>
        {run.status !== "running" && (
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-t-3">
            <span>
              <strong className="text-grn">{run.created}</strong>{" "}
              {t("aiTranslation.admin.exportRunCreated")}
            </span>
            <span>
              <strong className="text-t-2">{run.skipped}</strong>{" "}
              {t("aiTranslation.admin.exportRunSkipped")}
            </span>
            {run.errors > 0 && (
              <span>
                <strong className="text-red">{run.errors}</strong>{" "}
                {t("aiTranslation.admin.exportRunErrors")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
