"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import type { AdminUserDetail } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user/model/use-admin-user-mutations";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface UserDetailTopbarProps {
	user: AdminUserDetail | undefined;
	mutations: ReturnType<typeof useAdminUserMutations>;
}

export const UserDetailTopbar = ({
	user,
	mutations,
}: UserDetailTopbarProps) => {
	const { t } = useI18n();
	const { lang } = useParams<{ lang: string }>();

	const isActive = user?.status === "ACTIVE";
	const isFrozen = user?.status === "FROZEN";
	const isBlocked = user?.status === "BLOCKED";

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
							isFrozen
								? mutations.unfreeze.mutate(user!.id)
								: mutations.freeze.mutate(user!.id);
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () =>
							isBlocked
								? mutations.unblock.mutate(user!.id)
								: mutations.block.mutate(user!.id);
return (
		<header className=" flex items-center gap-2.5 border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-sm:px-3.5 max-sm:py-2.5">
			<nav className="flex items-center gap-1.5 text-[13px] text-t-3 max-sm:text-[12px]">
				<Link
					href={`/${lang}/admin/users`}
					className="transition-colors hover:text-t-2"
				>
					{t("admin.users.title")}
				</Link>
				<ChevronRight className="size-3 text-t-4" />
				<Typography tag="span" className="font-medium text-t-1">
					{user ? `${user.name} ${user.surname}` : "…"}
				</Typography>
			</nav>

			<div className="ml-auto flex items-center gap-1.5 max-sm:hidden">
				{(isActive || isFrozen) && (
					<Button
						onClick={handleClick
						}
						disabled={
							mutations.freeze.isPending || mutations.unfreeze.isPending
						}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-amb/25 px-2.5 text-[12px] font-medium text-amb-t transition-colors hover:bg-amb-bg disabled:opacity-50"
					>
						{isFrozen
							? t("admin.users.actions.unfreeze")
							: t("admin.users.actions.freeze")}
					</Button>
				)}
				{(isActive || isFrozen || isBlocked) && (
					<Button
						onClick={handleClick2
						}
						disabled={mutations.block.isPending || mutations.unblock.isPending}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-red/25 px-2.5 text-[12px] font-medium text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
					>
						{isBlocked
							? t("admin.users.actions.unblock")
							: t("admin.users.actions.block")}
					</Button>
				)}
			</div>
		</header>
	);
};
