"use client";

import type { TextLanguage } from "@/entities/admin-text";
import type { PhraseLanguage } from "@/entities/admin-text-phrase";
import {
	adminTextPhraseApi,
	adminTextPhraseKeys,
} from "@/entities/admin-text-phrase";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useQueryClient } from "@tanstack/react-query";
import { Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PhraseTranslationPanelProps {
	textId: string;
	pageNumber: number;
	language: TextLanguage;
}

export const PHRASE_FORM_EVENT = "admin:open-phrase-form";
export const PHRASE_FORM_CLOSE_EVENT = "admin:close-phrase-form";

export const PhraseTranslationPanel = ({
	textId,
	pageNumber,
	language,
}: PhraseTranslationPanelProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const queryClient = useQueryClient();

	const [showForm, setShowForm] = useState(false);
	const [selectedText, setSelectedText] = useState("");
	const [translation, setTranslation] = useState("");
	const [notes, setNotes] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const translationRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handleOpen = (e: Event) => {
			const text = (e as CustomEvent<string>).detail;
			if (!text || text.length < 2) return;
			setSelectedText(text);
			setTranslation("");
			setNotes("");
			setShowForm(true);
			setTimeout(() => translationRef.current?.focus(), 50);
		};
		document.addEventListener(PHRASE_FORM_EVENT, handleOpen);
		return () => document.removeEventListener(PHRASE_FORM_EVENT, handleOpen);
	}, []);

	const handleClose = () => {
		setShowForm(false);
		setSelectedText("");
		setTranslation("");
		setNotes("");
		document.dispatchEvent(new Event(PHRASE_FORM_CLOSE_EVENT));
	};

	const handleTranslationChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setTranslation(e.currentTarget.value);

	const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setNotes(e.currentTarget.value);

	const handleTranslationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleSave();
	};

	const handleSave = async () => {
		if (!translation.trim()) return;
		setIsSaving(true);
		try {
			await adminTextPhraseApi.createAutoOccurrence({
				original: selectedText,
				translation: translation.trim(),
				language: language as PhraseLanguage,
				notes: notes.trim() || undefined,
				textId,
				pageNumber,
			});
			await queryClient.invalidateQueries({
				queryKey: adminTextPhraseKeys.byPage(textId, pageNumber),
			});
			success(t("admin.texts.editPage.phraseAdded"));
			handleClose();
		} catch {
			toastError(t("admin.texts.editPage.phraseFailed"));
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Modal
			open={showForm}
			onClose={handleClose}
			title={
				<span className="flex items-center gap-2">
					<Languages className="size-4 text-violet-500" strokeWidth={1.6} />
					{t("admin.texts.editPage.addPhraseTranslation")}
				</span>
			}
		>
			<InputLabel>{t("admin.texts.editPage.phraseOriginal")}</InputLabel>
			<div className="mb-3 rounded-base border-[0.5px] border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 opacity-70 select-none">
				{selectedText}
			</div>

			<InputLabel htmlFor="phrase-translation">
				{t("admin.texts.editPage.phraseTranslation")}
			</InputLabel>
			<Input
				id="phrase-translation"
				ref={translationRef}
				value={translation}
				onChange={handleTranslationChange}
				onKeyDown={handleTranslationKeyDown}
				placeholder={t("admin.texts.editPage.phraseTranslationPlaceholder")}
				className="mb-3"
			/>

			<InputLabel htmlFor="phrase-notes">
				{t("admin.texts.editPage.phraseNotes")}
			</InputLabel>
			<Input
				id="phrase-notes"
				value={notes}
				onChange={handleNotesChange}
				placeholder={t("admin.texts.editPage.phraseNotesPlaceholder")}
				className="mb-3"
			/>

			<ModalActions>
				<Button
					onClick={handleClose}
					className="h-[34px] rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("admin.texts.editPage.phraseCancel")}
				</Button>
				<Button
					onClick={handleSave}
					disabled={!translation.trim() || isSaving}
					className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isSaving ? "…" : t("admin.texts.editPage.phraseSave")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
