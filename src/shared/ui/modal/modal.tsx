"use client";

import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { ComponentProps, type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { variants } from "@/shared/lib/animation";

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

	if (typeof window === "undefined") return null;

	const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
		if (/* intentional: backdrop-only click */ e.target === e.currentTarget)
			onClose();
	};

	return createPortal(
		<AnimatePresence>
			{open && (
				<motion.div
					role="dialog"
					aria-modal="true"
					className="fixed inset-0 z-200 flex items-end justify-center bg-black/25 backdrop-blur-[2px] sm:items-center"
					onClick={handleClick}
					variants={variants.fadeIn}
					initial="hidden"
					animate="visible"
					exit="exit"
				>
					<motion.div
						className={cn(
							"w-full max-w-[340px] rounded-t-[16px] sm:rounded-[14px]",
							"border-[0.5px] border-bd-2 bg-surf shadow-md",
							"px-5 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))]",
							"sm:p-6 sm:pb-6",
							className,
						)}
						variants={variants.fadeUp}
					>
						{title ? (
							<Typography
								tag="h2"
								className="font-display text-[18px] text-t-1 mb-4"
							>
								{title}
							</Typography>
						) : null}
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
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
