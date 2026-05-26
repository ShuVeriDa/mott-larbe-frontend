"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { MorphFormListItem } from "@/features/word-annotation";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface AnnotationDeleteModalProps {
	form: MorphFormListItem | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const AnnotationDeleteModal = ({
	form,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: AnnotationDeleteModalProps) => {
	return (
		<Modal
			open={!!form}
			onClose={onClose}
			title={t("admin.wordAnnotations.deleteModal.title")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.wordAnnotations.deleteModal.subtitle")}
			</Typography>

			{form && (
				<div className="mb-4 flex items-start gap-2 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<div className="flex-1">
						<Typography tag="p" className="font-display text-[14px] font-semibold text-t-1">
							{form.normalized}
						</Typography>
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
							→ {form.lemma.baseForm}
						</Typography>
					</div>
				</div>
			)}

			<ModalActions>
				<Button
					onClick={onClose}
					disabled={isDeleting}
					title={t("admin.wordAnnotations.deleteModal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.wordAnnotations.deleteModal.cancel")}
				</Button>
				<Button
					onClick={onConfirm}
					disabled={isDeleting}
					title={isDeleting ? t("admin.wordAnnotations.deleteModal.deleting") : t("admin.wordAnnotations.deleteModal.confirm")}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					{isDeleting
						? t("admin.wordAnnotations.deleteModal.deleting")
						: t("admin.wordAnnotations.deleteModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
