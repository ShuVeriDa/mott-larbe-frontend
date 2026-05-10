"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { ComponentProps } from "react";

interface AdminTextConfirmModalProps {
	title: string;
	description: string;
	cancelLabel: string;
	confirmLabel: string;
	isConfirming?: boolean;
	closeOnBackdropClick?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export const AdminTextConfirmModal = ({
	title,
	description,
	cancelLabel,
	confirmLabel,
	isConfirming = false,
	closeOnBackdropClick = false,
	onConfirm,
	onCancel,
}: AdminTextConfirmModalProps) => {
	const handleContainerClick: NonNullable<ComponentProps<"div">["onClick"]> = e =>
		e.stopPropagation();
	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = () => {
		if (!closeOnBackdropClick || isConfirming) return;
		onCancel();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
			onClick={handleBackdropClick}
		>
			<div
				className="w-full max-w-[360px] rounded-xl border border-bd-1 bg-surf p-6 shadow-xl"
				onClick={handleContainerClick}
			>
				<Typography tag="h2" className="text-base font-semibold text-t-1">
					{title}
				</Typography>
				<Typography tag="p" className="mt-2 text-sm text-t-3">
					{description}
				</Typography>

				<div className="mt-5 flex justify-end gap-2">
					<Button
						onClick={onCancel}
						disabled={isConfirming}
						className="rounded-lg border border-bd-1 px-4 py-1.5 text-sm text-t-2 transition-colors hover:bg-surf-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{cancelLabel}
					</Button>
					<Button
						onClick={onConfirm}
						disabled={isConfirming}
						className="rounded-lg bg-red px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{confirmLabel}
					</Button>
				</div>
			</div>
		</div>
	);
};
