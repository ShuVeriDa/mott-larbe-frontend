"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "./button";

type MotionButtonProps = HTMLMotionProps<"button"> &
	VariantProps<typeof buttonVariants>;

export const MotionButton = ({
	className,
	variant,
	size,
	type = "button",
	disabled,
	...props
}: MotionButtonProps) => {
	const resolvedVariant = variant ?? (className ? "bare" : undefined);

	return (
		<motion.button
			data-slot="button"
			type={type}
			disabled={disabled}
			whileTap={disabled ? {} : { scale: 0.97 }}
			className={cn(buttonVariants({ variant: resolvedVariant, size }), className)}
			{...props}
		/>
	);
};
