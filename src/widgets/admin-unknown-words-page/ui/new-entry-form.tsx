"use client";

import { Typography } from "@/shared/ui/typography";
import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { Select } from "@/shared/ui/select";
import { CEFR_LEVELS } from "@/shared/types";

const inputCls =
	"h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf transition-colors";

interface Props {
	headword: string;
	partOfSpeech: string;
	translation: string;
	level: string;
	domain: string;
	formsRaw: string;
	placeholder: string;
	onHeadwordChange: NonNullable<ComponentProps<"input">["onChange"]>;
	onPartOfSpeechChange: NonNullable<ComponentProps<"select">["onChange"]>;
	onTranslationChange: NonNullable<ComponentProps<"input">["onChange"]>;
	onLevelChange: NonNullable<ComponentProps<"select">["onChange"]>;
	onDomainChange: NonNullable<ComponentProps<"input">["onChange"]>;
	onFormsRawChange: NonNullable<ComponentProps<"input">["onChange"]>;
}

export const NewEntryForm = ({
	headword,
	partOfSpeech,
	translation,
	level,
	domain,
	formsRaw,
	placeholder,
	onHeadwordChange,
	onPartOfSpeechChange,
	onTranslationChange,
	onLevelChange,
	onDomainChange,
	onFormsRawChange,
}: Props) => {
	const { t } = useI18n();

	return (
		<div>
			<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
				<div className="mb-3">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.unknownWords.addModal.headword")}
					</Typography>
					<input
						type="text"
						value={headword}
						onChange={onHeadwordChange}
						placeholder={placeholder}
						className={inputCls}
					/>
				</div>
				<div className="mb-3">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.unknownWords.addModal.partOfSpeech")}
					</Typography>
					<Select
						variant="lg"
						value={partOfSpeech}
						onChange={onPartOfSpeechChange}
						className="rounded-lg h-9 focus:bg-surf"
					>
						<option value="">{t("admin.unknownWords.addModal.posNone")}</option>
						<option value="noun">{t("admin.unknownWords.addModal.posNoun")}</option>
						<option value="verb">{t("admin.unknownWords.addModal.posVerb")}</option>
						<option value="adjective">{t("admin.unknownWords.addModal.posAdj")}</option>
						<option value="adverb">{t("admin.unknownWords.addModal.posAdv")}</option>
						<option value="particle">{t("admin.unknownWords.addModal.posParticle")}</option>
					</Select>
				</div>
			</div>

			<div className="mb-3">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.unknownWords.addModal.translation")}
				</Typography>
				<input
					type="text"
					value={translation}
					onChange={onTranslationChange}
					placeholder={t("admin.unknownWords.addModal.translationPlaceholder")}
					className={inputCls}
				/>
			</div>

			<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
				<div className="mb-3">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.unknownWords.addModal.level")}
					</Typography>
					<Select
						variant="lg"
						value={level}
						onChange={onLevelChange}
						className="rounded-lg h-9 focus:bg-surf"
					>
						<option value="">{t("admin.unknownWords.addModal.levelNone")}</option>
						{CEFR_LEVELS.map((l) => (
							<option key={l} value={l}>{l}</option>
						))}
					</Select>
				</div>
				<div className="mb-3">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.unknownWords.addModal.domain")}
					</Typography>
					<input
						type="text"
						value={domain}
						onChange={onDomainChange}
						placeholder={t("admin.unknownWords.addModal.domainPlaceholder")}
						className={inputCls}
					/>
				</div>
			</div>

			<div className="mb-3">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.unknownWords.addModal.forms")}
				</Typography>
				<input
					type="text"
					value={formsRaw}
					onChange={onFormsRawChange}
					placeholder={t("admin.unknownWords.addModal.formsPlaceholder")}
					className={inputCls}
				/>
				<Typography tag="p" className="mt-1 text-[11px] text-t-3">
					{t("admin.unknownWords.addModal.formsHint")}
				</Typography>
			</div>
		</div>
	);
};
