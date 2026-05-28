"use client";

import { cn } from "@/shared/lib/cn";
import { useToastViewport } from "@/shared/lib/toast";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ComponentProps } from "react";
import { createPortal } from "react-dom";

const ICON = {
	success: <CheckCircle2 className="mt-px size-4 shrink-0 text-grn" strokeWidth={1.7} />,
	error: <AlertCircle className="mt-px size-4 shrink-0 text-red-token" strokeWidth={1.7} />,
	default: <Info className="mt-px size-4 shrink-0 text-acc" strokeWidth={1.7} />,
};

export const ToastViewport = () => {
	const { items, mounted, handleDismiss } = useToastViewport();

	if (!mounted || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="region"
			aria-live="polite"
			aria-label="Notifications"
			className="pointer-events-none fixed bottom-5 right-4 z-300 flex w-[300px] flex-col gap-2"
		>
			{items.map(item => {
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> =
					() => handleDismiss(item.id);

				return (
					<div
						key={item.id}
						className={cn(
							"pointer-events-auto flex items-start gap-3 rounded-xl border-[0.5px] px-3.5 py-3 shadow-lg animate-[fadeUp_0.18s_ease]",
							item.variant === "success" && "border-grn/30 bg-grn-bg",
							item.variant === "error" && "border-red-token/30 bg-red-bg",
							item.variant === "default" && "border-acc/20 bg-acc-bg",
						)}
					>
						{ICON[item.variant]}
						<p className={cn(
							"flex-1 text-[12.5px] leading-normal",
							item.variant === "success" && "text-grn-t",
							item.variant === "error" && "text-red-t",
							item.variant === "default" && "text-acc-t",
						)}>
							{item.message}
						</p>
						<button
							onClick={handleClick}
							aria-label="Dismiss"
							className={cn(
								"mt-px shrink-0 transition-colors",
								item.variant === "success" && "text-grn/50 hover:text-grn",
								item.variant === "error" && "text-red-token/50 hover:text-red-token",
								item.variant === "default" && "text-acc/40 hover:text-acc",
							)}
						>
							<X className="size-3.5" strokeWidth={1.6} />
						</button>
					</div>
				);
			})}
		</div>,
		document.body,
	);
};
