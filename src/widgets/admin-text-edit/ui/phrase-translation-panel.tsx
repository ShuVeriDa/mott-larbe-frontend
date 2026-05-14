"use client";

import type { TextLanguage } from "@/entities/admin-text";
import { adminTextPhraseApi, adminTextPhraseKeys } from "@/entities/admin-text-phrase";
import type { PhraseLanguage } from "@/entities/admin-text-phrase";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Languages, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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

	// Listen for programmatic open from bubble menu button
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

	if (typeof window === "undefined" || !showForm) return null;

	// Translation form modal
	return createPortal(
		<>
			<div
				className="fixed inset-0 z-199 bg-black/30 backdrop-blur-[2px]"
				onClick={handleClose}
				aria-hidden="true"
			/>
			<div
				data-phrase-panel="true"
				role="dialog"
				aria-modal="true"
				className="fixed left-1/2 top-1/2 z-200 w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-hairline border-bd-2 bg-surf shadow-xl"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-hairline border-bd-1 px-4 py-3">
					<div className="flex items-center gap-2">
						<Languages className="size-4 text-violet-500" strokeWidth={1.6} />
						<span className="text-[13px] font-semibold text-t-1">
							{t("admin.texts.editPage.addPhraseTranslation")}
						</span>
					</div>
					<button
						onClick={handleClose}
						className="rounded-md p-1 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="space-y-3 p-4">
					{/* Original phrase — read-only, shown for context */}
					<div>
						<InputLabel>{t("admin.texts.editPage.phraseOriginal")}</InputLabel>
						<div className="rounded-base border-hairline border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 opacity-70 select-none">
							{selectedText}
						</div>
					</div>

					{/* Translation */}
					<div>
						<InputLabel htmlFor="phrase-translation">
							{t("admin.texts.editPage.phraseTranslation")}
						</InputLabel>
						<Input
							id="phrase-translation"
							ref={translationRef}
							value={translation}
							onChange={e => setTranslation(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Enter") handleSave();
							}}
							placeholder={t(
								"admin.texts.editPage.phraseTranslationPlaceholder",
							)}
						/>
					</div>

					{/* Notes (optional) */}
					<div>
						<InputLabel htmlFor="phrase-notes">
							{t("admin.texts.editPage.phraseNotes")}
						</InputLabel>
						<Input
							id="phrase-notes"
							value={notes}
							onChange={e => setNotes(e.target.value)}
							placeholder={t("admin.texts.editPage.phraseNotesPlaceholder")}
						/>
					</div>

					<div className="flex gap-2 pt-1">
						<Button
							onClick={handleSave}
							disabled={!translation.trim() || isSaving}
							className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSaving ? "…" : t("admin.texts.editPage.phraseSave")}
						</Button>
						<Button
							onClick={handleClose}
							className="h-[34px] rounded-lg border-hairline border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
						>
							{t("admin.texts.editPage.phraseCancel")}
						</Button>
					</div>
				</div>
			</div>
		</>,
		document.body,
	);
};
