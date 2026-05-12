"use client";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { Avatar } from "@/shared/ui/avatar";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { useUserMenu } from "../model";
import { UserMenuContent } from "./user-menu-content";

const dropdownContentCls = cn(
	"z-50 w-56 rounded-lg overflow-hidden",
	"bg-surf border border-bd-1 shadow-lg",
	"origin-[var(--radix-dropdown-menu-content-transform-origin)]",
	"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
	"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
	"duration-150",
);

interface UserMenuProps {
	isCompactMode?: boolean;
	bottomNav?: boolean;
}

export const UserMenu = ({ isCompactMode = false, bottomNav = false }: UserMenuProps) => {
	const { user, open, setOpen, initials, displayName } = useUserMenu();

	if (!user) return null;

	if (bottomNav) {
		return (
			<DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
				<DropdownMenuPrimitive.Trigger asChild>
					<button
						type="button"
						className={cn(
							"flex flex-1 flex-col items-center justify-center gap-[3px] text-[10px] transition-colors focus-visible:outline-none",
							open ? "text-acc" : "text-t-3",
						)}
					>
						<Avatar size="default">{initials}</Avatar>
					</button>
				</DropdownMenuPrimitive.Trigger>
				<DropdownMenuPrimitive.Portal>
					<DropdownMenuPrimitive.Content
						side="top"
						align="end"
						sideOffset={8}
						className={dropdownContentCls}
					>
						<UserMenuContent />
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			</DropdownMenuPrimitive.Root>
		);
	}

	return (
		<DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
			<DropdownMenuPrimitive.Trigger asChild>
				<Button
					className={cn(
						"flex w-full items-center gap-2.5 min-h-fit rounded-none px-3.5 py-1.5 pb-3 text-left transition-[colors,padding,gap] duration-200",
						"hover:bg-surf-2 focus-visible:outline-none focus-visible:bg-surf-2",
						open && "bg-surf-2",
						isCompactMode && "max-[899px]:justify-center! max-[899px]:gap-0 max-[899px]:px-0 max-[899px]:py-2",
					)}
				>
					<Avatar size="default">{initials}</Avatar>
					<div
						className={cn(
							"min-w-0 flex-1 transition-[width,opacity] duration-200",
							isCompactMode && "max-[899px]:w-0 max-[899px]:flex-none max-[899px]:overflow-hidden max-[899px]:opacity-0",
						)}
					>
						<div className="truncate text-[12.5px] font-medium text-t-1">{displayName}</div>
						<div className="text-[11px] text-t-3">{user.email}</div>
					</div>
				</Button>
			</DropdownMenuPrimitive.Trigger>
			<DropdownMenuPrimitive.Portal>
				<DropdownMenuPrimitive.Content
					side="top"
					align="start"
					sideOffset={4}
					className={dropdownContentCls}
				>
					<UserMenuContent showThemeToggle />
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Portal>
		</DropdownMenuPrimitive.Root>
	);
};
