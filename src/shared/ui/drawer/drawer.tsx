"use client";

import { ComponentProps } from 'react';
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/shared/lib/cn"

const Drawer = ({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root data-slot="drawer" {...props} />
)

const DrawerTrigger = ({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Trigger>) => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
)

const DrawerPortal = ({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Portal>) => (
  <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
)

const DrawerClose = ({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Close>) => (
  <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
)

const DrawerOverlay = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Overlay>) => (
  <DrawerPrimitive.Overlay
    data-slot="drawer-overlay"
    className={cn(
      "fixed inset-0 z-100 bg-black/35 backdrop-blur-[2px]",
      className
    )}
    {...props}
  />
)

const DrawerContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content>) => (
  <DrawerPortal data-slot="drawer-portal">
    <DrawerOverlay />
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className={cn(
        "fixed inset-x-0 bottom-0 z-100 flex flex-col bg-surf text-sm text-t-1",
        "rounded-t-2xl border-t border-bd-1",
        "focus:outline-none",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="mx-auto mt-3 mb-1 h-1 w-9 shrink-0 rounded-full bg-bd-2"
      />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
)

const DrawerHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="drawer-header"
    className={cn("flex shrink-0 items-center justify-between border-b border-bd-1 px-4 py-3", className)}
    {...props}
  />
)

const DrawerFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="drawer-footer"
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)

const DrawerTitle = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title
    data-slot="drawer-title"
    className={cn("text-[13px] font-semibold text-t-1", className)}
    {...props}
  />
)

const DrawerDescription = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) => (
  <DrawerPrimitive.Description
    data-slot="drawer-description"
    className={cn("text-sm text-t-3", className)}
    {...props}
  />
)

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
