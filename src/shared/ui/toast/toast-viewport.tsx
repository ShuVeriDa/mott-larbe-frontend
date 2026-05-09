"use client";
import { ComponentProps } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";
import { useToastViewport } from "@/shared/lib/toast";

export const ToastViewport = () => {
	const { items, mounted, handleDismiss } = useToastViewport();

	if (!mounted || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="region"
			aria-live="polite"
			aria-label="Notifications"
			className="pointer-events-none fixed inset-x-0 bottom-6 z-[300] flex flex-col items-center gap-2 px-4"
		>
			{items.map((item) => {
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
					handleDismiss(item.id);
			  return (
				<button
					key={item.id}
					type="button"
					onClick={handleClick}
					className={cn(
						"pointer-events-auto min-w-[240px] max-w-[420px] rounded-base px-4 py-2 text-[12.5px] font-medium",
						"animate-[fadeUp_0.18s_ease] shadow-md",
						item.variant === "success" &&
							"border-hairline border-grn/30 bg-grn-bg text-grn-t",
						item.variant === "error" &&
							"border-hairline border-red/30 bg-red-bg text-red-t",
						item.variant === "default" && "bg-t-1 text-bg",
					)}
				>
					{item.message}
				</button>
			);
			})}
		</div>,
		document.body,
	);
};
