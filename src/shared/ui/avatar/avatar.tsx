"use client";

import { cn } from "@/shared/lib/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

export const avatarVariants = cva(
	[
		"inline-flex items-center justify-center shrink-0 select-none overflow-hidden",
		"rounded-full bg-acc-bg text-acc-t font-semibold uppercase",
	],
	{
		variants: {
			size: {
				default: "size-[30px] text-[11px]",
				md: "size-5 text-[10px] border-1 border-black",
				lg: "size-10 text-[14px]",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root> &
	VariantProps<typeof avatarVariants> & {
		src?: string;
		alt?: string;
	};

export const Avatar = ({
	className,
	size,
	src,
	alt,
	children,
	...props
}: AvatarProps) => (
	<AvatarPrimitive.Root
		data-slot="avatar"
		className={cn(avatarVariants({ size }), className)}
		{...props}
	>
		{src ? (
			<AvatarPrimitive.Image
				src={src}
				alt={alt ?? ""}
				className="size-full object-cover"
			/>
		) : null}
		<AvatarPrimitive.Fallback
			delayMs={src ? 600 : undefined}
			className="inline-flex items-center justify-center size-full"
		>
			{children}
		</AvatarPrimitive.Fallback>
	</AvatarPrimitive.Root>
);
