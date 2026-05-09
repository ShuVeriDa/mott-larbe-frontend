"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminUserListItem } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user/model/use-admin-user-mutations";

interface UserRowActionsProps {
	user: AdminUserListItem;
	mutations: ReturnType<typeof useAdminUserMutations>;
}

export const UserRowActions = ({ user, mutations }: UserRowActionsProps) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node /* intentional: outside-click target */)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	const isPending =
		mutations.block.isPending ||
		mutations.unblock.isPending ||
		mutations.freeze.isPending ||
		mutations.unfreeze.isPending ||
		mutations.remove.isPending;

	const btnClass =
		"flex size-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1";
	const menuItemClass =
		"flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2.5 py-2 text-left font-sans text-[13px] text-t-1 transition-colors hover:bg-surf-2";
	const menuDangerClass =
		"flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2.5 py-2 text-left font-sans text-[13px] text-red-t transition-colors hover:bg-red-bg";

	const handleOpenProfileClick: NonNullable<ComponentProps<"button">["onClick"]> = () => router.push(`/${lang}/admin/users/${user.id}`);
	const handleMenuToggleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setOpen((v) => !v);
	const handleMenuOpenProfileClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		setOpen(false);
		router.push(`/${lang}/admin/users/${user.id}`);
	};
	const handleFreezeClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		setOpen(false);
		mutations.freeze.mutate(user.id);
	};
	const handleUnfreezeClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		setOpen(false);
		mutations.unfreeze.mutate(user.id);
	};
	const handleUnblockClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		setOpen(false);
		mutations.unblock.mutate(user.id);
	};
	const handleBlockClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		setOpen(false);
		mutations.block.mutate(user.id);
	};
	const handleDeleteClick: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		setOpen(false);
		mutations.remove.mutate(user.id);
	};
return (
		<div className="flex items-center justify-end gap-0.5">
			<Button
				aria-label={t("admin.users.actions.openProfile")}
				className={btnClass}
				onClick={handleOpenProfileClick}
			>
				<svg className="size-3.5" viewBox="0 0 16 16" fill="none">
					<path
						d="M2 8h12M8 2l6 6-6 6"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Button>

			<div ref={menuRef} className="relative">
				<Button
					className={btnClass}
					onClick={handleMenuToggleClick}
					disabled={isPending}
				>
					<svg className="size-3.5" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="4" r="1" fill="currentColor" />
						<circle cx="8" cy="8" r="1" fill="currentColor" />
						<circle cx="8" cy="12" r="1" fill="currentColor" />
					</svg>
				</Button>

				{open && (
					<div className="absolute right-0 top-[calc(100%+4px)] z-300 min-w-[170px] rounded-[10px] border border-bd-2 bg-surf p-1 shadow-md">
						<Button
							className={menuItemClass}
							onClick={handleMenuOpenProfileClick}
						>
							<svg
								className="size-3.5 shrink-0 text-t-3"
								viewBox="0 0 16 16"
								fill="none"
							>
								<circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
								<path
									d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
									stroke="currentColor"
									strokeWidth="1.3"
									strokeLinecap="round"
								/>
							</svg>
							{t("admin.users.actions.openProfile")}
						</Button>

						<div className="my-[3px] h-px bg-bd-1" />

						{user.status === "ACTIVE" && (
							<Button
								className={menuItemClass}
								onClick={handleFreezeClick}
							>
								<svg
									className="size-3.5 shrink-0 text-t-3"
									viewBox="0 0 16 16"
									fill="none"
								>
									<path
										d="M8 2v4M8 10v4M2 8h4M10 8h4"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
									/>
								</svg>
								{t("admin.users.actions.freeze")}
							</Button>
						)}

						{user.status === "FROZEN" && (
							<Button
								className={menuItemClass}
								onClick={handleUnfreezeClick}
							>
								<svg
									className="size-3.5 shrink-0 text-t-3"
									viewBox="0 0 16 16"
									fill="none"
								>
									<path
										d="M5 8h6"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
									/>
									<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
								</svg>
								{t("admin.users.actions.unfreeze")}
							</Button>
						)}

						{user.status === "BLOCKED" && (
							<Button
								className={menuItemClass}
								onClick={handleUnblockClick}
							>
								<svg
									className="size-3.5 shrink-0 text-t-3"
									viewBox="0 0 16 16"
									fill="none"
								>
									<path
										d="M4 8h8"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
									/>
									<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
								</svg>
								{t("admin.users.actions.unblock")}
							</Button>
						)}

						{(user.status === "ACTIVE" || user.status === "FROZEN") && (
							<Button
								className={menuDangerClass}
								onClick={handleBlockClick}
							>
								<svg
									className="size-3.5 shrink-0 text-red-t"
									viewBox="0 0 16 16"
									fill="none"
								>
									<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
									<path
										d="M10 6L6 10M6 6l4 4"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
									/>
								</svg>
								{t("admin.users.actions.block")}
							</Button>
						)}

						{user.status === "BLOCKED" && (
							<Button
								className={menuDangerClass}
								onClick={handleDeleteClick}
							>
								<svg
									className="size-3.5 shrink-0 text-red-t"
									viewBox="0 0 16 16"
									fill="none"
								>
									<path
										d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
									/>
									<path
										d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
									/>
								</svg>
								{t("admin.users.actions.delete")}
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
