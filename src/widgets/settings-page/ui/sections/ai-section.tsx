"use client";

import {
	SUPPORTED_TRANSLATION_LANGUAGES,
	type TranslationLanguage,
} from "@/entities/ai-translation";
import { ModelSelector } from "@/features/ai-word-lookup";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import {
	AlertTriangle,
	CheckCircle,
	ExternalLink,
	Eye,
	EyeOff,
	Info,
	Lock,
	Sparkles,
	XCircle,
} from "lucide-react";
import { useAiSection } from "../../model/use-ai-section";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";
import { LanguageButton } from "./language-button";

export const AiSection = () => {
	const { t } = useI18n();
	const {
		hasKey,
		keyInput,
		showKey,
		isSaving,
		isDeleting,
		isVerifying,
		targetLanguage,
		handleKeyChange,
		handleToggleShow,
		handleSave,
		handleDelete,
		handleVerify,
		handleLanguageChange,
		handleModelChange,
	} = useAiSection();

	return (
		<div className="flex flex-col gap-4">
			<SectionHeader title={t("aiTranslation.settings.title")} />
			<SettingCard title={t("aiTranslation.settings.disclaimerTitle")}>
				<div className="flex flex-col gap-2.5">
					{(
						[
							"disclaimerItem1",
							"disclaimerItem2",
							"disclaimerItem3",
							"disclaimerItem4",
							"disclaimerItem5",
							"disclaimerItem6",
						] as const
					).map(key => (
						<div key={key} className="flex items-start gap-2">
							{key === "disclaimerItem6" ? (
								<Lock
									className="mt-0.5 size-3.5 shrink-0 text-grn"
									strokeWidth={1.6}
								/>
							) : (
								<AlertTriangle
									className="mt-0.5 size-3.5 shrink-0 text-amber-500"
									strokeWidth={1.6}
								/>
							)}
							<Typography tag="p" className="text-[12px] text-t-2">
								{t(`aiTranslation.settings.${key}`)}
							</Typography>
						</div>
					))}
				</div>
			</SettingCard>

			{!hasKey && (
				<SettingCard title={t("aiTranslation.settings.howToTitle")}>
					<div className="flex flex-col gap-3">
						<div className="flex items-start gap-2 rounded-base border-[0.5px] border-grn/30 bg-grn/8 px-3 py-2.5">
							<Sparkles
								className="mt-0.5 size-3.5 shrink-0 text-grn"
								strokeWidth={1.6}
							/>
							<Typography tag="p" className="text-[12px] text-grn">
								{t("aiTranslation.settings.freeNote")}
							</Typography>
						</div>

						<ol className="flex flex-col gap-2">
							{([1, 2, 3] as const).map(n => (
								<li key={n} className="flex items-start gap-2.5">
									<span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-acc/15 text-[9px] font-bold text-acc">
										{n}
									</span>
									<Typography tag="span" className="text-[12px] text-t-2">
										{n === 1 && (
											<>
												{t("aiTranslation.settings.step1Pre")}{" "}
												<a
													href="https://aistudio.google.com/app/apikey"
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-0.5 text-acc hover:underline"
												>
													aistudio.google.com
													<ExternalLink
														className="size-2.5"
														strokeWidth={1.5}
													/>
												</a>{" "}
												{t("aiTranslation.settings.step1Post")}
											</>
										)}
										{n === 2 && t("aiTranslation.settings.step2")}
										{n === 3 && t("aiTranslation.settings.step3")}
									</Typography>
								</li>
							))}
						</ol>

						<div className="flex items-start gap-2 rounded-base border-[0.5px] border-bd-1 bg-surf-2 px-3 py-2.5">
							<Lock
								className="mt-0.5 size-3.5 shrink-0 text-t-3"
								strokeWidth={1.6}
							/>
							<Typography tag="p" className="text-[11.5px] text-t-3">
								{t("aiTranslation.settings.securityNote")}
							</Typography>
						</div>
					</div>
				</SettingCard>
			)}

			<SettingCard title={t("aiTranslation.settings.title")}>
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						{hasKey ? (
							<>
								<CheckCircle className="size-4 text-grn" strokeWidth={1.6} />
								<Typography
									tag="span"
									className="text-[13px] font-medium text-grn"
								>
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
						<Typography
							tag="label"
							className="text-[12px] font-medium text-t-2"
						>
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
								aria-label={
									showKey
										? t("aiTranslation.settings.hide")
										: t("aiTranslation.settings.show")
								}
								title={
									showKey
										? t("aiTranslation.settings.hide")
										: t("aiTranslation.settings.show")
								}
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

			<SettingCard title={t("aiTranslation.settings.languageLabel")}>
				<Typography tag="p" className="mb-3 text-[12px] text-t-3">
					{t("aiTranslation.settings.languageDescription")}
				</Typography>
				<div className="flex flex-wrap gap-2">
					{SUPPORTED_TRANSLATION_LANGUAGES.map((lang: TranslationLanguage) => (
						<LanguageButton
							key={lang}
							lang={lang}
							isActive={lang === targetLanguage}
							onSelect={handleLanguageChange}
						/>
					))}
				</div>
			</SettingCard>

			<SettingCard title={t("aiTranslation.settings.modelLabel")}>
				<Typography tag="p" className="mb-3 text-[12px] text-t-3">
					{t("aiTranslation.settings.modelDescription")}
				</Typography>
				<ModelSelector onModelChange={handleModelChange} />
				<div className="mt-3 flex items-start gap-2 rounded-base border-[0.5px] border-bd-1 bg-surf-2 px-3 py-2.5">
					<Info
						className="mt-0.5 size-3.5 shrink-0 text-t-3"
						strokeWidth={1.6}
					/>
					<Typography tag="p" className="text-[11px] text-t-3">
						{t("aiTranslation.settings.billingNote")}
					</Typography>
				</div>
			</SettingCard>
		</div>
	);
};
