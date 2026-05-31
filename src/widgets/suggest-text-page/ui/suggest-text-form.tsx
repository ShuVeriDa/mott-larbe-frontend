"use client";

import { Input, InputLabel } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Typography } from "@/shared/ui/typography";
import { useSuggestTextPage } from "../model/use-suggest-text-page";
import { SuggestTextSubmitButton } from "./suggest-text-submit-button";

const LANGUAGE_OPTIONS = ["che", "ru", "en", "other"] as const;
const MAX_CONTENT_LENGTH = 100_000;

interface SuggestTextFormProps {
	hook: ReturnType<typeof useSuggestTextPage>;
}

export const SuggestTextForm = ({ hook }: SuggestTextFormProps) => {
	const {
		t,
		title,
		language,
		author,
		sourceUrl,
		content,
		comment,
		sourceError,
		isPending,
		contentLength,
		handleTitleChange,
		handleLanguageChange,
		handleAuthorChange,
		handleSourceUrlChange,
		handleContentChange,
		handleCommentChange,
		handleSubmit,
	} = hook;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<div>
				<InputLabel htmlFor="suggest-text-title">
					{t("suggestTextPage.form.title")}
				</InputLabel>
				<Input
					id="suggest-text-title"
					value={title}
					onChange={handleTitleChange}
					placeholder={t("suggestTextPage.form.titlePlaceholder")}
					disabled={isPending}
					required
					aria-required="true"
					className="w-full"
				/>
			</div>

			<div>
				<InputLabel htmlFor="suggest-text-language">
					{t("suggestTextPage.form.language")}
				</InputLabel>
				<Select
					id="suggest-text-language"
					value={language}
					onChange={handleLanguageChange}
					disabled={isPending}
					aria-required="true"
				>
					{LANGUAGE_OPTIONS.map((lang) => (
						<option key={lang} value={lang}>
							{t(`suggestTextPage.languages.${lang}`)}
						</option>
					))}
				</Select>
			</div>

			<div>
				<InputLabel htmlFor="suggest-text-author">
					{t("suggestTextPage.form.author")}
				</InputLabel>
				<Input
					id="suggest-text-author"
					value={author}
					onChange={handleAuthorChange}
					placeholder={t("suggestTextPage.form.authorPlaceholder")}
					disabled={isPending}
					className="w-full"
				/>
			</div>

			<div>
				<InputLabel htmlFor="suggest-text-source-url">
					{t("suggestTextPage.form.sourceUrl")}
				</InputLabel>
				<Input
					id="suggest-text-source-url"
					type="url"
					value={sourceUrl}
					onChange={handleSourceUrlChange}
					placeholder={t("suggestTextPage.form.sourceUrlPlaceholder")}
					disabled={isPending}
					className="w-full"
					aria-describedby={sourceError ? "suggest-text-source-error" : undefined}
				/>
			</div>

			<div>
				<InputLabel htmlFor="suggest-text-content">
					{t("suggestTextPage.form.content")}
				</InputLabel>
				<Textarea
					id="suggest-text-content"
					value={content}
					onChange={handleContentChange}
					placeholder={t("suggestTextPage.form.contentPlaceholder")}
					disabled={isPending}
					rows={6}
					maxLength={MAX_CONTENT_LENGTH}
					variant="reader"
					className="w-full bg-surf-2 border-[0.5px] border-bd-2"
					aria-describedby={sourceError ? "suggest-text-source-error" : undefined}
				/>
				<Typography tag="p" className="mt-1 text-right text-[11px] text-t-3">
					{contentLength.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()}
				</Typography>
			</div>

			{sourceError && (
				<div
					id="suggest-text-source-error"
					role="alert"
					className="rounded-base border border-red/30 bg-red/10 px-3 py-2 text-[13px] text-red"
				>
					{t("suggestTextPage.form.sourceRequired")}
				</div>
			)}

			<div>
				<InputLabel htmlFor="suggest-text-comment">
					{t("suggestTextPage.form.comment")}
				</InputLabel>
				<Textarea
					id="suggest-text-comment"
					value={comment}
					onChange={handleCommentChange}
					placeholder={t("suggestTextPage.form.commentPlaceholder")}
					disabled={isPending}
					rows={2}
					variant="reader"
					className="w-full bg-surf-2 border-[0.5px] border-bd-2"
				/>
			</div>

			<div className="flex justify-end pt-1">
				<SuggestTextSubmitButton isPending={isPending} />
			</div>
		</form>
	);
};
