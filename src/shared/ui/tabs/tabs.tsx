"use client";
import type { ComponentProps } from 'react';
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/shared/lib/cn";

export type TabsProps = ComponentProps<typeof TabsPrimitive.Root>;

export const Tabs = ({ className, ...props }: TabsProps) => (
	<TabsPrimitive.Root
		data-slot="tabs"
		className={cn("flex flex-col gap-2", className)}
		{...props}
	/>
);

export type TabBarProps = ComponentProps<typeof TabsPrimitive.List>;

export const TabBar = ({ className, ...props }: TabBarProps) => (
	<TabsPrimitive.List
		data-slot="tab-bar"
		className={cn(
			"inline-flex w-fit gap-[2px] p-[3px] bg-surf-2 rounded-[8px]",
			className,
		)}
		{...props}
	/>
);

export type TabItemProps = ComponentProps<typeof TabsPrimitive.Trigger>;

export const TabItem = ({ className, ...props }: TabItemProps) => (
	<TabsPrimitive.Trigger
		data-slot="tab-item"
		className={cn(
			"flex items-center gap-[5px] px-[14px] py-[5px] rounded-[6px]",
			"text-[12px] font-medium font-[inherit] cursor-pointer outline-none",
			"transition-colors duration-150",
			"focus-visible:ring-2 focus-visible:ring-acc/40",
			"data-[state=inactive]:bg-transparent data-[state=inactive]:text-t-3 hover:data-[state=inactive]:text-t-2",
			"data-[state=active]:bg-surf data-[state=active]:text-t-1 data-[state=active]:shadow-sm",
			"disabled:opacity-40 disabled:cursor-not-allowed",
			className,
		)}
		{...props}
	/>
);

export type TabCountProps = ComponentProps<"span">;

export const TabCount = ({ className, ...props }: TabCountProps) => (
	<span
		data-slot="tab-count"
		className={cn(
			"px-[5px] py-px rounded-[4px] bg-surf-3 text-t-3",
			"text-[10px] font-semibold leading-tight",
			className,
		)}
		{...props}
	/>
);

export type TabContentProps = ComponentProps<typeof TabsPrimitive.Content>;

export const TabContent = ({ className, ...props }: TabContentProps) => (
	<TabsPrimitive.Content
		data-slot="tab-content"
		className={cn("outline-none", className)}
		{...props}
	/>
);
