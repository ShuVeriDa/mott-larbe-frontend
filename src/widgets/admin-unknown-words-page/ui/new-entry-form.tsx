"use client";

import { Typography } from "@/shared/ui/typography";
import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";

const inputCls =
	"h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf transition-colors";
const selectCls = "h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf transition-colors cursor-pointer appearance-none pr-7";
const CHEVRON_BG =
	"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%23a5a39a' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")";

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
					<select
						value={partOfSpeech}
						onChange={onPartOfSpeechChange}
						className={selectCls}
						style={{
							backgroundImage: CHEVRON_BG,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "right 8px center",
						}}
					>
						<option value="">{t("admin.unknownWords.addModal.posNone")}</option>
						<option value="noun">{t("admin.unknownWords.addModal.posNoun")}</option>
						<option value="verb">{t("admin.unknownWords.addModal.posVerb")}</option>
						<option value="adjective">{t("admin.unknownWords.addModal.posAdj")}</option>
						<option value="adverb">{t("admin.unknownWords.addModal.posAdv")}</option>
						<option value="particle">{t("admin.unknownWords.addModal.posParticle")}</option>
					</select>
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
					<select
						value={level}
						onChange={onLevelChange}
						className={selectCls}
						style={{
							backgroundImage: CHEVRON_BG,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "right 8px center",
						}}
					>
						<option value="">{t("admin.unknownWords.addModal.levelNone")}</option>
						{["A1", "A2", "B1", "B2", "C1", "C2"].map((l) => (
							<option key={l} value={l}>{l}</option>
						))}
					</select>
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
