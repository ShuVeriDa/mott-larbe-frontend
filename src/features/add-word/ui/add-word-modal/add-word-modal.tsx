"use client";

import axios from "axios";
import { ComponentProps, type SyntheticEvent, useState } from 'react';
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
	const [error, setError] = useState<string | null>(null);

	const reset = () => {
		setWord("");
		setTranslation("");
		setFolderId("");
		setCefrLevel("");
		setError(null);
	};

	const handleSubmit = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		if (!word.trim() || !translation.trim()) return;
		setError(null);
		try {
			await mutateAsync({
				word: word.trim(),
				translation: translation.trim(),
				folderId: folderId || null,
				cefrLevel: (cefrLevel as CefrLevel) || null,
			});
			reset();
			onClose();
		} catch (err) {
			if (axios.isAxiosError(err) && err.response?.status === 403) {
				setError(t("vocabulary.limitReached"));
			}
		}
	};

		const handleChange: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) => setWord(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) => setTranslation(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<typeof Select>["onChange"]> = (e) => setFolderId(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<typeof Select>["onChange"]> = (e) => setCefrLevel(e.currentTarget.value);
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
					onChange={handleChange}
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
					onChange={handleChange2}
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
					onChange={handleChange3}
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
					onChange={handleChange4}
					wrapperClassName="mb-3"
				>
					<option value="">—</option>
					{CEFR_LEVELS.map((lvl) => (
						<option key={lvl} value={lvl}>
							{lvl}
						</option>
					))}
				</Select>

				{error ? (
					<p className="mb-2 text-[12px] text-red" role="alert">
						{error}
					</p>
				) : null}

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
