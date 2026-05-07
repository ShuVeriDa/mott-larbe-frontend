"use client";

import type { AdminUserDetail } from "@/entities/admin-user";
import type { useAdminUserMutations } from "@/entities/admin-user/model/use-admin-user-mutations";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";
import { useParams } from "next/navigation";

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

	return (
		<div className="sticky top-0 z-10 flex items-center gap-2.5 border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-sm:px-3.5 max-sm:py-2.5">
			<nav className="flex items-center gap-1.5 text-[13px] text-t-3 max-sm:text-[12px]">
				<Link
					href={`/${lang}/admin/users`}
					className="transition-colors hover:text-t-2"
				>
					{t("admin.users.title")}
				</Link>
				<svg
					width="12"
					height="12"
					viewBox="0 0 16 16"
					fill="none"
					className="text-t-4"
				>
					<path
						d="M6 4l4 4-4 4"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
				<span className="font-medium text-t-1">
					{user ? `${user.name} ${user.surname}` : "…"}
				</span>
			</nav>

			<div className="ml-auto flex items-center gap-1.5 max-sm:hidden">
				{(isActive || isFrozen) && (
					<button
						onClick={() =>
							isFrozen
								? mutations.unfreeze.mutate(user!.id)
								: mutations.freeze.mutate(user!.id)
						}
						disabled={
							mutations.freeze.isPending || mutations.unfreeze.isPending
						}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-amb/25 px-2.5 text-[12px] font-medium text-amb-t transition-colors hover:bg-amb-bg disabled:opacity-50"
					>
						{isFrozen
							? t("admin.users.actions.unfreeze")
							: t("admin.users.actions.freeze")}
					</button>
				)}
				{(isActive || isFrozen || isBlocked) && (
					<button
						onClick={() =>
							isBlocked
								? mutations.unblock.mutate(user!.id)
								: mutations.block.mutate(user!.id)
						}
						disabled={mutations.block.isPending || mutations.unblock.isPending}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-red/25 px-2.5 text-[12px] font-medium text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
					>
						{isBlocked
							? t("admin.users.actions.unblock")
							: t("admin.users.actions.block")}
					</button>
				)}
			</div>
		</div>
	);
};
