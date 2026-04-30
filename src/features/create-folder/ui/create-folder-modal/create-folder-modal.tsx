"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import { useCreateFolder } from "../../model";

export interface CreateFolderModalProps {
	open: boolean;
	onClose: () => void;
}

export const CreateFolderModal = ({ open, onClose }: CreateFolderModalProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useCreateFolder();
	const [name, setName] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		try {
			await mutateAsync({ name: name.trim() });
			setName("");
			onClose();
		} catch {
			// noop
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.folderModal.title")}
		>
			<form onSubmit={handleSubmit}>
				<InputLabel htmlFor="folder-name">
					{t("vocabulary.folderModal.nameLabel")}
				</InputLabel>
				<Input
					id="folder-name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder={t("vocabulary.folderModal.namePlaceholder")}
					className="mb-3"
					required
				/>
				<ModalActions>
					<Button
						variant="ghost"
						size="lg"
						className="flex-1"
						onClick={onClose}
					>
						{t("vocabulary.folderModal.cancel")}
					</Button>
					<Button
						type="submit"
						variant="action"
						size="lg"
						className="flex-1"
						disabled={isPending}
					>
						{t("vocabulary.folderModal.submit")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
