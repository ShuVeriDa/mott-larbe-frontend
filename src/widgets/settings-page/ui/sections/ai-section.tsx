"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { CheckCircle, Eye, EyeOff, ExternalLink, XCircle } from "lucide-react";
import { useAiSection } from "../../model/use-ai-section";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";

export const AiSection = () => {
  const { t } = useI18n();
  const {
    hasKey,
    keyInput,
    showKey,
    isSaving,
    isDeleting,
    isVerifying,
    handleKeyChange,
    handleToggleShow,
    handleSave,
    handleDelete,
    handleVerify,
  } = useAiSection();

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title={t("aiTranslation.settings.title")}
        subtitle={t("aiTranslation.settings.description")}
      />

      <SettingCard title={t("aiTranslation.settings.title")}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {hasKey ? (
              <>
                <CheckCircle className="size-4 text-grn" strokeWidth={1.6} />
                <Typography tag="span" className="text-[13px] font-medium text-grn">
                  {t("aiTranslation.settings.hasKey")}
                </Typography>
              </>
            ) : (
              <>
                <XCircle className="size-4 text-t-3" strokeWidth={1.6} />
                <Typography tag="span" className="text-[13px] text-t-3">
                  {t("aiTranslation.settings.noKey")}
                </Typography>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Typography tag="label" className="text-[12px] font-medium text-t-2">
              {t("aiTranslation.settings.keyLabel")}
            </Typography>
            <div className="relative flex items-center">
              <Input
                type={showKey ? "text" : "password"}
                value={keyInput}
                onChange={handleKeyChange}
                placeholder={t("aiTranslation.settings.keyPlaceholder")}
                className="pr-10 text-[13px]"
              />
              <Button
                size="bare"
                onClick={handleToggleShow}
                aria-label={showKey ? t("aiTranslation.settings.hide") : t("aiTranslation.settings.show")}
                title={showKey ? t("aiTranslation.settings.hide") : t("aiTranslation.settings.show")}
                className="absolute right-2.5 text-t-3 hover:text-t-1"
              >
                {showKey ? (
                  <EyeOff className="size-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.5} />
                )}
              </Button>
            </div>
            <Typography tag="p" className="text-[11px] text-t-3">
              {t("aiTranslation.settings.keyHint")}
            </Typography>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving || !keyInput.trim()}
              className="h-8 rounded-base bg-acc px-3 text-[12px] font-semibold text-white disabled:opacity-50"
            >
              {t("aiTranslation.settings.saveButton")}
            </Button>
            {hasKey && (
              <>
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="h-8 rounded-base border border-bd-2 bg-surf-2 px-3 text-[12px] font-medium text-t-2 hover:bg-surf-3 disabled:opacity-50"
                >
                  {t("aiTranslation.settings.verifyButton")}
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 rounded-base border border-bd-2 bg-surf-2 px-3 text-[12px] font-medium text-red disabled:opacity-50"
                >
                  {t("aiTranslation.settings.deleteButton")}
                </Button>
              </>
            )}
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] text-acc hover:underline"
          >
            <ExternalLink className="size-3" strokeWidth={1.5} />
            {t("aiTranslation.settings.getKeyLink")}
          </a>
        </div>
      </SettingCard>
    </div>
  );
};
