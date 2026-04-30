"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { useI18n } from "@/shared/lib/i18n";
import { CEFR_LEVELS, type CefrLevel } from "@/shared/types";
import { useFolders } from "@/entities/folder";
import { useAddWord } from "../../model";

export interface AddWordModalProps {
	open: boolean;
	onClose: () => void;
}

export const AddWordModal = ({ open, onClose }: AddWordModalProps) => {
	const { t } = useI18n();
	const { data: folders } = useFolders();
	const { mutateAsync, isPending } = useAddWord();

	const [word, setWord] = useState("");
	const [translation, setTranslation] = useState("");
	const [folderId, setFolderId] = useState<string>("");
	const [cefrLevel, setCefrLevel] = useState<string>("");

	const reset = () => {
		setWord("");
		setTranslation("");
		setFolderId("");
		setCefrLevel("");
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!word.trim() || !translation.trim()) return;
		try {
			await mutateAsync({
				word: word.trim(),
				translation: translation.trim(),
				folderId: folderId || null,
				cefrLevel: (cefrLevel as CefrLevel) || null,
			});
			reset();
			onClose();
		} catch {
			// surfaced via mutation state; toast handled at app level if needed
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.addModal.title")}
		>
			<form onSubmit={handleSubmit}>
				<InputLabel htmlFor="add-word-input">
					{t("vocabulary.addModal.wordLabel")}
				</InputLabel>
				<Input
					id="add-word-input"
					value={word}
					onChange={(e) => setWord(e.target.value)}
					placeholder={t("vocabulary.addModal.wordPlaceholder")}
					className="mb-3"
					required
				/>

				<InputLabel htmlFor="add-word-translation">
					{t("vocabulary.addModal.translationLabel")}
				</InputLabel>
				<Input
					id="add-word-translation"
					value={translation}
					onChange={(e) => setTranslation(e.target.value)}
					placeholder={t("vocabulary.addModal.translationPlaceholder")}
					className="mb-3"
					required
				/>

				<InputLabel htmlFor="add-word-folder">
					{t("vocabulary.addModal.folderLabel")}
				</InputLabel>
				<Select
					id="add-word-folder"
					value={folderId}
					onChange={(e) => setFolderId(e.target.value)}
					wrapperClassName="mb-3"
				>
					<option value="">{t("vocabulary.card.noFolder")}</option>
					{folders?.map((f) => (
						<option key={f.id} value={f.id}>
							{f.name}
						</option>
					))}
				</Select>

				<InputLabel htmlFor="add-word-level">
					{t("vocabulary.addModal.levelLabel")}
				</InputLabel>
				<Select
					id="add-word-level"
					value={cefrLevel}
					onChange={(e) => setCefrLevel(e.target.value)}
					wrapperClassName="mb-3"
				>
					<option value="">—</option>
					{CEFR_LEVELS.map((lvl) => (
						<option key={lvl} value={lvl}>
							{lvl}
						</option>
					))}
				</Select>

				<ModalActions>
					<Button
						variant="ghost"
						className="flex-1"
						size="lg"
						onClick={onClose}
					>
						{t("vocabulary.addModal.cancel")}
					</Button>
					<Button
						type="submit"
						variant="action"
						size="lg"
						className="flex-1"
						disabled={isPending}
					>
						{t("vocabulary.addModal.submit")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
