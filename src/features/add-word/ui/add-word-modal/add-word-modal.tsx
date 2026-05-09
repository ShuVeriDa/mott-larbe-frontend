"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Select } from "@/shared/ui/select";
import { CEFR_LEVELS } from "@/shared/types";
import { useAddWordModal } from "../../model";

export interface AddWordModalProps {
	open: boolean;
	onClose: () => void;
}

export const AddWordModal = ({ open, onClose }: AddWordModalProps) => {
	const {
		t,
		folders,
		isPending,
		word,
		translation,
		folderId,
		cefrLevel,
		error,
		handleSubmit,
		handleWordChange,
		handleTranslationChange,
		handleFolderChange,
		handleCefrLevelChange,
	} = useAddWordModal({ onClose });

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.addModal.title")}
		>
			<form action={handleSubmit}>
				<InputLabel htmlFor="add-word-input">
					{t("vocabulary.addModal.wordLabel")}
				</InputLabel>
				<Input
					id="add-word-input"
					value={word}
					onChange={handleWordChange}
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
					onChange={handleTranslationChange}
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
					onChange={handleFolderChange}
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
					onChange={handleCefrLevelChange}
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
					<Typography tag="p" className="mb-2 text-[12px] text-red" role="alert">
						{error}
					</Typography>
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
