"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";

export interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: ReactNode;
	children: ReactNode;
	className?: string;
}

export const Modal = ({
	open,
	onClose,
	title,
	children,
	className,
}: ModalProps) => {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [open, onClose]);

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-[200] flex items-end justify-center bg-black/25 backdrop-blur-[2px] sm:items-center"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				className={cn(
					"w-full max-w-[340px] rounded-t-[16px] sm:rounded-[14px]",
					"border-hairline border-bd-2 bg-surf shadow-md",
					"px-5 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))]",
					"sm:p-6 sm:pb-6 animate-[fadeUp_0.2s_ease]",
					className,
				)}
			>
				{title ? (
					<h2 className="font-display text-[18px] text-t-1 mb-4">{title}</h2>
				) : null}
				{children}
			</div>
		</div>,
		document.body,
	);
};

export interface ModalActionsProps {
	children: ReactNode;
	className?: string;
}

export const ModalActions = ({ children, className }: ModalActionsProps) => (
	<div className={cn("mt-2 flex gap-2", className)}>{children}</div>
);
