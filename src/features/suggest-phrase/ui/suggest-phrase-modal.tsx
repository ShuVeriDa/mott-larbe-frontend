"use client";

import { ChangeEvent, useState } from "react";
import { PhraseLang } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { useSuggestPhrase } from "../model/use-suggest-phrase";
import { RequiredMark } from "@/shared/ui/required-mark";

interface SuggestPhraseModalProps {
	open: boolean;
	onClose: () => void;
}

const INITIAL = {
	original: "",
	translation: "",
	lang: PhraseLang.CHE,
	context: "",
};

export const SuggestPhraseModal = ({
	open,
	onClose,
}: SuggestPhraseModalProps) => {
	const { t } = useI18n();
	const { mutate, isPending } = useSuggestPhrase();
	const [form, setForm] = useState(INITIAL);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const handleOriginalChange = (e: ChangeEvent<HTMLInputElement>) =>
		setForm((prev) => ({ ...prev, original: e.currentTarget.value }));

	const handleTranslationChange = (e: ChangeEvent<HTMLInputElement>) =>
		setForm((prev) => ({ ...prev, translation: e.currentTarget.value }));

	const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) =>
		setForm((prev) => ({
			...prev,
			lang: e.currentTarget.value as PhraseLang,
		}));

	const handleContextChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
		setForm((prev) => ({ ...prev, context: e.currentTarget.value }));

	const handleClose = () => {
		setForm(INITIAL);
		setSubmitError(null);
		onClose();
	};

	const handleSubmit = () => {
		if (!form.original.trim() || !form.translation.trim()) return;
		setSubmitError(null);
		mutate(
			{
				original: form.original.trim(),
				translation: form.translation.trim(),
				lang: form.lang,
				context: form.context.trim() || undefined,
			},
			{
				onSuccess: () => {
					toast.success(t("phrasebook.suggestModal.success"));
					handleClose();
				},
				onError: () => {
					setSubmitError(t("phrasebook.suggestModal.error"));
				},
			},
		);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={
				<span className="flex items-center gap-2">
					<MessageSquarePlus className="size-4 text-violet-500" strokeWidth={1.6} />
					{t("phrasebook.suggestModal.title")}
				</span>
			}
		>
			<form action={handleSubmit} aria-describedby={submitError ? "sp-error" : undefined}>
				{submitError && (
					<div
						id="sp-error"
						role="alert"
						aria-live="polite"
						className="mb-3 rounded-base px-3 py-2 bg-red-50 dark:bg-red-950/30 text-[12.5px] text-red-600 dark:text-red-400"
					>
						{submitError}
					</div>
				)}

				<InputLabel htmlFor="sp-original">
					{t("phrasebook.suggestModal.originalLabel")}
					<RequiredMark />
				</InputLabel>
				<Input
					id="sp-original"
					value={form.original}
					onChange={handleOriginalChange}
					placeholder={t("phrasebook.suggestModal.originalPlaceholder")}
					className="mb-3"
					required
					aria-required="true"
				/>

				<InputLabel htmlFor="sp-translation">
					{t("phrasebook.suggestModal.translationLabel")}
					<RequiredMark />
				</InputLabel>
				<Input
					id="sp-translation"
					value={form.translation}
					onChange={handleTranslationChange}
					placeholder={t("phrasebook.suggestModal.translationPlaceholder")}
					className="mb-3"
					required
					aria-required="true"
				/>

				<InputLabel htmlFor="sp-lang">
					{t("phrasebook.suggestModal.langLabel")}
				</InputLabel>
				<Select
					id="sp-lang"
					value={form.lang}
					onChange={handleLangChange}
					wrapperClassName="mb-3"
				>
					<option value={PhraseLang.CHE}>{t("shared.lang.CHE")}</option>
					<option value={PhraseLang.RU}>{t("shared.lang.RU")}</option>
				</Select>

				<InputLabel htmlFor="sp-context">
					{t("phrasebook.suggestModal.contextLabel")}
				</InputLabel>
				<Textarea
					id="sp-context"
					variant="reader"
					value={form.context}
					onChange={handleContextChange}
					placeholder={t("phrasebook.suggestModal.contextPlaceholder")}
					rows={2}
					className="mb-3"
				/>

				<ModalActions>
					<Button
						type="button"
						variant="ghost"
						onClick={handleClose}
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("phrasebook.suggestModal.cancel")}
					</Button>
					<Button
						type="submit"
						variant="action"
						disabled={
							isPending ||
							!form.original.trim() ||
							!form.translation.trim()
						}
						aria-busy={isPending}
						className="h-[34px] flex-1 rounded-lg text-[13px]"
					>
						{isPending
							? t("phrasebook.suggestModal.sending")
							: t("phrasebook.suggestModal.submit")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
