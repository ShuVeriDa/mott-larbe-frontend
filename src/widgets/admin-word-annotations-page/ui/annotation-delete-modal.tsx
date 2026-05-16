"use client";

import { ComponentProps } from "react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { MorphFormListItem } from "@/features/word-annotation";

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
	if (!form) return null;

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleBackdropClick}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.wordAnnotations.deleteModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.wordAnnotations.deleteModal.subtitle")}
				</Typography>

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

				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button variant="ghost" size="default" onClick={onClose} disabled={isDeleting}>
						{t("admin.wordAnnotations.deleteModal.cancel")}
					</Button>
					<Button
						variant="bare"
						size="default"
						onClick={onConfirm}
						disabled={isDeleting}
						className="h-[30px] cursor-pointer rounded-base bg-red-500 px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50"
					>
						{isDeleting
							? t("admin.wordAnnotations.deleteModal.deleting")
							: t("admin.wordAnnotations.deleteModal.confirm")}
					</Button>
				</div>
			</div>
		</div>
	);
};
