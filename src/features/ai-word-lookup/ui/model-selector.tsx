"use client";

import { SUPPORTED_GEMINI_MODELS, type GeminiModel } from "@/entities/ai-translation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useGeminiModelStore } from "../model/gemini-model-store";

interface ModelOption {
  model: GeminiModel;
  labelKey: "modelFlashLite" | "modelFlash" | "modelPro";
  tierKey: "tierFree" | "tierConditional" | "tierPremium";
  descriptionKey:
    | "modelFlashLiteDescription"
    | "modelFlashDescription"
    | "modelProDescription";
  freeNoteKey?: "modelFlashLiteFreeNote" | "modelFlashFreeNote" | "modelProFreeNote";
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    model: "gemini-3.1-flash-lite",
    labelKey: "modelFlashLite",
    tierKey: "tierFree",
    descriptionKey: "modelFlashLiteDescription",
    freeNoteKey: "modelFlashLiteFreeNote",
  },
  {
    model: "gemini-3.5-flash",
    labelKey: "modelFlash",
    tierKey: "tierConditional",
    descriptionKey: "modelFlashDescription",
    freeNoteKey: "modelFlashFreeNote",
  },
  {
    model: "gemini-3.1-pro",
    labelKey: "modelPro",
    tierKey: "tierPremium",
    descriptionKey: "modelProDescription",
    freeNoteKey: "modelProFreeNote",
  },
];

interface ModelSelectorProps {
  onModelChange?: (model: GeminiModel) => void;
}

export const ModelSelector = ({ onModelChange }: ModelSelectorProps) => {
  const { t } = useI18n();
  const { geminiModel, setGeminiModel } = useGeminiModelStore();

  const handleSelect = (model: GeminiModel) => {
    setGeminiModel(model);
    onModelChange?.(model);
  };

  return (
    <div className="flex flex-col gap-2">
      {SUPPORTED_GEMINI_MODELS.map((model) => {
        const option = MODEL_OPTIONS.find((o) => o.model === model)!;
        const isActive = model === geminiModel;

        const handleClick = () => handleSelect(model);

        return (
          <Button
            key={model}
            size="bare"
            onClick={handleClick}
            aria-pressed={isActive}
            className={cn(
              "flex w-full min-w-0 flex-col items-start gap-1 whitespace-normal rounded-base border px-3 py-2.5 text-left transition-colors",
              isActive
                ? "border-acc/40 bg-acc/8"
                : "border-bd-2 bg-surf-2 hover:bg-surf-3",
            )}
          >
            <div className="flex w-full min-w-0 flex-wrap items-start justify-between gap-x-2 gap-y-1">
              <div className="flex min-w-0 flex-col gap-0">
                <Typography
                  tag="span"
                  className={cn(
                    "text-[12.5px] font-semibold leading-tight",
                    isActive ? "text-acc" : "text-t-1",
                  )}
                >
                  {t(`aiTranslation.models.${option.labelKey}`)}
                </Typography>
                <Typography tag="span" className="truncate font-mono text-[10px] text-t-3">
                  {model}
                </Typography>
              </div>
              <Typography
                tag="span"
                className={cn(
                  "shrink-0 self-start rounded px-1.5 py-0.5 text-[10px] font-medium",
                  option.tierKey === "tierFree" && "bg-grn/10 text-grn",
                  option.tierKey === "tierConditional" && "bg-amber-500/10 text-amber-500",
                  option.tierKey === "tierPremium" && "bg-red/10 text-red",
                )}
              >
                {t(`aiTranslation.models.${option.tierKey}`)}
              </Typography>
            </div>
            <Typography tag="p" className="w-full text-[11.5px] leading-relaxed text-t-1">
              {t(`aiTranslation.models.${option.descriptionKey}`)}
            </Typography>
            {option.freeNoteKey && (
              <Typography tag="p" className="mt-0.5 w-full text-[11px] text-t-3/70">
                {t(`aiTranslation.models.${option.freeNoteKey}`)}
              </Typography>
            )}
          </Button>
        );
      })}
    </div>
  );
};
