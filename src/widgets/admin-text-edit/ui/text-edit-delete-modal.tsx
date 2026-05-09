"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";

interface TextEditDeleteModalProps {
	textTitle: string;
	isDeleting: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const TextEditDeleteModal = ({
	textTitle,
	isDeleting,
	onConfirm,
	onCancel,
}: TextEditDeleteModalProps) => {
	const { t } = useI18n();

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => e.stopPropagation();
return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onClick={onCancel}
		>
			<div
				className="w-full max-w-[360px] rounded-xl bg-surf p-6 shadow-lg"
				onClick={handleClick}
			>
				<Typography tag="h2" className="mb-2 text-[15px] font-semibold text-t-1">
					{t("admin.texts.editPage.deleteConfirmTitle")}
				</Typography>
				<Typography tag="p" className="mb-5 text-[13px] leading-relaxed text-t-2">
					{t("admin.texts.editPage.deleteConfirmBody", { title: textTitle })}
				</Typography>
				<div className="flex justify-end gap-2">
					<Button
						onClick={onCancel}
						disabled={isDeleting}
						className="h-8 rounded-base border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] text-t-2 transition-colors hover:bg-surf-3 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{t("admin.texts.editPage.deleteCancel")}
					</Button>
					<Button
						onClick={onConfirm}
						disabled={isDeleting}
						className="h-8 rounded-base bg-red px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isDeleting ? "…" : t("admin.texts.editPage.deleteConfirm")}
					</Button>
				</div>
			</div>
		</div>
	);
};
