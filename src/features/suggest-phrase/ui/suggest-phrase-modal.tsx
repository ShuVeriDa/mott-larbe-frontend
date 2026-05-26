"use client";

import type { PhraseLang } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useSuggestPhrase } from "../model/use-suggest-phrase";

interface SuggestPhraseModalProps {
	open: boolean;
	onClose: () => void;
}

const INITIAL = {
	original: "",
	translation: "",
	lang: "che" as PhraseLang,
	context: "",
};

export const SuggestPhraseModal = ({
	open,
	onClose,
}: SuggestPhraseModalProps) => {
	const { t } = useI18n();
	const { mutate, isPending } = useSuggestPhrase();
	const [form, setForm] = useState(INITIAL);

	const handleOriginalChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setForm((prev) => ({ ...prev, original: e.currentTarget.value }));

	const handleTranslationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setForm((prev) => ({ ...prev, translation: e.currentTarget.value }));

	const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
		setForm((prev) => ({
			...prev,
			lang: e.currentTarget.value as PhraseLang,
		}));

	const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		setForm((prev) => ({ ...prev, context: e.currentTarget.value }));

	const handleClose = () => {
		setForm(INITIAL);
		onClose();
	};

	const handleSubmit = () => {
		if (!form.original.trim() || !form.translation.trim()) return;
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
					toast.error(t("phrasebook.suggestModal.error"));
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
			<form action={handleSubmit}>
				<InputLabel htmlFor="sp-original">
					{t("phrasebook.suggestModal.originalLabel")}
				</InputLabel>
				<Input
					id="sp-original"
					value={form.original}
					onChange={handleOriginalChange}
					placeholder={t("phrasebook.suggestModal.originalPlaceholder")}
					className="mb-3"
					required
				/>

				<InputLabel htmlFor="sp-translation">
					{t("phrasebook.suggestModal.translationLabel")}
				</InputLabel>
				<Input
					id="sp-translation"
					value={form.translation}
					onChange={handleTranslationChange}
					placeholder={t("phrasebook.suggestModal.translationPlaceholder")}
					className="mb-3"
					required
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
					<option value="che">{t("phrasebook.lang.che")}</option>
					<option value="ru">{t("phrasebook.lang.ru")}</option>
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
						onClick={handleClose}
						className="h-[34px] rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("phrasebook.suggestModal.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={
							isPending ||
							!form.original.trim() ||
							!form.translation.trim()
						}
						className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
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
